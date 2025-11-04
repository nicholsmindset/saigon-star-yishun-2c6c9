/**
 * Stripe Checkout Session Creation API
 *
 * Creates a ONE-TIME payment checkout session for featured listings.
 * NOT a subscription - this is a single charge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, FEATURED_PRICING, type DurationMonths } from '@/lib/stripe';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { businessId, durationMonths, couponCode } = body;

    // Validate inputs
    if (!businessId || !durationMonths) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (![1, 3, 6].includes(durationMonths)) {
      return NextResponse.json(
        { error: 'Invalid duration. Must be 1, 3, or 6 months' },
        { status: 400 }
      );
    }

    // Verify business exists and user owns it or it's approved
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, status, claimed_by')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Only allow if business is approved
    if (business.status !== 'approved') {
      return NextResponse.json(
        { error: 'Business must be approved before featuring' },
        { status: 400 }
      );
    }

    // Get pricing for duration
    const pricing = FEATURED_PRICING[durationMonths as DurationMonths];

    // Prepare checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment', // ONE-TIME payment, NOT subscription
      payment_method_types: ['card', 'paynow', 'grabpay'], // Singapore payment methods
      line_items: [
        {
          price_data: {
            currency: 'sgd',
            product_data: {
              name: `Featured Listing - ${business.name}`,
              description: pricing.description,
            },
            unit_amount: pricing.amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/upgrade/featured?cancelled=true`,
      metadata: {
        business_id: businessId,
        user_id: user.id,
        duration_months: durationMonths.toString(),
        coupon_code: couponCode || '',
      },
      customer_email: user.email,
      allow_promotion_codes: true, // Allow Stripe promo codes
    };

    // Apply coupon if provided
    if (couponCode) {
      // Verify coupon exists and is valid
      const { data: coupon, error: couponError } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();

      if (!couponError && coupon) {
        // Check validity
        const now = new Date();
        const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
        const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

        const isValid =
          (!validFrom || now >= validFrom) &&
          (!validUntil || now <= validUntil) &&
          (!coupon.max_uses || coupon.times_used < coupon.max_uses);

        if (isValid && coupon.stripe_coupon_id) {
          sessionParams.discounts = [
            {
              coupon: coupon.stripe_coupon_id,
            },
          ];
        }
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
