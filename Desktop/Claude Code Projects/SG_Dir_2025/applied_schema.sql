--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: check_featured_expiry(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_featured_expiry() RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;


--
-- Name: update_area_business_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_area_business_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.areas (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    meta_title text,
    meta_description text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    business_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: business_claims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_claims (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    business_id uuid NOT NULL,
    user_id uuid NOT NULL,
    owner_name text NOT NULL,
    owner_email text NOT NULL,
    owner_phone text,
    verification_documents text[],
    status text DEFAULT 'pending'::text,
    admin_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT business_claims_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: businesses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.businesses (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    business_type text NOT NULL,
    description text,
    address text NOT NULL,
    postal_code text,
    phone text,
    email text,
    website text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    area_id uuid,
    halal_certification text,
    certification_number text,
    is_featured boolean DEFAULT false,
    featured_expiry timestamp with time zone,
    claimed_by uuid,
    is_verified boolean DEFAULT false,
    status text DEFAULT 'pending'::text,
    submitted_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT businesses_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: coupon_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupon_codes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    discount_type text NOT NULL,
    discount_value integer NOT NULL,
    stripe_coupon_id text,
    max_uses integer,
    times_used integer DEFAULT 0,
    valid_from timestamp with time zone DEFAULT now(),
    valid_until timestamp with time zone,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT coupon_codes_discount_type_check CHECK ((discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])))
);


--
-- Name: featured_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.featured_listings (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    business_id uuid NOT NULL,
    user_id uuid NOT NULL,
    stripe_payment_id text NOT NULL,
    stripe_charge_id text,
    amount_paid integer NOT NULL,
    currency text DEFAULT 'SGD'::text,
    duration_months integer NOT NULL,
    start_date timestamp with time zone DEFAULT now(),
    expiry_date timestamp with time zone NOT NULL,
    coupon_code text,
    discount_amount integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT featured_listings_duration_months_check CHECK ((duration_months = ANY (ARRAY[1, 3, 6])))
);


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    business_id uuid NOT NULL,
    url text NOT NULL,
    caption text,
    display_order integer DEFAULT 0,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    is_admin boolean DEFAULT false,
    is_business_owner boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: areas areas_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_name_key UNIQUE (name);


--
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- Name: areas areas_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_slug_key UNIQUE (slug);


--
-- Name: business_claims business_claims_business_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_claims
    ADD CONSTRAINT business_claims_business_id_user_id_key UNIQUE (business_id, user_id);


--
-- Name: business_claims business_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_claims
    ADD CONSTRAINT business_claims_pkey PRIMARY KEY (id);


--
-- Name: businesses businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);


--
-- Name: businesses businesses_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_slug_key UNIQUE (slug);


--
-- Name: coupon_codes coupon_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_codes
    ADD CONSTRAINT coupon_codes_code_key UNIQUE (code);


--
-- Name: coupon_codes coupon_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_codes
    ADD CONSTRAINT coupon_codes_pkey PRIMARY KEY (id);


--
-- Name: coupon_codes coupon_codes_stripe_coupon_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_codes
    ADD CONSTRAINT coupon_codes_stripe_coupon_id_key UNIQUE (stripe_coupon_id);


--
-- Name: featured_listings featured_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_listings
    ADD CONSTRAINT featured_listings_pkey PRIMARY KEY (id);


