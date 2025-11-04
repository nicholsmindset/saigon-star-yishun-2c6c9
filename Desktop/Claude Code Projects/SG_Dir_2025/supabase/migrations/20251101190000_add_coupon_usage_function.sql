--
-- Coupon Usage Tracking Function
-- Migration: 20251101190000_add_coupon_usage_function
--
-- This migration adds a function to increment coupon usage counts
-- when coupons are used during featured listing purchases.
--

-- Function to increment coupon usage
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(coupon_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE coupon_codes
  SET times_used = times_used + 1
  WHERE code = coupon_code
  AND is_active = true;

  -- Deactivate coupon if max uses reached
  UPDATE coupon_codes
  SET is_active = false
  WHERE code = coupon_code
  AND max_uses IS NOT NULL
  AND times_used >= max_uses;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_coupon_usage(text) TO authenticated;

-- Comment
COMMENT ON FUNCTION public.increment_coupon_usage(text) IS
'Increments the usage count for a coupon code and deactivates it if max uses is reached';
