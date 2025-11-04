# Stripe CLI Integration Guide: Complete Payment Processing & Webhook Management

## Table of Contents
1. [Stripe CLI Installation & Setup](#stripe-cli-installation--setup)
2. [Local Testing with Stripe CLI](#local-testing-with-stripe-cli)
3. [Webhook Configuration](#webhook-configuration)
4. [Payment Processing](#payment-processing)
5. [Testing Payment Flows](#testing-payment-flows)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Complete Workflow Examples](#complete-workflow-examples)

---

## Stripe CLI Installation & Setup

### Installation on macOS

```bash
# Using Homebrew (recommended)
brew install stripe/stripe-cli/stripe

# Verify installation
stripe version

# Expected output: stripe version X.X.X
```

### Installation on Windows

```bash
# Using Chocolatey
choco install stripe

# OR download directly from:
# https://github.com/stripe/stripe-cli/releases

# Verify installation
stripe --version
```

### Installation on Linux

```bash
# Ubuntu/Debian
wget https://github.com/stripe/stripe-cli/releases/download/v1.15.0/stripe_1.15.0_linux_x86_64.tar.gz
tar -xvf stripe_1.15.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# Verify installation
stripe version
```

### Authentication with Stripe Account

```bash
# Login to Stripe (opens browser)
stripe login

# Follow prompts to authenticate
# You'll be asked to:
# 1. Go to https://dashboard.stripe.com/apikeys
# 2. Copy your restricted API key
# 3. Paste in terminal

# Verify authentication
stripe status

# Expected output:
# ✓ Logged in as [your-account-email]
# ✓ Using restricted key: rk_live_xxxxx...
```

### Alternative: Use API Key Directly

```bash
# If you prefer not to use browser login
export STRIPE_API_KEY="rk_live_xxxx..."

# OR add to .env.local (local development only)
echo "STRIPE_API_KEY=rk_live_xxxx..." >> .env.local

# Verify
stripe status
```

### Create Test API Keys

```bash
# Go to Stripe Dashboard:
# https://dashboard.stripe.com/test/apikeys

# You'll see two keys:
# 1. Publishable Key: pk_test_xxxx...
# 2. Secret Key: sk_test_xxxx...

# Save to environment variables
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx..." >> .env.local
echo "STRIPE_SECRET_KEY=sk_test_xxxx..." >> .env.local

# Verify they're set
echo $STRIPE_SECRET_KEY
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

---

## Local Testing with Stripe CLI

### Starting Stripe CLI Webhook Listener

```bash
# Start listening for webhooks (local development)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Expected output:
# > Ready! Your webhook signing secret is: whsec_test_xxxx...
# > Forwarding to http://localhost:3000/api/webhooks/stripe

# IMPORTANT: Copy the signing secret
# Add to .env.local:
echo "STRIPE_WEBHOOK_SECRET=whsec_test_xxxx..." >> .env.local
```

### Stripe CLI Commands Reference

```bash
# ╔════ Authentication ════════════════════════════════════════╗
stripe login                    # Login to Stripe account
stripe logout                   # Logout
stripe status                   # Check login status
stripe config list              # List configuration

# ╔════ Testing & Simulation ══════════════════════════════════╗
stripe listen                   # Start webhook listener
stripe listen --events charge.succeeded,payment_intent.succeeded
stripe trigger charge.succeeded # Trigger test event
stripe trigger payment_intent.succeeded

# ╔════ Events ════════════════════════════════════════════════╗
stripe events list              # List recent events
stripe events list --limit 10
stripe events list --created "gte=2025-01-01"
stripe events resend [event_id] # Resend event

# ╔════ Logs ══════════════════════════════════════════════════╗
stripe logs tail                # Stream live logs
stripe logs tail --filter-level=error

# ╔════ API Requests ══════════════════════════════════════════╗
stripe request POST /v1/charges \
  amount=2000 \
  currency=sgd \
  source=tok_visa

# ╔════ Resources ═════════════════════════════════════════════╗
stripe resource customers list  # List customers
stripe resource products list   # List products
stripe resource prices list     # List prices
```

---

## Webhook Configuration

### Setting Up Webhook Endpoint in Code

```typescript
// app/api/webhooks/stripe.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature || '',
      webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      // ╔════ Charge Events ════════════════════╗
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge, supabase);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object as Stripe.Charge, supabase);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge, supabase);
        break;

      // ╔════ Payment Intent Events ════════════╗
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          supabase
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
          supabase
        );
        break;

      // ╔════ Subscription Events ══════════════╗
      case 'customer.subscription.created':
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      // ╔════ Invoice Events ═══════════════════╗
      case 'invoice.paid':
        await handleInvoicePaid(
          event.data.object as Stripe.Invoice,
          supabase
        );
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice,
          supabase
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// ╔════ Event Handlers ════════════════════════════════════════╗

async function handleChargeSucceeded(
  charge: Stripe.Charge,
  supabase: any
) {
  console.log('Processing successful charge:', charge.id);

  // Update featured listing in database
  const { error } = await supabase
    .from('featured_purchases')
    .update({
      stripe_payment_id: charge.id,
      status: 'completed'
    })
    .match({ stripe_payment_id: charge.id });

  if (error) {
    console.error('Error updating featured purchase:', error);
  }
}

async function handleChargeFailed(
  charge: Stripe.Charge,
  supabase: any
) {
  console.log('Processing failed charge:', charge.id);

  // Send notification to business owner
  // Update payment status
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const businessId = paymentIntent.metadata?.business_id;
  const duration = paymentIntent.metadata?.duration_days;

  if (!businessId || !duration) {
    console.error('Missing metadata in payment intent');
    return;
  }

  // Calculate expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(duration));

  // Update business featured status
  const { error: updateError } = await supabase
    .from('businesses')
    .update({
      is_featured: true,
      featured_expiry: expiryDate.toISOString()
    })
    .eq('id', businessId);

  if (updateError) {
    console.error('Error updating business featured status:', updateError);
    return;
  }

  // Record featured purchase
  const { error: insertError } = await supabase
    .from('featured_purchases')
    .insert({
      business_id: businessId,
      stripe_payment_id: paymentIntent.id,
      duration_days: parseInt(duration),
      expires_at: expiryDate.toISOString(),
      price_paid: paymentIntent.amount
    });

  if (insertError) {
    console.error('Error recording featured purchase:', insertError);
  }
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  console.log('Subscription created:', subscription.id);

  const { error } = await supabase
    .from('subscriptions')
    .insert({
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000)
    });

  if (error) {
    console.error('Error creating subscription record:', error);
  }
}
```

### Registering Webhooks with Stripe Dashboard

```bash
# For local testing, stripe listen handles this automatically

