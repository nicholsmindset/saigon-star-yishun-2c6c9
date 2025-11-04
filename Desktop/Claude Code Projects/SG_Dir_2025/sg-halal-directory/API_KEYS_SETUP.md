# API Keys Setup Guide
**Singapore Halal Directory**

Complete guide for obtaining and configuring all required API keys and environment variables.

---

## Quick Reference

| Service | Required | Priority | Cost | Setup Time |
|---------|----------|----------|------|------------|
| Supabase | ✅ Yes | CRITICAL | Free tier available | 5 min |
| Stripe | ✅ Yes | CRITICAL | Free (pay per transaction) | 10 min |
| Resend | ⚠️ Recommended | MEDIUM | Free tier: 3,000 emails/month | 5 min |
| OpenAI | ❌ Optional | LOW | Pay-per-use | 3 min |
| Jina.ai | ❌ Optional | LOW | Free tier available | 3 min |
| Firecrawl | ❌ Optional | LOW | Free tier available | 3 min |

---

## 🔴 CRITICAL (Required for Core Functionality)

### 1. Supabase Configuration

**Purpose:** Database, authentication, file storage
**Cost:** Free tier: 500MB database, 1GB file storage, 50,000 monthly active users

#### Step-by-Step Setup:

1. **Create Supabase Account**
   - Go to https://supabase.com/
   - Click "Start your project"
   - Sign up with GitHub (recommended) or email

2. **Create New Project**
   - Click "New Project"
   - Organization: Create or select organization
   - Project name: `singapore-halal-directory`
   - Database password: Generate strong password (save it!)
   - Region: `Southeast Asia (Singapore)` (closest to your users)
   - Click "Create new project" (takes ~2 minutes)

3. **Get API Keys**
   - In project dashboard, go to **Settings** → **API**
   - Copy the following:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **Project API keys** → `anon` `public` key
     - **Project API keys** → `service_role` key (click "Reveal" and copy)

4. **Configure in `.env.local`**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_key
   ```

5. **Apply Database Schema**
   ```bash
   cd sg-halal-directory
   supabase link --project-ref YOUR_PROJECT_ID
   supabase db push
   ```

6. **Set Up Storage Bucket**
   - Go to **Storage** in Supabase dashboard
   - Click "New bucket"
   - Name: `business-images`
   - Public: ✅ Yes (images need to be publicly accessible)
   - File size limit: `5MB`
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - Click "Create bucket"

7. **Configure Storage Policies**
   ```sql
   -- Allow public read access to all images
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'business-images');

   -- Allow authenticated users to upload images
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'business-images'
     AND auth.role() = 'authenticated'
   );

   -- Allow business owners to delete their own images
   CREATE POLICY "Owners can delete own images"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'business-images'
     AND auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

**Verification:**
```bash
# Test connection
npm run dev
# Visit http://localhost:3000
# Try signing in with magic link
```

---

### 2. Stripe Payment Configuration

**Purpose:** Featured listing payments (one-time charges)
**Cost:** Free to start, 3.4% + $0.50 SGD per successful transaction

#### Step-by-Step Setup:

1. **Create Stripe Account**
   - Go to https://dashboard.stripe.com/register
   - Business type: Individual or Company
   - Country: Singapore
   - Complete verification (may take 1-2 days for live mode)

2. **Get Test API Keys** (for development)
   - In dashboard, toggle **Test mode** ON (top right)
   - Go to **Developers** → **API keys**
   - Copy:
     - **Publishable key**: `pk_test_...`
     - **Secret key**: `sk_test_...` (click "Reveal")

3. **Configure in `.env.local`**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```

4. **Create Products & Prices**
   - Go to **Products** → **Add product**

   **Product 1: Featured Listing - 1 Month**
   - Name: `Featured Listing - 1 Month`
   - Description: `Upgrade your business listing to featured status for 1 month`
   - Pricing: One-time, `$29.00 SGD`
   - Save product ID

   **Product 2: Featured Listing - 3 Months**
   - Name: `Featured Listing - 3 Months`
   - Description: `Upgrade your business listing to featured status for 3 months (Save $12!)`
   - Pricing: One-time, `$75.00 SGD`
   - Save product ID

   **Product 3: Featured Listing - 6 Months**
   - Name: `Featured Listing - 6 Months`
   - Description: `Upgrade your business listing to featured status for 6 months (Save $34!)`
   - Pricing: One-time, `$140.00 SGD`
   - Save product ID

5. **Set Up Webhook** (for local development)

   **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (with Scoop)
   scoop install stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
   tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
   ```

   **Login and Forward Webhooks:**
   ```bash
   # Login to Stripe
   stripe login

   # Forward webhooks to local dev server
   stripe listen --forward-to localhost:3000/api/stripe/webhook

   # Copy the webhook signing secret (whsec_...)
   ```

   **Add to `.env.local`:**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

