# Singapore Halal Directory: Implementation Checklist

## Pre-Launch Checklist

### ✅ Environment Setup
- [ ] Clone boilerplate: `npx degit IncomeStreamSurfer/claude-code-saas-starter halal-directory`
- [ ] Install Node.js 18+ and Docker Desktop
- [ ] Create Stripe account
- [ ] Start Claude Code: `claude`
- [ ] Run `/setup-boilerplate` (automated setup)
- [ ] Verify local dev server works: `npm run dev`

---

## Phase 1: Database & Authentication (Week 1)

### Database Extension
- [ ] Review existing schema in `supabase/migrations/`
- [ ] Prompt Claude Code to add `areas` table
- [ ] Prompt Claude Code to add `businesses` table
- [ ] Prompt Claude Code to add `business_claims` table
- [ ] Prompt Claude Code to add `featured_listings` table
- [ ] Prompt Claude Code to add `images` table
- [ ] Prompt Claude Code to add `coupon_codes` table
- [ ] Test database locally: `npm run supabase:status`

### Authentication Extension
- [ ] Add `is_admin` and `is_business_owner` flags to profiles
- [ ] Create admin middleware
- [ ] Create business owner middleware
- [ ] Update TypeScript types in `types/database.ts`
- [ ] Test auth flows locally

### Testing Checkpoint
- [ ] [ ] Can create user account via magic link
- [ ] [ ] Can distinguish admin vs regular user
- [ ] [ ] Can distinguish business owner
- [ ] [ ] All new tables exist and are accessible

---

## Phase 2: Directory Core (Week 2)

### Stripe Adaptation
- [ ] Modify `lib/stripe/server.ts` for one-time charges
- [ ] Create featured listing price configurations
- [ ] Add coupon code support to checkout
- [ ] Update webhook handler for charge.succeeded (not subscriptions)
- [ ] Test checkout flow locally

### Directory Pages
- [ ] Create `/app/directory/page.tsx` (area listing)
- [ ] Create `/app/directory/[area]/page.tsx` (area-specific pillar page)
  - [ ] Fetch businesses for area
  - [ ] Display featured at top with styling
  - [ ] Display standard listings below
  - [ ] Include area FAQ section
  - [ ] Add internal linking
- [ ] Create `/app/business/[id]/page.tsx` (business detail)
  - [ ] Display all business info
  - [ ] Show images (max 8 featured, 1 standard)
  - [ ] Embed map with location
  - [ ] Show claim button
  - [ ] Show upgrade button
- [ ] Create `/app/search` page (search results)
- [ ] Test all pages load correctly

### Testing Checkpoint
- [ ] Can view directory homepage
- [ ] Can browse businesses by area
- [ ] Can view individual business pages
- [ ] Search filters work correctly
- [ ] Mobile responsive on all pages

---

## Phase 3: Business Management (Week 3)

### User Dashboard
- [ ] Create `/app/dashboard/page.tsx`
  - [ ] Display claimed businesses
  - [ ] Show featured status and expiry
  - [ ] Edit business info button
  - [ ] Upgrade to featured button
- [ ] Create business edit form
- [ ] Create image upload for featured listings (max 8)

### Business Claim System
- [ ] Create `/app/dashboard/claim-business` page
  - [ ] Search functionality for businesses
  - [ ] Click to claim flow
- [ ] Create claim submission form
  - [ ] Business owner name/email/phone
  - [ ] Verification details
  - [ ] Submit for review
- [ ] Create admin dashboard at `/app/admin/claims`
  - [ ] List pending claims
  - [ ] Show claim details
  - [ ] Approve/reject buttons
- [ ] Create API routes:
  - [ ] POST `/api/claims` - Submit claim
  - [ ] GET `/api/claims/pending` - Get pending (admin)
  - [ ] POST `/api/claims/[id]/approve` - Approve (admin)
  - [ ] POST `/api/claims/[id]/reject` - Reject (admin)
  - [ ] PUT `/api/business/[id]` - Update business

### Testing Checkpoint
- [ ] Can submit business claim
- [ ] Admin sees pending claims
- [ ] Admin can approve claim
- [ ] Claimed business appears in user dashboard
- [ ] Can edit claimed business info
- [ ] RLS policies protect admin-only operations

---

## Phase 4: Monetization (Week 4)

### Featured Listings
- [ ] Create `/app/upgrade/featured` page
  - [ ] Show benefits
  - [ ] Display pricing tiers
  - [ ] Feature comparison
- [ ] Create upgrade flow
  - [ ] Select duration (1/3/6 months)
  - [ ] Go to checkout
  - [ ] Complete payment
  - [ ] Redirect to success
- [ ] Create `/app/upgrade/success` page
  - [ ] Show confirmation
  - [ ] Display expiry date
  - [ ] Link to business page
