# Singapore Halal Directory: Claude Code Prompt Guide

## Project Overview

Build a fully AI-coded directory for Singapore halal businesses with SEO optimization, user submissions, monetization features, and proper technical implementation.

**Tech Stack**:
- Next.js, React, TypeScript
- Supabase (database)
- Vercel (deployment)
- Open Street Maps (geolocation)
- Stripe (payments)

---

## Phase 1: Core Architecture Setup

### Prompt 1.1: Database Schema

```
I'm building a Singapore Halal Directory using Next.js, React, TypeScript, Supabase, and Vercel. 

Please create comprehensive database tables with the following structure:

1. **businesses** table:
   - id (UUID)
   - name (string)
   - description (text)
   - area (string) - e.g., "Bugis", "Tampines", "Bukit Merah"
   - postal_code (string)
   - address (string)
   - latitude/longitude (decimal for geolocation)
   - business_type (enum: restaurant, butcher, cafe, bakery, other)
   - phone (string)
   - website (string, nullable)
   - opening_hours (JSON)
   - is_featured (boolean)
   - featured_expiry (timestamp, nullable)
   - status (enum: pending, approved, rejected)
   - images (array, max 8 for featured, 1 for standard)
   - halal_certification (string) - e.g., MUIS certified, ISCED, etc.
   - created_at, updated_at (timestamps)
   - created_by (user_id)
   - claimed_by (user_id, nullable)

2. **users** table:
   - id (UUID)
   - email (string, unique)
   - password_hash (string)
   - business_name (string, nullable)
   - is_admin (boolean)
   - created_at, updated_at (timestamps)

3. **business_claims** table:
   - id (UUID)
   - business_id (UUID)
   - user_id (UUID)
   - status (enum: pending, approved, rejected)
   - submission_details (JSON)
   - created_at, updated_at (timestamps)

4. **featured_purchases** table:
   - id (UUID)
   - business_id (UUID)
   - user_id (UUID)
   - stripe_payment_id (string)
   - duration_days (integer)
   - price_cents (integer)
   - expires_at (timestamp)
   - created_at (timestamp)

5. **coupon_codes** table:
   - id (UUID)
   - code (string, unique)
   - discount_percent (integer)
   - discount_cents (integer, nullable)
   - max_uses (integer, nullable)
   - uses_count (integer)
   - expires_at (timestamp, nullable)
   - created_at (timestamp)

6. **areas** table (for pillar pages):
   - id (UUID)
   - name (string) - e.g., "Bugis", "Tampines"
   - slug (string, unique)
   - region (string) - e.g., "Central", "East", "West"
   - description (text, nullable)
   - faq_schema (JSON) - structured FAQ for this area
   - created_at, updated_at (timestamps)

Please create these tables with proper indexes, constraints, and Row Level Security (RLS) policies for Supabase. Include clear comments explaining each field.
```

### Prompt 1.2: Authentication & User System

```
Using the database schema you just created, build a complete authentication system with:

1. **User signup/login flow**:
   - Email-based authentication
   - Secure password hashing (bcrypt)
   - JWT token handling
   - Session management
   - Redirect to dashboard after login

2. **Middleware**:
   - Protect routes based on user role (regular user vs admin)
   - Verify JWT tokens
   - Handle session expiration

3. **Admin-specific access**:
   - Only users with is_admin=true can access admin dashboard
   - Admin can view, approve/reject claims and submissions
   - Admin can generate coupon codes

4. **User dashboard**:
   - View claimed businesses
   - View featured listing status and expiry
   - Manage business information
   - Upload images (for featured listings)

Please build this with best practices for security. Don't include any placeholder authentication—make it production-ready.
```

---

## Phase 2: Directory Features

### Prompt 2.1: Pillar Pages & Area Pages

```
I need to create SEO-optimized pillar pages for Singapore halal businesses.

Requirements:

1. **Dynamic area pages** (/directory/[area]):
   - Slug-based routing (e.g., /directory/bugis, /directory/tampines)
   - Display all businesses in that area
   - Featured listings appear at the top (with blue border and "Featured" badge)
   - Standard listings below, sorted by name or relevance

2. **Content structure**:
   - Area header with description
   - Business listings grid/list
   - Contextual FAQ section (e.g., "What halal certifications do Bugis restaurants have?")
   - Internal linking to adjacent areas and business types

3. **Schema markup** (LocalBusiness, BreadcrumbList, FAQPage):
   - Proper structured data for each business
   - FAQPage schema for the area-specific FAQ
   - BreadcrumbList showing: Home > Region > Area

4. **Performance**:
   - Server-side rendering (SSR) or Static Generation (SSG)
   - Proper image optimization
   - Clean URLs

Create this using best practices for SEO. Each page should feel tailored to the specific area, not generic.
```

### Prompt 2.2: Business Search & Discovery