# For production, you need to register webhook endpoint manually:
# 1. Go to: https://dashboard.stripe.com/webhooks
# 2. Click "Add endpoint"
# 3. Enter your production URL: https://yourdomain.com/api/webhooks/stripe
# 4. Select events to listen for:
#    - charge.succeeded
#    - charge.failed
#    - charge.refunded
#    - payment_intent.succeeded
#    - payment_intent.payment_failed
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
#    - invoice.paid
#    - invoice.payment_failed
# 5. Click "Add endpoint"
# 6. Copy the Signing Secret
# 7. Add to your production environment:
#    STRIPE_WEBHOOK_SECRET=whsec_live_xxxx...
```

### Environment Variables for Stripe

```bash
# Development (.env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx...
STRIPE_SECRET_KEY=sk_test_xxxx...
STRIPE_WEBHOOK_SECRET=whsec_test_xxxx...

# Production (Netlify environment variables)
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_live_xxxx..."
netlify env:set STRIPE_SECRET_KEY "sk_live_xxxx..."
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_live_xxxx..."

# Verify in Netlify
netlify env:list
```

---

## Payment Processing

### Creating Stripe Products & Prices

```bash
# Create Featured Listing Product
stripe request POST /v1/products \
  name="Featured Listing" \
  type=service \
  description="Featured business listing for 1 month"

# This returns a product ID: prod_xxxx...
# Save this ID

# Create prices for the product
# 1 Month - $29
stripe request POST /v1/prices \
  product=prod_xxxx... \
  unit_amount=2900 \
  currency=sgd \
  recurring[interval]=month \
  recurring[interval_count]=1 \
  nickname="1 Month"

# 3 Months - $75 (save $12)
stripe request POST /v1/prices \
  product=prod_xxxx... \
  unit_amount=7500 \
  currency=sgd \
  recurring[interval]=month \
  recurring[interval_count]=3 \
  nickname="3 Months"

# 6 Months - $140 (save $34)
stripe request POST /v1/prices \
  product=prod_xxxx... \
  unit_amount=14000 \
  currency=sgd \
  recurring[interval]=month \
  recurring[interval_count]=6 \
  nickname="6 Months"