- [ ] Implement image upload system
  - [ ] POST `/api/business/[id]/upload-image`
  - [ ] Store images in Supabase storage
  - [ ] Update images table
  - [ ] Update featured display

### Featured Listing Database Updates
- [ ] Update `featured_listings` table on payment
- [ ] Set `businesses.featured_expiry` timestamp
- [ ] Set `businesses.is_featured = true`
- [ ] Move featured listings to top of area page
- [ ] Add blue border styling to featured listings
- [ ] Add "Featured" badge to featured listings

### Badge Generator
- [ ] Create `/app/partner-with-us` page
- [ ] Create `/app/badge-generator` page
- [ ] Implement badge HTML generation
  - [ ] User selects area
  - [ ] Generate unique embed code
  - [ ] Show preview
- [ ] Implement branded anchor text option
- [ ] Generate coupon code when badge is created
- [ ] Email coupon code to user
- [ ] Track badge program participation

### Testing Checkpoint
- [ ] Can upgrade business to featured
- [ ] Payment processes via Stripe
- [ ] Featured listing appears at top of area page
- [ ] Can upload images (max 8)
- [ ] Images display on featured listing
- [ ] Badge generator creates working code
- [ ] Coupon code is generated and works at checkout

---

## Phase 5: Technical SEO (Week 5)

### Schema Markup
- [ ] Create `/lib/schema.ts` utility
  - [ ] `generateLocalBusinessSchema(business)`
  - [ ] `generateBreadcrumbSchema(area)`
  - [ ] `generateFAQSchema(faqs)`
  - [ ] `generateItemListSchema(businesses)`
- [ ] Integrate schema into pages:
  - [ ] Business detail page (LocalBusiness)
  - [ ] Area page (Breadcrumb + FAQ + ItemList)
  - [ ] Homepage (Organization)
- [ ] Test schema with Google Rich Result Tester
- [ ] Validate all schema is proper JSON-LD

### Meta Tags & SEO
- [ ] Create meta tag helper utility
- [ ] Add unique title tags to all pages
- [ ] Add meta descriptions (120-160 chars)
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Create sitemap.xml
- [ ] Create robots.txt
- [ ] Test SEO with Lighthouse

### Geolocation & Mapping
- [ ] Integrate Leaflet/mapping library
- [ ] Create map component for single business
- [ ] Create map component for area (show all businesses)
- [ ] Add clustering for multiple markers
- [ ] Update business pages to show map
- [ ] Update area pages to show map

### Coupon Code Admin Tool
- [ ] Create `/app/admin/coupons` page (protected)
- [ ] Build coupon generation form:
  - [ ] Discount type (percentage/fixed)
  - [ ] Max uses (optional)
  - [ ] Expiration date (optional)
  - [ ] Notes for tracking
- [ ] Create `/api/admin/generate-coupon` endpoint
- [ ] Display active coupon codes
- [ ] Show usage stats
- [ ] Allow deactivation

### Testing Checkpoint
- [ ] Schema markup validates in Google tool
- [ ] Pages appear in search results with rich snippets
- [ ] Meta tags are unique and descriptive
- [ ] Maps load and display correctly
- [ ] Can generate coupon codes in admin
- [ ] Coupon codes work at checkout
- [ ] Coupon uses are tracked

---

## Phase 6: Polish & Testing (Week 6)

### Performance
- [ ] Test Core Web Vitals (Lighthouse)
- [ ] Optimize images (WebP, lazy loading)
- [ ] Implement caching strategies
- [ ] Test load times on slow 3G
- [ ] Minify and tree-shake unused code
- [ ] Test on various devices/browsers

### Mobile Responsiveness
- [ ] Test on iPhone (iOS)
- [ ] Test on Android phone
- [ ] Test on tablet
- [ ] Test all interactive elements
- [ ] Verify touch targets are large enough
- [ ] Check form inputs are accessible

### Accessibility (WCAG 2.1 AA)
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] No auto-playing audio/video

### Bug Testing
- [ ] Test auth flows (signup, login, logout)
- [ ] Test business creation/submission
- [ ] Test business claiming
- [ ] Test featured upgrade flow
- [ ] Test image uploads
- [ ] Test search/filters
- [ ] Test admin approval workflow
- [ ] Test coupon codes at checkout
- [ ] Test badge generation

### Content & Copy
- [ ] Review all page copy
- [ ] Check for typos/grammar
- [ ] Ensure tone is consistent
- [ ] Add helpful tooltips where needed
- [ ] Create help/FAQ page
- [ ] Create terms and privacy policy

---

## Phase 7: Launch Preparation (Week 6-7)

### Deployment Setup
- [ ] Create Vercel account
- [ ] Link GitHub repository
- [ ] Configure environment variables in Vercel
- [ ] Set up production Supabase project
- [ ] Set up production Stripe keys
- [ ] Create production database

