# VERCEL DEPLOYMENT GUIDE
*IslamicMatch - FADDL MATCH Platform*

## Prerequisites

✅ GitHub repository: `https://github.com/nicholsmindset/saigon-star-yishun-2c6c9.git`
✅ Next.js project configured
✅ Environment variables ready

---

## Step 1: Push Latest Changes to GitHub

```bash
# Ensure all changes are committed
git add .
git commit -m "feat: complete stitch design alignment and prepare for Vercel deployment"
git push origin main
```

---

## Step 2: Connect to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel**: [https://vercel.com/](https://vercel.com/)
2. **Sign in** with your GitHub account
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `saigon-star-yishun-2c6c9`
   - Click "Import"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel
```

---

## Step 3: Configure Project Settings

### Framework Preset
- **Framework**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `next build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Node.js Version
- **Recommended**: 20.x (latest LTS)

---

## Step 4: Configure Environment Variables

**CRITICAL**: Add these environment variables in Vercel Dashboard:
Settings → Environment Variables

### Required Variables

#### Supabase (Database)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Application URL
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Stripe (Payment Processing)
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Optional Variables

#### Twilio (SMS Verification - Singapore)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_SG_PHONE_NUMBER=+6512345678
```

#### AWS Rekognition (Image Moderation)
```env
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-southeast-1
```

---

## Step 5: Configure Domain (Optional)

### Custom Domain Setup

1. **Add Domain** in Vercel Dashboard:
   - Project Settings → Domains
   - Add your custom domain (e.g., `faddlmatch.com`)

2. **Update DNS Records** with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.21.21
   ```

3. **Update Environment Variable**:
   ```env
   NEXT_PUBLIC_APP_URL=https://faddlmatch.com
   ```

---

## Step 6: Configure Webhooks

### Stripe Webhook (Required for Payments)

1. **Stripe Dashboard**: [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Add Endpoint**: `https://your-app.vercel.app/api/stripe/webhook`
3. **Select Events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy Webhook Secret** → Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Step 7: Database Migration (Supabase)

If you haven't already set up Supabase:

1. **Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Create Project** (if needed)
3. **Run Migrations**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link project
   supabase link --project-ref your-project-ref

   # Push migrations
   supabase db push
   ```

---

## Step 8: Deploy

### Automatic Deployment
- Vercel automatically deploys on every push to `main` branch
- Each pull request gets a preview deployment

### Manual Deployment
```bash
# Via CLI
vercel --prod

# Or redeploy from Vercel Dashboard
# Deployments → [Latest Deployment] → Redeploy
```

---

## Step 9: Post-Deployment Verification

### ✅ Checklist

- [ ] Homepage loads correctly at your Vercel URL
- [ ] Navigation works across all pages
- [ ] Stitch design styling displays properly
- [ ] Authentication flow works (test signup)
- [ ] Stripe checkout redirects properly
- [ ] Images load from Supabase storage
- [ ] All API routes respond correctly
- [ ] Mobile responsive design works
- [ ] No console errors in browser

### Test URLs
- Homepage: `https://your-app.vercel.app/`
- Pricing: `https://your-app.vercel.app/pricing`
- About: `https://your-app.vercel.app/about`
- How It Works: `https://your-app.vercel.app/how-it-works`
- Onboarding: `https://your-app.vercel.app/onboarding/welcome`

---

## Step 10: Monitoring & Optimization

### Performance Monitoring
- **Vercel Analytics**: Enable in Project Settings → Analytics
- **Core Web Vitals**: Monitor LCP, FID, CLS metrics
- **Error Tracking**: Check Runtime Logs for errors

### Optimization Recommendations
- **Image Optimization**: Already configured with Next.js Image component
- **Caching**: Vercel automatically handles CDN caching
- **Edge Functions**: Consider upgrading critical API routes to Edge Runtime

---

## Common Issues & Solutions

### Issue: Build Fails with TypeScript Errors
```bash
# Fix locally first
npm run type-check
npm run lint

# Commit fixes
git add .
git commit -m "fix: resolve TypeScript and lint errors"
git push
```

### Issue: Environment Variables Not Working
- Ensure variables are set in **ALL environments** (Production, Preview, Development)
- Redeploy after adding new variables
- Check variable names don't have typos

### Issue: API Routes Return 404
- Verify API routes are in `app/api/` directory
- Check Next.js version compatibility (App Router)
- Review Vercel deployment logs

### Issue: Supabase Connection Fails
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that Supabase project is active
- Confirm RLS policies are set correctly

### Issue: Stripe Webhook Fails
- Verify webhook endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Review Vercel function logs for webhook errors

---

## Security Best Practices

### ✅ Implemented
- Server-side API routes for sensitive operations
- Environment variables for secrets
- Stripe webhook signature verification
- Supabase Row Level Security (RLS)
- HTTPS enforced by Vercel

### 🔒 Additional Recommendations
- **Rate Limiting**: Implement for API routes
- **CORS**: Configure for API endpoints
- **CSP Headers**: Add Content Security Policy
- **Authentication**: Use Supabase Auth with email verification
- **Input Validation**: Validate all user inputs server-side

---

## Rollback Strategy

### If Deployment Has Issues

1. **Instant Rollback** via Vercel Dashboard:
   - Deployments → [Previous Working Deployment] → "Promote to Production"

2. **Git Rollback**:
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## Performance Benchmarks

### Expected Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Lighthouse Score Targets
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

---

## Support & Resources

### Documentation
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs

### Getting Help
- **Vercel Support**: support@vercel.com
- **Project Issues**: GitHub Issues
- **Community**: Vercel Discord

---

## Quick Commands Reference

```bash
# Vercel CLI
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel env ls            # List environment variables
vercel logs              # View deployment logs
vercel domains           # Manage domains

# Development
npm run dev              # Local development
npm run build            # Test production build
npm run start            # Start production server locally
npm run lint             # Run linter
npm run type-check       # Check TypeScript types

# Git
git status               # Check status
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub (triggers deployment)
```

---

## Success Criteria

Your deployment is successful when:

✅ All pages load without errors
✅ Design matches stitch reference
✅ Authentication works end-to-end
✅ Stripe payments process successfully
✅ Performance scores meet targets
✅ Mobile responsiveness confirmed
✅ No console errors in production
✅ Webhook integrations functional

---

**Next Steps After Deployment**:
1. Test all user flows
2. Monitor error logs
3. Set up Vercel Analytics
4. Configure custom domain
5. Enable production Stripe keys
6. Set up monitoring alerts
7. Create backup strategy

**Deployment Date**: _____________
**Production URL**: _____________
**Status**: _____________

---

*Generated for IslamicMatch (FADDL MATCH) - Luxury Islamic Matchmaking Platform*
*Last Updated: February 4, 2026*