# List all prices
stripe resource prices list
```

### Creating Checkout Sessions

```typescript
// lib/stripe/server.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function createCheckoutSession(
  businessId: string,
  priceId: string,
  couponCode?: string
) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: priceId,
      quantity: 1,
    },
  ];

  const params: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade/featured`,
    customer_email: undefined, // Add user email if available
    metadata: {
      business_id: businessId,
      duration_days: getDurationFromPrice(priceId),
    },
  };

  // Add coupon if provided
  if (couponCode) {
    const coupon = await stripe.coupons.retrieve(couponCode);
    if (coupon) {
      params.discounts = [{ coupon: couponCode }];
    }
  }

  const session = await stripe.checkout.sessions.create(params);
  return session;
}

function getDurationFromPrice(priceId: string): number {
  // Map price IDs to duration
  const priceDuration: { [key: string]: number } = {
    'price_1_month': 30,
    'price_3_months': 90,
    'price_6_months': 180,
  };
  return priceDuration[priceId] || 30;
}
```

### Using Stripe in Frontend

```typescript
// app/upgrade/featured/page.tsx
import { loadStripe } from '@stripe/js';
import { createCheckoutSession } from '@/lib/stripe/server';

export default function UpgradeFeaturedPage() {
  const handleCheckout = async (priceId: string) => {
    // Create checkout session on server
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        businessId: 'current-business-id', // Get from context/props
        couponCode: getCouponCode(), // If user applied coupon
      }),
    });

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Upgrade to Featured</h1>

      {/* Pricing Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* 1 Month */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold">1 Month</h3>
          <p className="text-3xl font-bold text-green-600">$29</p>
          <button
            onClick={() => handleCheckout('price_1_month')}
            className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Select
          </button>
        </div>

        {/* 3 Months */}
        <div className="p-6 border rounded-lg border-green-600 bg-green-50">
          <div className="bg-green-600 text-white px-2 py-1 inline-block rounded text-sm mb-2">
            SAVE $12
          </div>
          <h3 className="text-xl font-bold">3 Months</h3>
          <p className="text-3xl font-bold text-green-600">$75</p>
          <p className="text-sm text-gray-600 mt-2">$25/month</p>
          <button
            onClick={() => handleCheckout('price_3_months')}
            className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Select
          </button>
        </div>

        {/* 6 Months */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold">6 Months</h3>
          <p className="text-3xl font-bold text-green-600">$140</p>
          <p className="text-sm text-gray-600 mt-2">~$23/month</p>
          <button
            onClick={() => handleCheckout('price_6_months')}
            className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
```

### API Endpoint for Checkout

```typescript
// app/api/create-checkout-session.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/server';

export async function POST(request: NextRequest) {
  try {
    const { businessId, priceId, couponCode } = await request.json();

    if (!businessId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(
      businessId,
      priceId,
      couponCode
    );

    return NextResponse.json({
      sessionId: session.id,
      success: true,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout creation failed' },
      { status: 500 }
    );
  }
}
```

---

## Testing Payment Flows

### Test Card Numbers

```bash
# Visa - Success
4242 4242 4242 4242

# Visa - Decline
4000 0000 0000 0002

# Visa - Requires Authentication
4000 0025 0000 3155

# MasterCard - Success
5555 5555 5555 4444

# Amex - Success
3782 822463 10005

# Stripe Test Tokens
tok_visa          # Success
tok_chargeDeclined # Failure
tok_chargeDeclinedExpiredCard
tok_chargeDeclinedIncorrectCvc
tok_chargeDeclinedLostCard
tok_chargeDeclinedStolenCard
```

### Manual Webhook Testing

```bash
# Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger test events
stripe trigger charge.succeeded
stripe trigger charge.failed
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.paid
stripe trigger invoice.payment_failed

# View webhook logs
stripe logs tail

# View all recent events
stripe events list
```

### Creating Test Customers

```bash
# Create test customer
stripe request POST /v1/customers \
  email=test@example.com \
  name="Test Business Owner"

# List customers
stripe resource customers list

# Retrieve specific customer
stripe request GET /v1/customers/cus_xxxx...
```

### Simulating Payment Failure

```bash
# Trigger a failed charge
stripe trigger charge.failed

# Trigger payment intent failure
stripe trigger payment_intent.payment_failed

# Check logs
stripe logs tail
```

---

## Production Deployment

### Before Going Live