### Pre-Launch Testing
- [ ] Test full flow on staging/production build
- [ ] Verify all environment variables work
- [ ] Test email notifications
- [ ] Test payment webhooks
- [ ] Test backups and recovery
- [ ] Verify error handling

### Analytics & Monitoring
- [ ] Set up Google Analytics
- [ ] Set up Sentry for error tracking
- [ ] Set up uptime monitoring
- [ ] Create admin dashboard for monitoring
- [ ] Set up email alerts for errors

### Launch Checklist
- [ ] DNS configured
- [ ] SSL certificate working
- [ ] All pages indexed by Google
- [ ] Robots.txt allows crawling
- [ ] Sitemap submitted to Google Search Console
- [ ] Social media profiles created
- [ ] Email notifications configured
- [ ] Admin can approve/reject businesses
- [ ] Featured payments confirmed in Stripe

---

## Post-Launch (Week 8+)

### Monitoring
- [ ] [ ] Monitor traffic and usage
- [ ] [ ] Track conversion rates
- [ ] [ ] Monitor error logs daily
- [ ] [ ] Check Google Search Console
- [ ] [ ] Monitor Stripe payments
- [ ] [ ] Check page load times

### Iteration
- [ ] [ ] Gather user feedback
- [ ] [ ] Identify bugs/issues
- [ ] [ ] Prioritize feature requests
- [ ] [ ] Make continuous improvements
- [ ] [ ] Optimize for conversions
- [ ] [ ] A/B test critical flows

### Growth Tactics
- [ ] [ ] Optimize for SEO (target keywords per area)
- [ ] [ ] Promote badge program (more backlinks)
- [ ] [ ] Reach out to businesses individually
- [ ] [ ] Create content (blog about halal food)
- [ ] [ ] Partner with local communities
- [ ] [ ] Gather customer testimonials
- [ ] [ ] Monitor LLM traffic (ChatGPT, Claude)

---

## Key Metrics to Track

**Traffic & Discovery**
- [ ] Monthly unique visitors
- [ ] Traffic by area
- [ ] Top entry pages
- [ ] Bounce rate
- [ ] Session duration

**Conversions**
- [ ] Visitor → Claim submission rate
- [ ] Claim → Approval rate
- [ ] Visitor → Featured upgrade rate
- [ ] Featured upgrade revenue
- [ ] Average featured duration purchased

**Business Performance**
- [ ] Total businesses listed
- [ ] Total claimed businesses
- [ ] Total featured businesses
- [ ] Business submissions (crowdsourced)
- [ ] Badge program participation

**Financial**
- [ ] Revenue from featured listings
- [ ] Average revenue per business
- [ ] Stripe fees and costs
- [ ] Server costs (Vercel + Supabase)

**Search Performance**
- [ ] Keyword rankings per area
- [ ] Search impressions
- [ ] Click-through rate
- [ ] Featured snippet appearances

---

## Quick Prompt Reference

### Database Setup
```
"Add the following tables to Supabase: areas, businesses, business_claims, featured_listings, images, coupon_codes with proper foreign keys and RLS policies"
```

### Directory Pages
```
"Create Next.js pages for /directory/[area] and /business/[id] with featured listings at top, proper schema markup, and area-specific FAQs"
```

### Featured Listings
```
"Implement featured listing system with Stripe one-time charges, coupon support, image uploads (max 8), and automatic top placement"
```

### Schema Markup
```
"Add LocalBusiness, BreadcrumbList, FAQPage, and ItemList schema markup to all directory pages using JSON-LD format"
```

### Badge Generator
```
"Create badge generator tool that generates HTML embed code and branded anchor text for backlink program, with coupon code delivery"
```

---

## Troubleshooting Quick Links

**Issue**: Stripe webhook not working
→ Check: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Issue**: Database tables don't exist
→ Run: `supabase db reset` (local) or `supabase db push` (production)

**Issue**: Magic link emails not arriving
→ Check: Mailpit at `http://127.0.0.1:54344` (local dev)

**Issue**: Featured listings not showing on top
→ Check: `is_featured` flag and query sorting in `/app/directory/[area]/page.tsx`

**Issue**: Images not uploading
→ Check: Supabase storage permissions and bucket configuration

**Issue**: Coupon codes not working at checkout
→ Check: Stripe coupon sync and validation in checkout endpoint

---

## Success Criteria

✅ **Launch is successful when:**
- [ ] 100+ businesses listed in directory
- [ ] 5+ businesses have claimed their listing
- [ ] 2+ businesses have purchased featured listings
- [ ] Directory is ranking for local keywords
- [ ] Mobile site scores 90+ on Lighthouse
- [ ] No critical errors in Sentry
- [ ] Payments processed successfully
- [ ] Admin workflow tested and working
- [ ] Schema markup validated
- [ ] SEO basics implemented

---

## Contact & Support

- **Claude Code Docs**: https://docs.claude.com
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Community**: ISS AI Automation School on Skool

Good luck! Check items off as you complete them. 🚀