```
Build a business discovery system with the following:

1. **Search functionality**:
   - Search by business name
   - Filter by area (dropdown)
   - Filter by business type (restaurant, butcher, cafe, bakery, etc.)
   - Filter by halal certification type
   - Autocomplete for area names

2. **Results page**:
   - Display matching businesses
   - Show featured listings prominently
   - Display all relevant info: address, phone, hours, certification, images
   - Link to detailed business page

3. **Detailed business page** (/business/[id]):
   - Full business information
   - All images (featured listings show 8, standard show 1)
   - Map showing location (using Open Street Maps)
   - "Claim this business" button (if not claimed)
   - "Upgrade to featured" button (for business owners)

4. **Mobile-responsive design** throughout.

Use Next.js dynamic routes and make this production-ready. All images should be optimized and lazy-loaded.
```

### Prompt 2.3: User Submission (Add New Business)

```
Create a feature allowing users to submit new businesses to the directory.

1. **Submission form**:
   - Business name (required)
   - Business type (dropdown: restaurant, butcher, cafe, bakery, other)
   - Area/location (dropdown, with autocomplete)
   - Address (required)
   - Postal code (required)
   - Phone (required)
   - Website (optional)
   - Opening hours (structured input)
   - Halal certification type (optional)
   - Description (optional)

2. **After submission**:
   - Show "Thank you" message
   - Set status to "pending" in database
   - Don't publish to public directory until admin approves

3. **Admin review**:
   - Admin sees new submissions in dashboard
   - Can view submission details
   - Can approve (creates live page) or reject with reason
   - When approved, automatically create SEO-optimized area page if it doesn't exist

4. **Form validation**:
   - Check for duplicates before accepting
   - Validate postal codes (Singapore format)
   - Trim and sanitize inputs

The goal is to make this frictionless for users while maintaining quality control.
```

---

## Phase 3: Monetization Features

### Prompt 3.1: Featured Listings System

```
Build the featured listings upgrade system:

1. **Featured upgrade button**:
   - Located on business pages and in user dashboards
   - Clear "Upgrade to Featured" CTA
   - Show benefits (top placement, more images, visibility boost)

2. **Pricing page**:
   - Show featured listing options:
     * 1 month: $29
     * 3 months: $75 (save $12)
     * 6 months: $140 (save $34)
   - Include feature comparison (standard vs featured)
   - Powered by Stripe for payments

3. **Checkout flow**:
   - Stripe hosted checkout or embedded form
   - Accept coupon codes at checkout
   - Clear order summary
   - Post-payment redirect to success page

4. **Post-purchase behavior**:
   - Update featured_expiry timestamp in database
   - Automatically move business to top of area page with:
     * Blue border styling
     * "Featured" badge in corner
   - Enable image upload (up to 8 images)
   - Show dashboard displaying remaining days until expiry

5. **Renewal reminders**:
   - Email users 7 days before featured expiry
   - Link to easy renewal process

Use Stripe API for payment processing. All transactions should be logged in the featured_purchases table.
```

### Prompt 3.2: Badge Generator & Backlink Strategy

```
Create a badge generator tool to incentivize backlinks:

1. **Badge generator page** (/partner-with-us or similar):
   - Explain the partnership (free featured listing in exchange for displaying badge + backlink)
   - Show two options:

   **Option 1 - HTML Badge (technical)**:
   - User selects their business area
   - System generates unique HTML code
   - Code creates an embedded badge linking back to their business page
   - User copies and pastes into their website
   - Badge must include: area name, "Featured on Singapore Halal Directory", link back

   **Option 2 - Branded Anchor Text (non-technical)**:
   - Provide pre-written text like: "Featured on Singapore Halal Directory"
   - User adds this text as a link to their business page
   - Send email template: "Where to add the link, what it should say, etc."
   - User emails us the confirmation

2. **Coupon code generation**:
   - When user completes either option, provide coupon code worth 1 month free featured listing ($29 value)
   - Code is valid for 30 days
   - Can be used once per business

3. **Tracking**:
   - Log which businesses have participated in backlink program
   - Track backlink placement on their websites (optional monitoring)

4. **Success page**:
   - Display generated badge and embed code
   - Show coupon code prominently
   - Email coupon code to their email address
   - Clear instructions on next steps

The goal is to build high-quality, contextually relevant backlinks from local halal businesses while incentivizing them to promote their listing.
```

### Prompt 3.3: Coupon Code System