--
-- Name: featured_listings featured_listings_stripe_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_listings
    ADD CONSTRAINT featured_listings_stripe_payment_id_key UNIQUE (stripe_payment_id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: idx_areas_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_areas_slug ON public.areas USING btree (slug);


--
-- Name: idx_businesses_area; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_area ON public.businesses USING btree (area_id);


--
-- Name: idx_businesses_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_featured ON public.businesses USING btree (is_featured, featured_expiry);


--
-- Name: idx_businesses_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_slug ON public.businesses USING btree (slug);


--
-- Name: idx_businesses_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_status ON public.businesses USING btree (status);


--
-- Name: idx_businesses_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_type ON public.businesses USING btree (business_type);


--
-- Name: idx_claims_business; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claims_business ON public.business_claims USING btree (business_id);


--
-- Name: idx_claims_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claims_status ON public.business_claims USING btree (status);


--
-- Name: idx_claims_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claims_user ON public.business_claims USING btree (user_id);


--
-- Name: idx_coupons_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coupons_active ON public.coupon_codes USING btree (is_active, valid_until);


--
-- Name: idx_coupons_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coupons_code ON public.coupon_codes USING btree (code);


--
-- Name: idx_featured_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_active ON public.featured_listings USING btree (is_active, expiry_date);


--
-- Name: idx_featured_business; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_business ON public.featured_listings USING btree (business_id);


--
-- Name: idx_featured_stripe; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_stripe ON public.featured_listings USING btree (stripe_payment_id);


--
-- Name: idx_featured_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_user ON public.featured_listings USING btree (user_id);


--
-- Name: idx_images_business; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_images_business ON public.images USING btree (business_id);


--
-- Name: idx_images_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_images_order ON public.images USING btree (business_id, display_order);


--
-- Name: businesses update_area_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_area_count AFTER INSERT OR DELETE OR UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_area_business_count();


--
-- Name: areas update_areas_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: businesses update_businesses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: business_claims update_claims_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.business_claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: featured_listings update_featured_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_featured_updated_at BEFORE UPDATE ON public.featured_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: business_claims business_claims_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_claims
    ADD CONSTRAINT business_claims_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: business_claims business_claims_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_claims
    ADD CONSTRAINT business_claims_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: businesses businesses_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id) ON DELETE SET NULL;


--
-- Name: businesses businesses_claimed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_claimed_by_fkey FOREIGN KEY (claimed_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: businesses businesses_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: coupon_codes coupon_codes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_codes
    ADD CONSTRAINT coupon_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: featured_listings featured_listings_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_listings
    ADD CONSTRAINT featured_listings_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: featured_listings featured_listings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_listings
    ADD CONSTRAINT featured_listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: images images_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: businesses Anyone can submit a business (no auth required); Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit a business (no auth required)" ON public.businesses FOR INSERT WITH CHECK (true);


--
-- Name: coupon_codes Anyone can view active coupons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active coupons" ON public.coupon_codes FOR SELECT USING (((is_active = true) AND ((valid_until IS NULL) OR (valid_until > now()))));


--
-- Name: featured_listings Anyone can view active featured listings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active featured listings" ON public.featured_listings FOR SELECT USING ((is_active = true));


--
-- Name: images Anyone can view images for approved businesses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view images for approved businesses" ON public.images FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = images.business_id) AND (businesses.status = 'approved'::text)))));


--
-- Name: businesses Approved businesses are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Approved businesses are viewable by everyone" ON public.businesses FOR SELECT USING ((status = 'approved'::text));


--
-- Name: areas Areas are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Areas are viewable by everyone" ON public.areas FOR SELECT USING (true);


--
-- Name: business_claims Authenticated users can submit claims; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can submit claims" ON public.business_claims FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: images Business owners can manage their business images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Business owners can manage their business images" ON public.images USING ((EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = images.business_id) AND (businesses.claimed_by = auth.uid())))));


--
-- Name: businesses Business owners can update their claimed businesses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Business owners can update their claimed businesses" ON public.businesses FOR UPDATE USING (((claimed_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))));


--
-- Name: featured_listings Featured listings are created via Stripe webhook; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Featured listings are created via Stripe webhook" ON public.featured_listings FOR INSERT WITH CHECK (true);


--
-- Name: areas Only admins can insert areas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can insert areas" ON public.areas FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: coupon_codes Only admins can manage coupons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can manage coupons" ON public.coupon_codes USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: areas Only admins can update areas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can update areas" ON public.areas FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: business_claims Only admins can update claims; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can update claims" ON public.business_claims FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: profiles Public profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: business_claims Users can view their own claims; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own claims" ON public.business_claims FOR SELECT USING (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))));


--
-- Name: featured_listings Users can view their own featured listing history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own featured listing history" ON public.featured_listings FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: areas; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

--
-- Name: business_claims; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: businesses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

--
-- Name: coupon_codes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: featured_listings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.featured_listings ENABLE ROW LEVEL SECURITY;

--
-- Name: images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