```bash
# 1. Switch to Live API Keys
# Go to: https://dashboard.stripe.com/apikeys
# Copy live keys (pk_live_xxxx and sk_live_xxxx)

# 2. Set environment variables in Netlify
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_live_xxxx..."
netlify env:set STRIPE_SECRET_KEY "sk_live_xxxx..."

# 3. Register webhook endpoint
# https://dashboard.stripe.com/webhooks
# Add: https://yourdomain.com/api/webhooks/stripe

# 4. Copy webhook signing secret
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_live_xxxx..."

# 5. Verify environment variables
netlify env:list
```

### Deploying to Netlify

```bash
# Ensure all environment variables are set
netlify env:list
# Should show all 3 Stripe variables

# Deploy
netlify deploy --prod

# Verify deployment
netlify status

# Check logs for errors
netlify functions:logs
```

### Testing Production Payments

```bash
# 1. Use Stripe Dashboard to create test payment
# https://dashboard.stripe.com/payments

# 2. Monitor webhook delivery
# https://dashboard.stripe.com/webhooks

# 3. Check application logs
# View via Netlify dashboard

# 4. Verify database updates
# Query Supabase to confirm featured_purchases table updated
```

### Stripe CLI in Production

```bash
# You can use Stripe CLI to make API requests against production
stripe request GET /v1/charges --limit 10

# Monitor live webhooks (careful - real money!)
stripe logs tail --live

# Trigger specific event in production (use carefully)
stripe trigger charge.succeeded --live
```

---

## Troubleshooting

### Webhook Not Receiving Events

```bash
# 1. Check if stripe listen is running
ps aux | grep stripe

# 2. Verify webhook secret in code
echo $STRIPE_WEBHOOK_SECRET

# 3. Check webhook logs
stripe logs tail

# 4. Restart listener
pkill -f "stripe listen"
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 5. Manually trigger event
stripe trigger charge.succeeded
```

### Signature Verification Failed

```bash
# Error: "Invalid signature"

# Solution: Update webhook secret
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy new secret

# Update .env.local
STRIPE_WEBHOOK_SECRET=whsec_xxxx...

# Restart application
npm run dev
```

### Test Card Declined

```bash
# Using 4000 0000 0000 0002 (decline card)

# This is expected - use 4242 4242 4242 4242 for success

# If legitimate card declined:
# 1. Check card details (CVV, expiry, postal code)
# 2. Check for velocity limits (too many attempts)
# 3. Contact Stripe support for specific decline reasons
```

### Missing Metadata in Webhook

```bash
# Error: "Missing metadata in payment intent"

# Ensure metadata is passed when creating checkout session:
const session = await stripe.checkout.sessions.create({
  ...
  metadata: {
    business_id: businessId,
    duration_days: '30',
  },
  ...
});

# Verify in Stripe Dashboard that metadata appears in checkout session
```

### Coupon Code Not Applied

```bash
# 1. Verify coupon exists
stripe resource coupons list

# 2. Check coupon is valid
stripe request GET /v1/coupons/COUPON_CODE

# 3. Verify coupon code in checkout:
const session = await stripe.checkout.sessions.create({
  ...
  discounts: [{ coupon: couponCode }],
  ...
});

# 4. Check in Stripe Dashboard that discount appears in session
```

---

## Complete Workflow Examples

### Full Payment Workflow: Feature to Production

```bash
# ╔════ STEP 1: Setup Local Testing ════════════════════════╗

# Start Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy: whsec_test_xxxx...

# Add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_test_xxxx...

# ╔════ STEP 2: Create Stripe Products & Prices ═══════════╗

# Create product
stripe request POST /v1/products \
  name="Featured Listing" \
  type=service

# Create prices
stripe request POST /v1/prices \
  product=prod_xxxx \
  unit_amount=2900 \
  currency=sgd \
  nickname="1 Month"

# ╔════ STEP 3: Implement Payment Code ════════════════════╗

# Create checkout session endpoint
# app/api/create-checkout-session.ts

# Create webhook handler
# app/api/webhooks/stripe.ts

# ╔════ STEP 4: Test with Stripe CLI ═════════════════════╗

# Trigger successful payment
stripe trigger payment_intent.succeeded

# Check webhook logs
stripe logs tail

# Verify database updated
# Query featured_purchases table

# ╔════ STEP 5: Deploy to Staging ════════════════════════╗

netlify deploy

# ╔════ STEP 6: Production Setup ══════════════════════════╗

# Get live API keys from Stripe Dashboard
# https://dashboard.stripe.com/apikeys

# Set environment variables
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_live_xxxx..."
netlify env:set STRIPE_SECRET_KEY "sk_live_xxxx..."

# Register webhook endpoint
# https://dashboard.stripe.com/webhooks
# Add: https://yourdomain.com/api/webhooks/stripe

# Copy webhook secret
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_live_xxxx..."

# ╔════ STEP 7: Deploy to Production ══════════════════════╗

netlify deploy --prod

# ╔════ STEP 8: Monitor Production ════════════════════════╗

# View live events
stripe events list

# Monitor webhooks
# https://dashboard.stripe.com/webhooks

# Check application logs
netlify functions:logs
```