```
Build an admin coupon code generator:

1. **Admin dashboard section**:
   - "Generate Coupon Codes" button
   - Form fields:
     * Discount amount (either percentage or fixed dollar amount)
     * Max uses (optional - leave blank for unlimited)
     * Expiration date (optional)
     * Notes/reason for creating (for tracking)

2. **Code generation**:
   - Generate random alphanumeric codes (e.g., HALAL2024ABC)
   - Make them human-readable (avoid confusing letters like O/0, I/1)
   - Unique constraint in database

3. **Stripe integration**:
   - Codes must work seamlessly with Stripe checkout
   - Apply discounts correctly at checkout
   - Handle both percentage and fixed discounts

4. **Admin tracking**:
   - Show list of all active coupon codes
   - Display uses count vs max uses
   - Show expiration date
   - Option to manually deactivate codes

5. **Validation**:
   - Check code validity at checkout
   - Check expiration date
   - Check max uses limit
   - Increment use counter after successful purchase

This should be simple and lightweight—no complex CMS required, just a quick admin tool.
```

---

## Phase 4: Business Claim System

### Prompt 4.1: Business Claiming

```
Build a streamlined business claiming system:

1. **User perspective** (claiming a business):
   - User logs in to dashboard
   - Click "Claim a Business"
   - Search/filter to find their business (by area + name)
   - If found, click "Claim"
   - Fill out verification form:
     * Business owner name
     * Business owner email
     * Phone number
     * Proof/verification details (optional)
   - Submit claim
   - See "Pending approval" status

2. **Admin approval flow**:
   - Admin sees pending claims in dashboard
   - Shows claim details: business name, claimant info, business contact, verification details
   - Admin can:
     * Verify information is legitimate
     * Approve claim (mark business as claimed, grant user edit access)
     * Reject claim with optional reason
   - Claimant receives email confirmation

3. **Claimed business capabilities**:
   - User can edit business information:
     * Description
     * Hours
     * Phone
     * Website
     * Images (if featured)
   - User can view analytics (visitors, clicks, featured expiry, etc.)
   - User can upgrade to featured from dashboard
   - One-click "edit" button in dashboard (better UX than Geo Directory)

4. **Duplicate handling**:
   - Prevent multiple claims on same business
   - Check email/phone before accepting claim
   - Allow admin to manually assign ownership if needed

This should feel intuitive for restaurant owners who aren't tech-savvy.
```

---

## Phase 5: Technical SEO & Schema Markup

### Prompt 5.1: Schema Markup Implementation

```
Implement comprehensive, production-ready schema markup across all pages:

1. **LocalBusiness schema** (on all business listings):
   - name, description, telephone, url
   - address (streetAddress, addressLocality, postalCode, addressCountry)
   - geo (latitude, longitude)
   - openingHoursSpecification (day, opens, closes)
   - image (featured image)

2. **Organization schema** (homepage):
   - name: "Singapore Halal Directory"
   - description
   - url, logo
   - contact information

3. **BreadcrumbList schema** (all area pages):
   - Home > Region > Area
   - Proper URL structure

4. **FAQPage schema** (area pages):
   - Question/answer pairs for contextual FAQs
   - Proper formatting for Google's FAQ rich snippet

5. **ItemList schema** (business listing pages):
   - List of businesses in area
   - Properly ordered, with name, description, URL

6. **CollectionPage schema** (search/filter results):
   - Represents collection of matching businesses

Implementation guidelines:
- Use Next.js JSON-LD (via next/head or next-seo package)
- Schema should be data-driven (pulled from database)
- Validate with Google's Rich Result Tester
- Include microdata attributes where appropriate
- All schema must be valid and production-ready—no half-measures

This is critical for SEO and LLM visibility. Spend extra time getting this right.
```

### Prompt 5.2: SEO Optimization

```
Implement core SEO optimizations:

1. **Meta tags & Open Graph**:
   - Unique title tags for each page (include area name, business type)
   - Meta descriptions (120-160 characters, include relevant keywords)
   - Open Graph tags (og:title, og:description, og:image, og:url)
   - Twitter Card tags
   - Canonical URLs

2. **URL structure**:
   - Clean, descriptive URLs
   - Include target keywords where appropriate
   - /directory/[area-slug]
   - /business/[business-slug]
   - /business-type/[type]
   - Avoid query parameters where possible

3. **Heading hierarchy**:
   - H1: One per page (page title or main heading)
   - H2/H3: Proper hierarchy for content sections
   - Include target keywords in headings naturally

4. **Image optimization**:
   - Descriptive alt text (include business name, dish type, etc.)
   - Use Next.js Image component for automatic optimization
   - Implement lazy loading
   - Proper file formats (WebP with fallbacks)

5. **Internal linking**:
   - Link related businesses (same area, similar type)
   - Link to area pages from business pages
   - Link to business type pages
   - Use descriptive anchor text (avoid generic "click here")

6. **Performance**:
   - Core Web Vitals optimization
   - Mobile responsiveness
   - Fast page load times
   - Proper caching strategies

7. **Sitemap & robots.txt**:
   - Dynamically generated sitemap.xml
   - robots.txt allowing crawlers, disallowing admin areas

All optimizations should be built-in, not afterthoughts. This directory should be an SEO machine from day one.
```

