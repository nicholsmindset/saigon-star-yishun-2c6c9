-- Singapore Halal Directory - Initial Schema
-- This migration creates all core tables with Row Level Security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional user information
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_business_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AREAS TABLE
-- Singapore districts/neighborhoods for programmatic SEO
-- ============================================================================
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  business_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups
CREATE INDEX idx_areas_slug ON areas(slug);

-- ============================================================================
-- BUSINESSES TABLE
-- Core business listings with halal certification
-- ============================================================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Geolocation
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Area relationship
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,

  -- Halal certification
  halal_certification TEXT,
  certification_number TEXT,

  -- Featured listing status
  is_featured BOOLEAN DEFAULT FALSE,
  featured_expiry TIMESTAMPTZ,

  -- Business ownership
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT FALSE,

  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_businesses_area ON businesses(area_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_featured ON businesses(is_featured, featured_expiry);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_type ON businesses(business_type);

-- ============================================================================
-- BUSINESS_CLAIMS TABLE
-- Tracks business ownership claim requests
-- ============================================================================
CREATE TABLE business_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  verification_documents TEXT[], -- Array of document URLs
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

-- Create indexes for claim lookups
CREATE INDEX idx_claims_business ON business_claims(business_id);
CREATE INDEX idx_claims_user ON business_claims(user_id);
CREATE INDEX idx_claims_status ON business_claims(status);

-- ============================================================================
-- FEATURED_LISTINGS TABLE
-- Tracks featured listing purchases and history
-- ============================================================================
CREATE TABLE featured_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe payment details
  stripe_payment_id TEXT UNIQUE NOT NULL,
  stripe_charge_id TEXT,
  amount_paid INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'SGD',

  -- Duration details
  duration_months INTEGER NOT NULL CHECK (duration_months IN (1, 3, 6)),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ NOT NULL,

  -- Coupon tracking
  coupon_code TEXT,
  discount_amount INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for featured listing queries
CREATE INDEX idx_featured_business ON featured_listings(business_id);
CREATE INDEX idx_featured_user ON featured_listings(user_id);
CREATE INDEX idx_featured_active ON featured_listings(is_active, expiry_date);
CREATE INDEX idx_featured_stripe ON featured_listings(stripe_payment_id);

-- ============================================================================
-- IMAGES TABLE
-- Business photos (1 for standard, up to 8 for featured)
-- ============================================================================
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for image queries
CREATE INDEX idx_images_business ON images(business_id);
CREATE INDEX idx_images_order ON images(business_id, display_order);

-- ============================================================================
-- COUPON_CODES TABLE
-- Promotional codes for featured listing discounts
-- ============================================================================
CREATE TABLE coupon_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value INTEGER NOT NULL, -- Percentage (1-100) or fixed amount in cents

  -- Stripe integration
  stripe_coupon_id TEXT UNIQUE,

  -- Usage limits
  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,

  -- Validity period
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for coupon lookups
CREATE INDEX idx_coupons_code ON coupon_codes(code);
CREATE INDEX idx_coupons_active ON coupon_codes(is_active, valid_until);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- AREAS POLICIES
CREATE POLICY "Areas are viewable by everyone"
  ON areas FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can insert areas"
  ON areas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "Only admins can update areas"
  ON areas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- BUSINESSES POLICIES
CREATE POLICY "Approved businesses are viewable by everyone"
  ON businesses FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can submit a business (no auth required)"
  ON businesses FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Business owners can update their claimed businesses"
  ON businesses FOR UPDATE
  USING (
    claimed_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- BUSINESS_CLAIMS POLICIES
CREATE POLICY "Users can view their own claims"
  ON business_claims FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "Authenticated users can submit claims"
  ON business_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update claims"
  ON business_claims FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- FEATURED_LISTINGS POLICIES
CREATE POLICY "Anyone can view active featured listings"
  ON featured_listings FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Users can view their own featured listing history"
  ON featured_listings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Featured listings are created via Stripe webhook"
  ON featured_listings FOR INSERT
  WITH CHECK (TRUE); -- Webhook has service role key

-- IMAGES POLICIES
CREATE POLICY "Anyone can view images for approved businesses"
  ON images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = images.business_id
      AND businesses.status = 'approved'
    )
  );

CREATE POLICY "Business owners can manage their business images"
  ON images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = images.business_id
      AND businesses.claimed_by = auth.uid()
    )
  );

-- COUPON_CODES POLICIES
CREATE POLICY "Anyone can view active coupons"
  ON coupon_codes FOR SELECT
  USING (is_active = TRUE AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Only admins can manage coupons"
  ON coupon_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON business_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_featured_updated_at
  BEFORE UPDATE ON featured_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update area business count
CREATE OR REPLACE FUNCTION update_area_business_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
    UPDATE areas
    SET business_count = business_count + 1
    WHERE id = NEW.area_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'approved' AND NEW.status = 'approved' THEN
    UPDATE areas
    SET business_count = business_count + 1
    WHERE id = NEW.area_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE areas
    SET business_count = business_count - 1
    WHERE id = OLD.area_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE areas
    SET business_count = business_count - 1
    WHERE id = OLD.area_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply business count trigger
CREATE TRIGGER update_area_count
  AFTER INSERT OR UPDATE OR DELETE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_area_business_count();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to check featured listing expiry
CREATE OR REPLACE FUNCTION check_featured_expiry()
RETURNS void AS $$
BEGIN
  -- Mark expired featured listings as inactive
  UPDATE featured_listings
  SET is_active = FALSE
  WHERE is_active = TRUE
  AND expiry_date < NOW();

  -- Update businesses table for expired featured status
  UPDATE businesses
  SET is_featured = FALSE, featured_expiry = NULL
  WHERE is_featured = TRUE
  AND (featured_expiry IS NULL OR featured_expiry < NOW());
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert Singapore areas (first 10 popular districts)
INSERT INTO areas (name, slug, description, latitude, longitude) VALUES
  ('Bugis', 'bugis', 'Historic district known for shopping and street food', 1.3004, 103.8558),
  ('Orchard Road', 'orchard-road', 'Premier shopping and entertainment district', 1.3048, 103.8318),
  ('Marina Bay', 'marina-bay', 'Iconic waterfront area with Gardens by the Bay', 1.2868, 103.8545),
  ('Chinatown', 'chinatown', 'Cultural heritage district with traditional shops', 1.2837, 103.8446),
  ('Little India', 'little-india', 'Vibrant ethnic enclave with Indian culture', 1.3066, 103.8520),
  ('Geylang', 'geylang', 'Famous for authentic local food and durian stalls', 1.3138, 103.8911),
  ('Tampines', 'tampines', 'Major residential town in the East', 1.3496, 103.9568),
  ('Jurong East', 'jurong-east', 'Commercial and residential hub in the West', 1.3329, 103.7436),
  ('Woodlands', 'woodlands', 'Northern regional center near Malaysia', 1.4382, 103.7891),
  ('Bedok', 'bedok', 'Mature estate with hawker centers and beaches', 1.3236, 103.9273);