### Testing Featured Listing Purchase

```bash
# ╔════ Scenario: User upgrades to featured listing ════════╗

# 1. User clicks "Upgrade to Featured"
# Frontend calls /api/create-checkout-session

# 2. Backend creates checkout session
# Returns session ID

# 3. User redirected to Stripe Checkout
# Enters payment info

# 4. User enters test card: 4242 4242 4242 4242
# Completes payment

# 5. Stripe sends webhook: payment_intent.succeeded
# stripe listen receives it
# Webhook handler processes it:
#   - Updates business.is_featured = true
#   - Sets featured_expiry timestamp
#   - Records in featured_purchases table

# 6. Verify in database
supabase status
# Connect to database and query:
SELECT * FROM featured_purchases WHERE business_id = 'xxx';
SELECT * FROM businesses WHERE id = 'xxx';

# 7. User should see:
# - Featured badge on business card
# - Blue border on area page
# - Business moved to top of list
```

### Handling Refunds

```bash
# ╔════ Processing Refunds ════════════════════════════════╗

# Via Stripe Dashboard
# https://dashboard.stripe.com/payments
# Find charge → Click "Refund"

# Via CLI
stripe request POST /v1/charges/ch_xxxx/refund \
  amount=2900 \
  reason=requested_by_customer

# Webhook triggered: charge.refunded
# Handler updates:
#   - featured_purchases status
#   - featured_purchases refunded_at
#   - Send email to business owner
```

---

## Quick Command Reference

```bash
# ╔════ Setup ════════════════════════════════════════════╗
stripe login                    # Authenticate
stripe status                   # Check auth status

# ╔════ Testing ══════════════════════════════════════════╗
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
stripe trigger charge.failed
stripe logs tail

# ╔════ Resources ════════════════════════════════════════╗
stripe resource products list
stripe resource prices list
stripe resource customers list
stripe resource charges list
stripe resource subscriptions list

# ╔════ API Requests ═════════════════════════════════════╗
stripe request POST /v1/products name="Product"
stripe request POST /v1/prices product=prod_xxx unit_amount=2900
stripe request GET /v1/charges/ch_xxxx

# ╔════ Monitoring ═══════════════════════════════════════╗
stripe events list              # List events
stripe events list --limit 20
stripe logs tail                # Stream logs
stripe logs tail --filter-level=error

# ╔════ Production ═══════════════════════════════════════╗
stripe request --live GET /v1/charges  # Live request
stripe logs tail --live                # Live logs
stripe trigger --live payment_intent.succeeded  # Careful!
```

---

## Summary

This Stripe CLI guide provides:

✅ **Installation & Authentication** - Get Stripe CLI running
✅ **Local Development** - Test payments locally with webhook forwarding
✅ **Webhook Configuration** - Set up webhook handlers and event processing
✅ **Payment Processing** - Create products, prices, and checkout sessions
✅ **Testing** - Comprehensive testing with test cards and event simulation
✅ **Production Deployment** - Transition from test to live payments
✅ **Troubleshooting** - Solutions to common Stripe CLI issues
✅ **Complete Workflows** - End-to-end examples for real-world scenarios

**Integration Points:**
- ✅ Works with Next.js/Vercel → **Netlify**
- ✅ Works with Supabase for payment storage
- ✅ Works with Netlify for deployment
- ✅ Works with GitHub for version control
- ✅ Works with Docker for local environment

**Key Benefits:**
- 💰 Accept payments for featured listings
- 🔔 Real-time webhook processing
- 🧪 Local testing before production
- 📊 Complete payment tracking
- 🛡️ Secure signature verification

**Next Steps:**
1. Install Stripe CLI
2. Authenticate with Stripe account
3. Create test products and prices
4. Implement webhook handlers
5. Test payment flows locally
6. Deploy to production with live keys