---

## Phase 6: Design & UI/UX

### Prompt 6.1: Design System & Components

```
Create a clean, modern design system for a Singapore halal business directory:

Design principles:
- Green as primary color (halal association)
- White, light gray as secondary colors
- Clear typography hierarchy
- Mobile-first responsive design
- Accessibility-first (WCAG 2.1 AA)

Components to build:
- Header/navigation (with search, login, admin access)
- Business card/listing component
- Featured listing component (visually distinct with blue border, badge)
- Search/filter bar (area dropdown, type filter, search input)
- Pagination or infinite scroll for results
- User dashboard layout
- Admin dashboard layout
- Forms (claim, submit, upload images)
- Modals (feature upgrade, coupon display)
- Footer with links and info

Styling approach:
- Use Tailwind CSS for utility-first styling
- Create reusable component library
- Maintain consistent spacing, sizing, and color palette
- Ensure all components are mobile-responsive

Build with accessibility in mind: proper ARIA labels, keyboard navigation, color contrast, etc.
```

### Prompt 6.2: Landing Page & Homepage

```
Create an engaging homepage that converts visitors:

1. **Hero section**:
   - Headline: "Discover Singapore's Halal Businesses"
   - Subheading: "Find restaurants, butchers, cafes certified halal"
   - Search bar (area + business name)
   - CTA button: "Browse Directory"

2. **How it works section**:
   - 3-step process with icons
   - Step 1: Search by area
   - Step 2: View verified businesses
   - Step 3: Claim or contact

3. **Featured businesses carousel**:
   - Showcase 6-8 featured listings
   - Auto-rotating carousel with manual controls
   - High-quality images

4. **For business owners section**:
   - Benefits of claiming/featuring their business
   - CTA: "Claim Your Business" or "Upgrade to Featured"
   - Testimonial from participating business owner (if available)

5. **Statistics section**:
   - Total businesses listed
   - Total areas covered
   - Total certifications represented
   - Real-time or updated monthly

6. **FAQ section**:
   - 5-6 common questions
   - Expandable accordion
   - Include "How much does featured listing cost?" and "How do I claim my business?"

7. **Footer**:
   - Links: Privacy, Terms, Contact
   - Business owner resources
   - Social media links

Design this to be visually appealing, conversion-focused, and fast-loading. This is the first impression for new visitors.
```

---

## Phase 7: Deployment & Monitoring

### Prompt 7.1: Deployment & Performance

```
Set up production deployment on Vercel with optimization:

1. **Environment setup**:
   - Production, staging, and development environments
   - Environment variables for API keys (Stripe, Jina, etc.)
   - Database migrations on deploy

2. **Build optimization**:
   - Minimize bundle size
   - Code splitting by route
   - Dynamic imports for heavy components
   - Image optimization during build

3. **Caching strategy**:
   - Static generation (ISR) for area pages
   - Cache business listings appropriately
   - CDN caching headers

4. **Error handling & monitoring**:
   - Sentry integration for error tracking
   - Error pages for 404, 500, etc.
   - User-friendly error messages

5. **CI/CD pipeline**:
   - GitHub actions for automated testing and deployment
   - Run tests before merging
   - Automatic deployment on main branch push

Deploy this professionally—no shortcuts.
```

---

## Implementation Order

**Week 1**:
1. Database schema (Prompt 1.1)
2. Authentication system (Prompt 1.2)

**Week 2**:
3. Pillar pages & area pages (Prompt 2.1)
4. Business search (Prompt 2.2)

**Week 3**:
5. Business submission (Prompt 2.3)
6. Schema markup (Prompt 5.1)

**Week 4**:
7. Featured listings (Prompt 3.1)
8. Claim system (Prompt 4.1)

**Week 5**:
9. Badge generator (Prompt 3.2)
10. Coupon codes (Prompt 3.3)

**Week 6**:
11. Design system (Prompt 6.1)
12. Homepage (Prompt 6.2)

**Week 7**:
13. Deployment (Prompt 7.1)
14. Launch, monitoring, iteration

---

## Success Metrics

Track these KPIs post-launch:
- Monthly unique visitors
- Traffic by area (to identify popular neighborhoods)
- Conversion rate: visitors → business claims
- Conversion rate: visitors → featured upgrades
- Average session duration
- Bounce rate
- Featured listing ROI (cost to acquire featured listing customer)
- Backlink acquisition rate (badge program)
- Search ranking improvements (target keywords per area)
- LLM traffic (ChatGPT, Claude, etc.)

---

## Notes

- Always use best practices when implementing—no placeholder code
- Schema markup is non-negotiable for SEO success
- Mobile responsiveness is essential
- Keep user experience simple and intuitive
- Focus on production-ready code from day one
- Test thoroughly before launch