6. **Configure Webhook for Production**
   - Go to **Developers** → **Webhooks** → **Add endpoint**
   - Endpoint URL: `https://singaporehalaldir.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `charge.succeeded`
     - `charge.failed`
   - Add endpoint
   - Copy **Signing secret** and add to production environment variables

7. **Create Coupon Codes** (optional)
   - Go to **Products** → **Coupons** → **Create coupon**
   - Example: `LAUNCH2025` - 20% off
   - Click "Create coupon"

**Testing:**
```bash
# Use Stripe test cards
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
# 3D Secure: 4000 0025 0000 3155
```

---

## 🟡 RECOMMENDED (Enhanced Functionality)

### 3. Resend Email Service

**Purpose:** Transactional emails (magic links, claim notifications, featured listing confirmations)
**Cost:** Free tier: 3,000 emails/month, 100 emails/day

#### Step-by-Step Setup:

1. **Create Resend Account**
   - Go to https://resend.com/
   - Click "Start for free"
   - Sign up with GitHub or email

2. **Verify Domain** (recommended for deliverability)
   - Go to **Domains** → **Add domain**
   - Enter: `singaporehalaldir.com`
   - Add DNS records to your domain provider:
     ```
     Type: TXT
     Name: resend._domainkey
     Value: (provided by Resend)
     ```
   - Wait for verification (~5-30 minutes)

3. **Get API Key**
   - Go to **API Keys** → **Create API Key**
   - Name: `Production` or `Development`
   - Permission: Full access
   - Copy the key (starts with `re_`)

4. **Configure in `.env.local`**
   ```bash
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=noreply@singaporehalaldir.com
   ```

5. **Test Email** (optional)
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer re_xxxxx' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "noreply@singaporehalaldir.com",
       "to": "your@email.com",
       "subject": "Test Email",
       "html": "<p>Hello from Singapore Halal Directory!</p>"
     }'
   ```

**Alternative:** If not using custom domain, Resend provides `onboarding@resend.dev` for testing.

---

## 🟢 OPTIONAL (Advanced Features)

### 4. OpenAI API

**Purpose:** AI-powered content generation for area descriptions, business summaries
**Cost:** Pay-per-use (~$0.01 per request with GPT-4 Turbo)

#### Setup:

1. Go to https://platform.openai.com/signup
2. Complete verification and add payment method
3. Go to **API keys** → **Create new secret key**
4. Copy key (starts with `sk-`)
5. Add to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-xxxxx
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

**Use Cases:**
- Generate SEO-optimized area descriptions
- Create business summaries from raw data
- Generate FAQ variations
- Content translation (English ↔ Malay)

---

### 5. Jina.ai API

**Purpose:** Web scraping and data extraction for automated business listing population
**Cost:** Free tier: 1,000 requests/month

#### Setup:

1. Go to https://jina.ai/
2. Sign up for account
3. Go to dashboard → **API Keys**
4. Create new API key
5. Add to `.env.local`:
   ```bash
   JINA_API_KEY=jina_xxxxx
   ```

**Use Cases:**
- Scrape halal restaurant directories
- Extract business info from websites
- Automated data population
- Image extraction from business websites

---

### 6. Firecrawl API

**Purpose:** Advanced web scraping with JavaScript rendering
**Cost:** Free tier: 500 pages/month

#### Setup:

1. Go to https://firecrawl.dev/
2. Create account
3. Go to **API Keys** → **Create API Key**
4. Copy key
5. Add to `.env.local`:
   ```bash
   FIRECRAWL_API_KEY=fc_xxxxx
   ```

**Use Cases:**
- Scrape JavaScript-heavy websites
- Extract structured data from restaurant listing sites
- Automated bulk business imports
- Image and menu extraction

