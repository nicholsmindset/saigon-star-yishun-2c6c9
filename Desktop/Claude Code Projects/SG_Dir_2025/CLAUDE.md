# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Singapore Halal Directory - A Next.js-based local business directory platform for halal-certified businesses in Singapore. Built with AI-assisted development using Claude Code, featuring programmatic SEO, featured listings monetization, and crowdsourced business submissions.

**Tech Stack:**
- Frontend: Next.js 16 (App Router), React, TypeScript
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (Magic Links)
- Payments: Stripe (one-time charges)
- Deployment: Vercel/Netlify
- Maps: Open Street Maps (Leaflet)
- Version Control: GitHub
- Development Tool: Claude Code with Supabase MCP

**Project Status:** Planning/Documentation phase - implementation ready to begin

## Key Architecture Concepts

### Database Schema (Planned)

**Core Tables:**
- `areas` - Singapore districts/neighborhoods with SEO metadata
- `businesses` - Halal business listings with geolocation
- `business_claims` - Ownership claim verification workflow
- `featured_listings` - Paid featured placement tracking
- `images` - Business photo uploads (max 8 for featured, 1 for standard)
- `coupon_codes` - Promotional codes for featured upgrades
- `profiles` - User accounts with role flags (admin, business_owner)

**Key Relationships:**
- businesses.area_id → areas.id (one-to-many)
- business_claims.business_id → businesses.id (one-to-many)
- featured_listings.business_id → businesses.id (one-to-many)
- images.business_id → businesses.id (one-to-many)

### Application Architecture

**Page Structure:**
```
/                          - Homepage
/directory                 - All areas listing
/directory/[area]          - Area pillar pages (SEO optimized)
/business/[id]             - Business detail pages
/search                    - Search results
/dashboard                 - User dashboard (claim management)
/dashboard/claim-business  - Business claim flow
/upgrade/featured          - Featured listing checkout
/admin/claims              - Admin approval workflow
/admin/coupons             - Coupon code generator
/badge-generator           - Badge/backlink program
```

**Authentication Flow:**
```
User → Magic Link Email → Dashboard → Claim Business → Admin Review → Business Owner Dashboard
```

**Featured Listing Flow:**
```
Business Detail → Upgrade Button → Select Duration (1/3/6 months) → Stripe Checkout → Webhook Updates → Featured Badge + Top Placement
```

### Critical Design Patterns

**1. Programmatic SEO Structure**
- Area-specific pillar pages with unique content
- Contextual FAQs per area (e.g., "What halal certifications do Bugis businesses have?")
- Smart internal linking between related areas and business types
- Schema markup on ALL pages (LocalBusiness, BreadcrumbList, FAQPage, ItemList)

**2. Featured vs Standard Listings**
- Standard: 1 image, regular placement, free
- Featured: 8 images, top placement, blue border, "Featured" badge, paid ($29/1mo, $75/3mo, $140/6mo)
- Featured expiry tracked via `featured_expiry` timestamp
- Auto-sort featured listings to top of area pages

**3. Crowdsourced Content Strategy**
- Users submit new businesses via form
- Admin reviews and approves (2-minute workflow)
- Approved submissions auto-generate new area pages
- Expands keyword footprint organically

**4. Badge/Backlink Program**
- Businesses embed badge on their website
- Badge links back to directory (backlink)
- Reward: 1 free month of featured listing ($29 value)
- Two options: HTML embed or branded anchor text

## Development Commands

### Local Development Setup
```bash
# Start local Supabase (must have Docker running)
supabase start

# Start Next.js dev server
npm run dev

# Start Claude Code with boilerplate automation
claude --dangerously-skip-permissions
# Then run: /setup-boilerplate
```

### Database Operations
```bash
# Create new migration
supabase migration new [migration_name]

# Apply migrations locally
supabase db push

# Generate TypeScript types from schema
supabase gen types typescript --local > types/database.ts

# Reset database (DESTRUCTIVE)
supabase db reset

# Deploy migrations to production
supabase db push --remote
```

### Testing & Quality
```bash
# Lint code
npm run lint

# Build for production (verify no errors)
npm run build

# Run Playwright tests
npx playwright test

# Run Playwright in headed mode (see browser)
npx playwright test --headed

# Generate tests by recording actions
npx playwright codegen http://localhost:3000

# Visual regression testing
npx playwright test --update-snapshots
```

### Deployment
```bash
# Deploy to Netlify staging
netlify deploy

# Deploy to Netlify production
netlify deploy --prod

# Check deployment status
netlify status

# View deployment logs
netlify logs
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/[feature-name]

# Commit with conventional commits format
git commit -m "feat: add featured listing system"
git commit -m "fix: correct area page sorting"
git commit -m "migration: add business_claims table"

# Create pull request via GitHub CLI
gh pr create --title "Add featured listings" --body "Implementation details..."

# Merge PR (squash)
gh pr merge --squash
```

## Important Implementation Notes

### Stripe Integration Customization

The boilerplate uses subscription-based Stripe integration. For this project, you MUST modify it for one-time charges:

**Key Changes Required:**
1. Create one-time charge products (not subscriptions) for 1/3/6 month durations
2. Modify webhook handler to listen for `charge.succeeded` (not `customer.subscription.updated`)
3. Update `featured_listings` table on successful payment
4. Set `businesses.featured_expiry` timestamp based on duration purchased
5. Mark `businesses.is_featured = true`
6. Support coupon codes at checkout

**Reference:** See `Stripe_CLI_Integration_Guide.md` for detailed webhook setup

### Schema Markup Requirements

Schema markup is THE most critical SEO feature. Implement on ALL pages:

**Business Detail Pages:**
- `LocalBusiness` schema with opening hours, address, geo coordinates
- `BreadcrumbList` for navigation hierarchy

**Area Pages:**
- `ItemList` schema for business listings
- `FAQPage` schema for area-specific FAQs
- `BreadcrumbList` for navigation

**Homepage:**
- `Organization` schema for the directory itself

**Implementation Pattern:**
```typescript
// In each page.tsx
export const metadata = {
  // ... other metadata
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
      />
      {/* Page content */}
    </>
  );
}
```

**Validation:** Use Google Rich Results Test after implementation

### Featured Listing Visual Design

**Standard Listing Card:**
- White background
- 1 image
- Business name, type, address
- Regular border
- Sorted by name/date

**Featured Listing Card:**
- Blue border (`border-2 border-blue-500`)
- "Featured" badge in top-right corner (`bg-blue-500 text-white`)
- Up to 8 images in carousel/gallery
- Same info as standard
- ALWAYS appears first in area page list

**Sorting Logic:**
```typescript
// Area page business query
const businesses = await supabase
  .from('businesses')
  .select('*')
  .eq('area_id', areaId)
  .order('is_featured', { ascending: false })
  .order('name', { ascending: true });
```

### Admin Workflow Patterns

**Business Claim Approval:**
1. User submits claim via `/dashboard/claim-business`
2. Admin sees pending claim in `/admin/claims`
3. Admin reviews business details + user info
4. Click "Approve" → Updates `businesses.claimed_by` and `profiles.is_business_owner`
5. User gets email notification + dashboard access

**Coupon Code Generation:**
1. Admin visits `/admin/coupons`
2. One-click generation creates unique code
3. Code synced to Stripe
4. Code can be used at featured listing checkout
5. Track usage count and expiration

### RLS (Row Level Security) Policies

**Critical Policies:**
- Regular users can view approved businesses only
- Business owners can edit ONLY their claimed businesses
- Admins can edit/approve all businesses
- Admins can view/manage all claims
- Users can submit business claims
- Public can view featured listings and area pages

**Implementation Pattern:**
```sql
-- Example: Business owners can only edit their claimed businesses
CREATE POLICY "Business owners can update own businesses"
ON businesses
FOR UPDATE
USING (claimed_by = auth.uid());

-- Example: Only admins can approve business claims
CREATE POLICY "Admins can approve claims"
ON business_claims
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

### Image Upload Strategy

**Supabase Storage Configuration:**
- Bucket: `business-images`
- Max file size: 5MB per image
- Allowed types: JPG, PNG, WebP
- Standard listings: 1 image max
- Featured listings: 8 images max

**Upload Flow:**
1. User uploads via `/dashboard/business/[id]/edit`
2. Image stored in Supabase Storage
3. URL saved to `images` table with `business_id` foreign key
4. Images displayed in business card carousel

**Optimization:**
- Convert to WebP format
- Generate thumbnails (200x200, 400x400)
- Lazy load images below fold
- Use Next.js Image component

### SEO Best Practices

**Programmatic Page Generation:**
- Each area gets unique pillar page (`/directory/[area]`)
- Title: "Halal [Business Type] in [Area Name] - Singapore Halal Directory"
- Meta Description: "Discover certified halal [businesses] in [Area]. Browse [X] verified listings with reviews, photos, and halal certification details."
- H1: "Halal Businesses in [Area Name]"
- Area-specific FAQ section (3-5 questions)

**Internal Linking Strategy:**
- Link related areas (neighboring districts)
- Link related business types within same area
- Breadcrumb navigation on all pages
- Footer links to all major areas

**Performance Targets:**
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Lighthouse score: 90+ on mobile
- Load time on 3G: <3s

## Common Development Workflows

### Adding a New Feature

1. Create feature branch: `git checkout -b feature/name`
2. If database changes needed: `supabase migration new [name]`
3. Develop feature with Claude Code
4. Test locally: `npm run dev` + `npx playwright test`
5. Build and lint: `npm run build && npm run lint`
6. Commit: `git commit -m "feat: description"`
7. Create PR: `gh pr create`
8. Deploy to staging: `netlify deploy`
9. After review: `gh pr merge --squash`
10. Deploy to production: `netlify deploy --prod`

### Testing User Flows with Playwright

**Key Test Scenarios:**
- User can search and find businesses by area
- User can view business details
- User can claim a business listing
- Business owner can edit claimed business
- Admin can approve pending claims
- User can upgrade to featured listing
- Featured listings appear at top of area pages
- Badge generator creates working embed code
- Coupon codes work at checkout

**Test Pattern:**
```typescript
import { test, expect } from '@playwright/test';

