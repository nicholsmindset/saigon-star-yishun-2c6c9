/**
 * Stripe Webhook Handler for One-Time Featured Listing Payments
 *
 * Listens for charge.succeeded events (NOT subscription events)
 * and updates the database accordingly.
 *
 * Important: This webhook must be registered in Stripe Dashboard:
 * 1. Go to Developers > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/stripe/webhook
 * 3. Select event: charge.succeeded
 * 4. Copy webhook signing secret to .env.local as STRIPE_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, calculateExpiryDate } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Use service role client for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: any;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Webhook event received:', event.type);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Only process if payment was successful
      if (session.payment_status === 'paid') {
        await handleSuccessfulPayment(session);
      }
    }

    // Handle charge.succeeded event (backup)
    if (event.type === 'charge.succeeded') {
      const charge = event.data.object;

      // Get session metadata if available
      if (charge.metadata && charge.metadata.business_id) {
        await handleSuccessfulCharge(charge);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment from checkout.session.completed
 */
async function handleSuccessfulPayment(session: any) {
  try {
    const metadata = session.metadata;
    const businessId = metadata.business_id;
    const userId = metadata.user_id;
    const durationMonths = parseInt(metadata.duration_months);
    const couponCode = metadata.coupon_code || null;

    if (!businessId || !userId || !durationMonths) {
      console.error('Missing required metadata in checkout session:', metadata);
      return;
    }

    console.log('Processing payment for business:', businessId);

    // Calculate expiry date
    const expiryDate = calculateExpiryDate(durationMonths);

    // Calculate discount amount if coupon was used
    let discountAmount = 0;
    if (session.total_details?.amount_discount) {
      discountAmount = session.total_details.amount_discount;
    }

    // Extract payment_intent string (it could be a string or object)
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || null;

    // Create featured listing record
    const { data: featuredListing, error: insertError } = await supabaseAdmin
      .from('featured_listings')
      .insert({
        business_id: businessId,
        user_id: userId,
        stripe_payment_id: session.id,
        stripe_charge_id: paymentIntentId,
        amount_paid: session.amount_total || 0,
        currency: session.currency?.toUpperCase() || 'SGD',
        duration_months: durationMonths,
        expiry_date: expiryDate.toISOString(),
        coupon_code: couponCode,
        discount_amount: discountAmount,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating featured listing:', insertError);
      throw insertError;
    }

    console.log('Featured listing created:', featuredListing.id);

    // Update business record
    const { error: updateError } = await supabaseAdmin
      .from('businesses')
      .update({
        is_featured: true,
        featured_expiry: expiryDate.toISOString(),
      })
      .eq('id', businessId);

    if (updateError) {
      console.error('Error updating business:', updateError);
      throw updateError;
    }

    console.log('Business updated to featured:', businessId);

    // Update coupon usage if applicable
    if (couponCode) {
      // Get current coupon data
      const { data: coupon } = await supabaseAdmin
        .from('coupon_codes')
        .select('times_used')
        .eq('code', couponCode)
        .single();

      if (coupon) {
        // Increment times_used
        await supabaseAdmin
          .from('coupon_codes')
          .update({
            times_used: (coupon.times_used || 0) + 1
          })
          .eq('code', couponCode);
      }
    }

    console.log('Payment processed successfully');
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

/**
 * Handle successful charge (backup handler)
 */
async function handleSuccessfulCharge(charge: any) {
  console.log('Processing charge:', charge.id);
  // Implementation similar to handleSuccessfulPayment
  // Use this as a backup if checkout.session.completed is missed
}
