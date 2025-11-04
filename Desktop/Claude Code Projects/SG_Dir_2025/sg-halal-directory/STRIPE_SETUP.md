# Stripe Integration Setup Guide

## Overview

This guide walks you through setting up Stripe for ONE-TIME featured listing payments (not subscriptions).

## Prerequisites

- Stripe account: https://dashboard.stripe.com/register
- Supabase project with schema applied
- Local development environment running

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Reveal and copy your **Secret key** (starts with `sk_test_`)
4. Add to your `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

## Step 2: Configure Webhook (Development)

### Using Stripe CLI (Recommended for Development)

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Linux
https://github.com/stripe/stripe-cli/releases/latest
```

2. Login to Stripe:
```bash
stripe login
```

3. Start webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the webhook signing secret (starts with `whsec_`) to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

5. Keep this terminal running during development!

## Step 3: Test Webhook Events

1. In a new terminal, trigger a test checkout completion:
```bash
stripe trigger checkout.session.completed
```

2. Check your webhook terminal for the event
3. Verify database updates in Supabase dashboard

## Step 4: Create Coupon Codes (Optional)

### Via Stripe Dashboard

1. Go to https://dashboard.stripe.com/coupons
2. Click **Create coupon**
3. Configuration:
   - Name: `BADGE_PROGRAM` or custom name
   - Type: Percentage discount or Fixed amount
   - Amount: e.g., 100% off or $29 off
   - Duration: Once
4. Copy the Coupon ID (e.g., `BADGE_PROGRAM`)

### Add to Database

```sql
INSERT INTO coupon_codes (
  code,
  discount_type,
  discount_value,
  stripe_coupon_id,
  max_uses,
  is_active
) VALUES (
  'BADGE_PROGRAM',
  'percentage',
  100,
  'BADGE_PROGRAM', -- Stripe coupon ID
  100, -- Max uses
  true
);
```

## Step 5: Configure Production Webhook

### When deploying to production:

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed` ✅
   - `charge.succeeded` ✅ (backup)
5. Copy the **Signing secret** to production environment variables

## Step 6: Test Payment Flow

### Test Cards (Stripe Test Mode)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

CVV: Any 3 digits
Expiry: Any future date
ZIP: Any 5 digits
```

### Test Flow

1. Start development server:
```bash
npm run dev
```

2. Navigate to: http://localhost:3000/upgrade/featured

3. Select a business and duration

4. Enter test coupon code (if created)

5. Click "Proceed to Payment"

6. Use test card: `4242 4242 4242 4242`

7. Complete payment

8. Verify:
   - Redirected to `/dashboard?upgraded=true`
   - Business is now featured in database
   - Featured listing record created
   - Coupon usage incremented (if used)

## Pricing Configuration

Current pricing (in `lib/stripe.ts`):

```typescript
1 month: $29 SGD
3 months: $75 SGD (save $12)
6 months: $140 SGD (save $34)
```

### To change pricing:

1. Update `FEATURED_PRICING` in `/lib/stripe.ts`
2. Update display prices in `/app/upgrade/featured/page.tsx`
3. Update pricing in `/components/upgrade-form.tsx`

## Singapore Payment Methods

The integration supports:
- **Cards**: All major credit/debit cards
- **PayNow**: Singapore's instant payment system
- **GrabPay**: Popular e-wallet in Singapore

These are enabled by default in the checkout session.

## Webhook Event Handling

The webhook handler (`/app/api/stripe/webhook/route.ts`) processes:

1. **checkout.session.completed**: Primary event
   - Verifies payment was successful
   - Creates featured listing record
   - Updates business to featured status
   - Increments coupon usage

2. **charge.succeeded**: Backup event (not currently implemented)

## Troubleshooting

### Webhook Not Receiving Events

1. Check Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Verify webhook secret in `.env.local`
3. Check terminal for webhook logs
4. Verify route is accessible: http://localhost:3000/api/stripe/webhook

### Payment Not Creating Featured Listing

1. Check webhook logs in terminal
2. Verify Supabase service role key is set
3. Check database for `featured_listings` insert
4. Review webhook handler logs for errors

### Coupon Code Not Working

1. Verify coupon exists in Stripe dashboard
2. Check coupon is active in database
3. Verify `stripe_coupon_id` matches Stripe coupon ID
4. Check coupon hasn't reached max uses

### Database Errors

1. Apply migration:
```bash
cd /Users/robertnichols/Desktop/Claude\ Code\ Projects/SG_Dir_2025/supabase
supabase db push
```

2. Verify service role key has permissions
3. Check RLS policies allow webhook inserts

## Production Checklist

Before going live:

- [ ] Switch to live Stripe API keys (remove `_test_` keys)
- [ ] Configure production webhook endpoint
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Test payment flow with real card
- [ ] Verify email receipts are sent
- [ ] Set up Stripe Dashboard alerts
- [ ] Configure Stripe tax settings (if required)
- [ ] Review refund policy
- [ ] Set up customer support email in Stripe

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Test Cards**: https://stripe.com/docs/testing
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Webhook Events**: https://stripe.com/docs/webhooks
- **Singapore Payment Methods**: https://stripe.com/docs/payments/payment-methods/overview#singapore

## Security Notes

1. **Never commit API keys** to version control
2. **Always verify webhook signatures** (handled in webhook route)
3. **Use Supabase service role key only in webhook handler** (server-side)
4. **Enable RLS policies** for all tables
5. **Validate all user inputs** before processing

## Architecture Overview

```
User Flow:
1. User → /upgrade/featured page
2. Selects business + duration + coupon
3. Frontend → /api/stripe/create-checkout-session
4. API creates Stripe checkout session
5. User redirected to Stripe Checkout
6. User completes payment
7. Stripe → /api/stripe/webhook (checkout.session.completed)
8. Webhook creates featured_listing + updates business
9. User redirected to /dashboard?upgraded=true

Database Updates (via webhook):
- featured_listings: INSERT new record
- businesses: UPDATE is_featured=true, featured_expiry
- coupon_codes: UPDATE times_used + 1 (if coupon used)
```

## Files Created/Modified

```
sg-halal-directory/
├── lib/
│   └── stripe.ts (NEW)
├── app/
│   ├── api/
│   │   └── stripe/
│   │       ├── create-checkout-session/
│   │       │   └── route.ts (NEW)
│   │       └── webhook/
│   │           └── route.ts (NEW)
│   └── upgrade/
│       └── featured/
│           └── page.tsx (NEW)
├── components/
│   └── upgrade-form.tsx (NEW)
├── supabase/
│   └── migrations/
│       └── 20251101190000_add_coupon_usage_function.sql (NEW)
└── STRIPE_SETUP.md (NEW)
```

## Next Steps

1. Complete Step 1-4 of this guide
2. Test the payment flow with test cards
3. Add "Upgrade to Featured" button to business detail pages
4. Add "Upgrade" CTA to dashboard for claimed businesses
5. Implement email notifications for successful upgrades
6. Add featured listing expiry reminders
7. Consider adding analytics tracking for conversion rates
