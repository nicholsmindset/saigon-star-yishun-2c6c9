--
-- Singapore Halal Directory - Geocoding Enhancement Migration
-- Migration: 20251101222844_add_geo_indexes
--
-- This migration adds geographic indexes for efficient location-based queries
-- and ensures all businesses have default coordinates (Singapore center).
--
-- Note: The latitude/longitude columns already exist in the schema.
-- This migration adds:
-- 1. Composite indexes for geographic queries
-- 2. Comments for documentation
-- 3. Backfill default coordinates for existing records
--

-- Ensure all businesses have coordinates (default to Singapore center if null)
UPDATE businesses
SET
  latitude = COALESCE(latitude, 1.3521),
  longitude = COALESCE(longitude, 103.8198)
WHERE latitude IS NULL OR longitude IS NULL;

-- Same for areas
UPDATE areas
SET
  latitude = COALESCE(latitude, 1.3521),
  longitude = COALESCE(longitude, 103.8198)
WHERE latitude IS NULL OR longitude IS NULL;

-- Create composite index for geographic bounding box queries
-- This enables efficient "find businesses near X,Y" queries
CREATE INDEX IF NOT EXISTS idx_businesses_geo_bbox ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_areas_geo_bbox ON areas(latitude, longitude);

-- Add comments for documentation
COMMENT ON COLUMN businesses.latitude IS 'Geographic latitude in decimal degrees (WGS84 coordinate system). Default: 1.3521 (Singapore center)';
COMMENT ON COLUMN businesses.longitude IS 'Geographic longitude in decimal degrees (WGS84 coordinate system). Default: 103.8198 (Singapore center)';
COMMENT ON COLUMN areas.latitude IS 'Geographic latitude in decimal degrees (WGS84 coordinate system). Default: 1.3521 (Singapore center)';
COMMENT ON COLUMN areas.longitude IS 'Geographic longitude in decimal degrees (WGS84 coordinate system). Default: 103.8198 (Singapore center)';

-- Create function to calculate distance between two points (Haversine formula)
-- Returns distance in kilometers
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 NUMERIC(10,8),
  lon1 NUMERIC(11,8),
  lat2 NUMERIC(10,8),
  lon2 NUMERIC(11,8)
) RETURNS NUMERIC AS $$
DECLARE
  earth_radius NUMERIC := 6371; -- Earth's radius in kilometers
  dlat NUMERIC;
  dlon NUMERIC;
  a NUMERIC;
  c NUMERIC;
BEGIN
  -- Convert degrees to radians
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);

  -- Haversine formula
  a := sin(dlat/2) * sin(dlat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));

  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_distance IS 'Calculate distance between two geographic points using Haversine formula. Returns distance in kilometers.';

-- Create function to find nearby businesses
CREATE OR REPLACE FUNCTION find_nearby_businesses(
  search_lat NUMERIC(10,8),
  search_lon NUMERIC(11,8),
  radius_km NUMERIC DEFAULT 5,
  limit_count INTEGER DEFAULT 20
) RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  business_type TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name,
    b.address,
    b.business_type,
    b.latitude,
    b.longitude,
    calculate_distance(search_lat, search_lon, b.latitude, b.longitude) as distance_km
  FROM businesses b
  WHERE
    b.status = 'approved'
    AND b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    -- Quick bounding box filter (approximate, for performance)
    AND b.latitude BETWEEN (search_lat - (radius_km / 111.0)) AND (search_lat + (radius_km / 111.0))
    AND b.longitude BETWEEN (search_lon - (radius_km / (111.0 * cos(radians(search_lat)))))
                         AND (search_lon + (radius_km / (111.0 * cos(radians(search_lat)))))
  ORDER BY distance_km
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION find_nearby_businesses IS 'Find businesses within a radius (km) of given coordinates. Returns up to limit_count results sorted by distance.';