---

## Environment File Setup

### 1. Local Development

Create `.env.local` in project root:

```bash
# Copy example file
cp .env.example .env.local

# Edit with your keys
nano .env.local  # or use your preferred editor
```

### 2. Production Deployment (Netlify)

1. **Via Netlify Dashboard:**
   - Go to **Site settings** → **Environment variables**
   - Click **Add variable**
   - Add each key-value pair
   - Deploy site

2. **Via Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Set environment variables
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_value"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_value"
   netlify env:set STRIPE_SECRET_KEY "your_value"
   # ... etc

   # Deploy
   netlify deploy --prod
   ```

3. **Via `.toml` file** (not recommended for secrets):
   ```toml
   # netlify.toml
   [build.environment]
     NEXT_PUBLIC_APP_URL = "https://singaporehalaldir.com"
   ```

### 3. Production Deployment (Vercel)

1. **Via Vercel Dashboard:**
   - Go to project → **Settings** → **Environment Variables**
   - Add each variable
   - Select environment: Production, Preview, Development
   - Save and redeploy

2. **Via Vercel CLI:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login
   vercel login

   # Set environment variables
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # Enter value when prompted
   # ... repeat for all variables

   # Deploy
   vercel --prod
   ```

---

## Security Checklist

- [ ] Never commit `.env.local` or `.env` to version control
- [ ] Add `.env*.local` to `.gitignore`
- [ ] Use different API keys for development and production
- [ ] Rotate keys if accidentally exposed
- [ ] Use `NEXT_PUBLIC_` prefix only for client-safe variables
- [ ] Keep `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` server-side only
- [ ] Enable Stripe webhook signature verification
- [ ] Set up rate limiting for API endpoints
- [ ] Use environment-specific Stripe keys (test vs live)
- [ ] Monitor API usage and set up billing alerts

---

## Verification Commands

Test each integration:

```bash
# 1. Supabase connection
npm run dev
# Visit http://localhost:3000 and try magic link login

# 2. Stripe integration
npm run dev
# Go to /upgrade/featured and test checkout with test card: 4242 4242 4242 4242

# 3. Webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Complete a test checkout and verify webhook received

# 4. Resend emails
# Trigger magic link login and check email delivery

# 5. Image upload
# Go to /dashboard/edit/[business-id] and upload image
# Verify appears in Supabase Storage bucket
```

---

## Troubleshooting

### Supabase Connection Issues

**Problem:** "Invalid API key" error
**Solution:** Ensure `NEXT_PUBLIC_SUPABASE_URL` matches project URL exactly (check for trailing slash)

**Problem:** "Column does not exist" errors
**Solution:** Run `supabase db push` to apply latest schema migrations

### Stripe Webhook Issues

**Problem:** Webhooks not received in local development
**Solution:** Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Problem:** "No signatures found matching the expected signature" error
**Solution:** Verify `STRIPE_WEBHOOK_SECRET` matches current webhook endpoint

### Image Upload Issues

**Problem:** "Storage bucket not found"
**Solution:** Create `business-images` bucket in Supabase Storage dashboard

**Problem:** Upload succeeds but image not displayed
**Solution:** Check storage bucket is set to public and RLS policies allow read access

---

## Cost Estimates (Monthly)

### Minimal Viable Product (MVP)
- **Supabase:** $0 (free tier)
- **Stripe:** $0 base + 3.4% per transaction
- **Resend:** $0 (free tier)
- **Total:** ~$0-50/month depending on featured listing sales

### Growth Phase (1,000+ MAU)
- **Supabase:** $25/month (Pro plan)
- **Stripe:** $0 base + transaction fees (~$100-500/month revenue)
- **Resend:** $0-20/month (free tier usually sufficient)
- **Total:** ~$25-70/month + transaction fees

### Scale (10,000+ MAU)
- **Supabase:** $599/month (Team plan)
- **Stripe:** Transaction fees (~$500-2000/month revenue)
- **Resend:** $0-20/month
- **CDN/Storage:** $50-100/month
- **Total:** ~$649-719/month + transaction fees

---

## Support Resources

- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **Resend:** https://resend.com/docs
- **Next.js:** https://nextjs.org/docs
- **Project Issues:** Create issue at repository

---

**Last Updated:** January 2025
**Version:** 1.0.0
