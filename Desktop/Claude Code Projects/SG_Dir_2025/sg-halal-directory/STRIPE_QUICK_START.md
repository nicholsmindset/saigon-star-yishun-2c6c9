# Stripe Integration - Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
Already done! Stripe packages are installed.

### 2. Add Environment Variables

Add to your `.env.local`:

```bash
# Get from https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Get from Stripe CLI (see step 3)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Already configured
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Start Stripe Webhook Listener

Open a new terminal and run:

```bash
# Install Stripe CLI (if not installed)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Copy the webhook secret (whsec_xxx) to your .env.local**

### 4. Apply Database Migration

```bash
cd /Users/robertnichols/Desktop/Claude\ Code\ Projects/SG_Dir_2025/supabase
supabase db push
```

### 5. Test the Integration

```bash
# Start Next.js dev server
cd /Users/robertnichols/Desktop/Claude\ Code\ Projects/SG_Dir_2025/sg-halal-directory
npm run dev
```

**Visit**: http://localhost:3000/upgrade/featured

**Test Card**: `4242 4242 4242 4242` (any CVV, future expiry)

## 📁 Files Created

```
✅ lib/stripe.ts                                    - Stripe config & pricing
✅ app/api/stripe/create-checkout-session/route.ts - Creates checkout
✅ app/api/stripe/webhook/route.ts                  - Handles payments
✅ app/upgrade/featured/page.tsx                    - Upgrade page
✅ components/upgrade-form.tsx                      - Form component
✅ supabase/migrations/xxx_coupon_function.sql      - Coupon tracking
✅ STRIPE_SETUP.md                                  - Full setup guide
```

## 💰 Pricing

- **1 Month**: $29 SGD
- **3 Months**: $75 SGD (save $12)
- **6 Months**: $140 SGD (save $34)

## 🧪 Test Coupon Code

Create a test coupon in Stripe Dashboard, then add to database:

```sql
INSERT INTO coupon_codes (code, discount_type, discount_value, stripe_coupon_id, max_uses)
VALUES ('TEST100', 'percentage', 100, 'TEST100', 999);
```

Use code `TEST100` at checkout for 100% off.

## ✅ Verify Success

After payment:
1. Check webhook terminal for `checkout.session.completed` event
2. Query database:
```sql
SELECT * FROM featured_listings ORDER BY created_at DESC LIMIT 1;
SELECT id, name, is_featured, featured_expiry FROM businesses WHERE is_featured = true;
```

## 🆘 Common Issues

**Webhook not receiving events?**
- Ensure Stripe CLI is running
- Check terminal for webhook secret
- Verify secret in `.env.local`

**Payment not updating database?**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Review webhook terminal for errors
- Verify migration was applied

**Checkout session failing?**
- Verify Stripe keys are correct
- Check user is authenticated
- Ensure business is claimed by user

## 📚 Full Documentation

See **STRIPE_SETUP.md** for complete setup guide, production deployment, and troubleshooting.

## 🎯 Next Steps

1. Add "Upgrade" button to business detail pages
2. Add dashboard notifications for featured status
3. Implement email confirmations
4. Set up expiry reminders
5. Add analytics tracking

---

**Ready?** Start at Step 2 above and you'll be accepting payments in 5 minutes!