test('user can claim business', async ({ page }) => {
  await page.goto('/business/test-id');
  await page.click('text=Claim This Business');
  await page.fill('[name="ownerName"]', 'John Doe');
  await page.fill('[name="ownerEmail"]', 'john@example.com');
  await page.click('button:has-text("Submit Claim")');
  await expect(page).toContainText('Claim submitted for review');
});
```

### CSS Theme Extraction (Clay.com Reference)

The project uses Clay.com as visual design inspiration. To extract and adapt CSS:

```bash
# Start Playwright Inspector on Clay.com
npx playwright codegen https://www.clay.com

# In Playwright Inspector:
# 1. Inspect elements you want to replicate
# 2. Copy CSS from DevTools
# 3. Take screenshots of components
# 4. Adapt colors/spacing for halal directory theme

# Create custom theme
# Edit app/globals.css with:
# - Halal green: #10b981
# - Featured blue: #3b82f6
# - Certified gold: #fbbf24
```

## Project Constraints & Decisions

**Why This Tech Stack:**
- Next.js: SEO-friendly, server-side rendering, App Router for programmatic pages
- Supabase: PostgreSQL + Auth + Storage all-in-one, RLS for security
- Stripe: Industry-standard payments, coupon support built-in
- Claude Code: Rapid development with AI assistance, $17/month vs hiring developers

**Why NOT WordPress:**
- Manual schema implementation across thousands of pages is painful
- Plugin configuration for directory structure is complex
- Programmatic SEO at this scale requires custom code
- Claude Code builds this faster and cheaper than WordPress setup

**Monetization Strategy:**
- Free standard listings (1 image, regular placement)
- Paid featured listings ($29/1mo, $75/3mo, $140/6mo)
- Badge program (free featured month for backlink)
- Future: Premium business profiles, analytics dashboards

**Growth Strategy:**
- Programmatic SEO for 4,800+ area pages
- Schema markup for Google/LLM visibility
- Crowdsourced submissions for content expansion
- Badge program for backlinks
- Target: 6,000 monthly visitors within 3 months

## Reference Documentation

When working on specific features, refer to:

- **Complete_Development_Workflow_Guide.md** - Full CLI commands and workflows
- **Implementation_Checklist.md** - Phase-by-phase development plan
- **Boilerplate_Review_and_Adaptation_Guide.md** - How to customize the SaaS starter
- **Stripe_CLI_Integration_Guide.md** - Webhook setup and testing
- **Programmatic_SEO_Location_Strategy.md** - SEO and area page generation
- **Complete_Site_Wireframes.md** - UI/UX specifications
- **Advanced_Features_Guide.md** - Badge generator, coupons, admin tools

## Critical Success Metrics

**Traffic & Discovery:**
- Monthly unique visitors: Target 6,000 in 3 months
- 99% Singapore-based traffic
- Page 1 rankings for "halal [business type] in [area]"

**Conversions:**
- 5+ claimed businesses in first month
- 2+ featured listing purchases in first month
- 10+ badge program participants in first 6 months

**Technical:**
- Lighthouse score: 90+ mobile
- Zero critical errors in production
- Schema markup validates in Google Rich Results Test
- Core Web Vitals: All green

**Financial:**
- Break even at 5 featured listings per month ($145 revenue)
- Target: 20 featured listings per month ($580 revenue) by month 6

## Development Philosophy

This project demonstrates that **AI-coded solutions with proper architecture outperform traditional platforms** for niche directories:

- Schema markup applied to 5,000+ pages in 10-15 minutes (vs weeks manually)
- Programmatic SEO pages generated via prompts (vs complex plugins)
- Custom user experiences built rapidly (vs theme limitations)
- Cost efficiency: $17/month Claude Code vs $50-100/month WordPress + plugins + hosting

When implementing features, prioritize:
1. **SEO first** - Schema markup, meta tags, internal linking
2. **User experience** - Clean dashboards, intuitive flows
3. **Performance** - Fast load times, optimized images
4. **Monetization clarity** - Clear featured vs standard distinction
5. **Admin efficiency** - Quick approval workflows, automated processes

## Notes for Future Development

**Phase 1 (Weeks 1-2): Foundation**
- Database schema implementation
- Authentication with roles
- Basic area and business pages

**Phase 2 (Weeks 3-4): Core Features**
- Business claim system
- Admin approval workflow
- Featured listing checkout

**Phase 3 (Weeks 5-6): SEO & Polish**
- Schema markup implementation
- Performance optimization
- Testing and bug fixes

**Phase 4 (Week 7+): Launch**
- Production deployment
- Initial business seeding
- Marketing and growth tactics

**Future Enhancements:**
- Mobile app for discovery
- Business analytics dashboard
- Review and rating system
- SMS notifications for featured expiry
- Multi-city expansion (Malaysia, Indonesia)
- API for third-party integrations
