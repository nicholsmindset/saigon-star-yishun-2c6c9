# Stripe Integration - Setup Checklist

## 🎯 Quick Setup (Development)

Follow these steps in order to get your Stripe integration working:

### Step 1: Get Stripe API Keys ⏱️ 2 minutes

- [ ] Go to https://dashboard.stripe.com/register (or login if you have an account)
- [ ] Navigate to **Developers** → **API keys**
- [ ] Copy your **Publishable key** (starts with `pk_test_`)
- [ ] Reveal and copy your **Secret key** (starts with `sk_test_`)

### Step 2: Update Environment Variables ⏱️ 1 minute

Edit `/sg-halal-directory/.env.local` and add:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**Note**: Keep your existing Supabase variables unchanged!

### Step 3: Install Stripe CLI ⏱️ 3 minutes

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:** Download from https://github.com/stripe/stripe-cli/releases/latest

### Step 4: Setup Webhook Listener ⏱️ 2 minutes

Open a new terminal window and run:

```bash
# Login to Stripe
stripe login

# Start webhook forwarding (KEEP THIS RUNNING)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Important**: Copy the webhook signing secret (starts with `whsec_`) from the terminal output

### Step 5: Add Webhook Secret ⏱️ 1 minute

Add to `/sg-halal-directory/.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 6: Apply Database Migration ⏱️ 1 minute

```bash
cd /Users/robertnichols/Desktop/Claude\ Code\ Projects/SG_Dir_2025/supabase
supabase db push
```

Verify the migration was applied:
```bash
supabase db diff
```

### Step 7: Start Development Server ⏱️ 1 minute

```bash
cd /Users/robertnichols/Desktop/Claude\ Code\ Projects/SG_Dir_2025/sg-halal-directory
npm run dev
```

### Step 8: Test Payment Flow ⏱️ 3 minutes

- [ ] Navigate to: http://localhost:3000/upgrade/featured
- [ ] Select a business (you need to have a claimed business)
- [ ] Choose duration (try 3 months - Most Popular)
- [ ] Click "Proceed to Payment"
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Enter any future expiry date (e.g., 12/25)
- [ ] Enter any 3-digit CVV (e.g., 123)
- [ ] Enter any 5-digit ZIP (e.g., 12345)
- [ ] Click "Pay"
- [ ] You should be redirected to `/dashboard?upgraded=true`

### Step 9: Verify Database Updates ⏱️ 2 minutes

Check your Supabase dashboard or run:

```sql
-- Check featured listing was created
SELECT * FROM featured_listings ORDER BY created_at DESC LIMIT 1;

-- Check business is now featured
SELECT id, name, is_featured, featured_expiry FROM businesses WHERE is_featured = true;
```

### Step 10: Check Webhook Events ⏱️ 1 minute

In your webhook terminal, you should see:

```
✅ checkout.session.completed [evt_xxx]
```

---

## ✅ Development Setup Complete!

Total time: ~17 minutes

## 🧪 Optional: Test Coupon Codes

### Create Test Coupon in Stripe

1. Go to https://dashboard.stripe.com/coupons
2. Click **Create coupon**
3. Settings:
   - Name: `TEST100`
   - Type: **Percentage discount**
   - Percentage: **100**
   - Duration: **Once**
4. Click **Create coupon**
5. Copy the Coupon ID (should be `TEST100`)

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
  'TEST100',
  'percentage',
  100,
  'TEST100',
  999,
  true
);
```

### Test Coupon

1. Go to http://localhost:3000/upgrade/featured
2. Select business and duration
3. Enter coupon code: `TEST100`
4. Complete checkout (should be $0.00)
5. Verify in database:
```sql
SELECT * FROM coupon_codes WHERE code = 'TEST100';
-- Check times_used was incremented
```

---

## 🚀 Production Deployment Checklist

When you're ready to go live:

### Before Deployment

- [ ] Switch to live Stripe API keys (remove `_test_`)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx`
  - [ ] `STRIPE_SECRET_KEY=sk_live_xxx`
- [ ] Remove all test data from database
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Review Stripe tax settings
- [ ] Set up Stripe email receipts

### Deploy Application

- [ ] Deploy to Vercel/Netlify/your hosting
- [ ] Verify environment variables are set
- [ ] Test application is accessible

### Configure Production Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - [x] `checkout.session.completed`
   - [x] `charge.succeeded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to production environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Test Production Payment

- [ ] Go to your production URL: `https://yourdomain.com/upgrade/featured`
- [ ] Use REAL card (your own for testing)
- [ ] Complete payment
- [ ] Verify database updates
- [ ] Check webhook was received
- [ ] Verify email receipt was sent
- [ ] Test featured listing appears correctly

### Monitor

- [ ] Set up Stripe Dashboard alerts
- [ ] Monitor webhook events in Stripe Dashboard
- [ ] Check error logs regularly
- [ ] Set up customer support email

---

## 🆘 Troubleshooting

### Webhook Not Receiving Events

**Issue**: No events showing in webhook terminal

**Solutions**:
1. Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Verify webhook secret in `.env.local`
3. Check terminal for webhook secret
4. Restart Stripe CLI

### Checkout Session Fails

**Issue**: Error creating checkout session

**Solutions**:
1. Verify Stripe API keys are correct
2. Check user is authenticated
3. Ensure business is claimed by user
4. Review browser console for errors
5. Check API route logs

### Database Not Updating

**Issue**: Payment successful but database unchanged

**Solutions**:
1. Check `SUPABASE_SERVICE_ROLE_KEY` is set
2. Verify webhook secret is correct
3. Review webhook terminal for errors
4. Check Supabase logs
5. Verify migration was applied

### Coupon Code Not Working

**Issue**: Coupon code entered but no discount

**Solutions**:
1. Verify coupon exists in Stripe Dashboard
2. Check coupon is active in database
3. Verify `stripe_coupon_id` matches Stripe
4. Check coupon hasn't reached max uses
5. Test with known valid coupon

---

## 📚 Documentation Reference

- **STRIPE_QUICK_START.md**: 5-minute setup guide
- **STRIPE_SETUP.md**: Complete setup with troubleshooting
- **STRIPE_INTEGRATION_SUMMARY.md**: Full implementation details

---

## ✅ Completion Status

Mark each section as you complete it:

- [ ] Development setup complete
- [ ] Test payment successful
- [ ] Database verified
- [ ] Webhook working
- [ ] Coupon codes tested (optional)
- [ ] Ready for production (when applicable)

---

**Need Help?** Check STRIPE_SETUP.md for detailed troubleshooting
