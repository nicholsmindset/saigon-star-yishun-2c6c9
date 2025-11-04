# Singapore Halal Directory: Wireframes Quick Reference Guide

## 📋 Table: All Pages Overview

| Page | URL | Purpose | Key Elements | User Type |
|------|-----|---------|--------------|-----------|
| **Homepage** | `/` | Entry point, discovery, conversion | Hero, Search, Featured, Stats, CTAs | Everyone |
| **Directory** | `/directory` | Browse all towns | Town Cards, Counts, Search, Filter | User, Tourist |
| **Town Page** | `/directory/[town]` | Programmatic SEO pillar page | Featured Businesses, Area Cards, FAQ, Map | User, Tourist |
| **Area Page** | `/directory/[town]/[area]` | Hyper-local pillar page | All Businesses, Map, FAQ, Nearby Areas | User, Tourist |
| **Business Detail** | `/business/[id]` | Full business info | Images, Map, Reviews, Hours, Call/Directions | Everyone |
| **Dashboard** | `/dashboard` | Business owner hub | My Businesses, Analytics, Featured Status | Business Owner |
| **Featured Upgrade** | `/upgrade/featured` | Monetization page | Pricing, Benefits, Checkout, Testimonials | Business Owner |
| **Success Page** | `/upgrade/success` | Post-payment | Confirmation, Next Steps, Order Details | Business Owner |
| **Badge Generator** | `/badge-generator` | Backlink program | Select Location, Badge Code, Coupon | Business Owner |
| **Admin Dashboard** | `/admin` | Management hub | Claims, Submissions, Coupons, Analytics | Admin |

---

## 🔄 User Flows Diagram

### Flow 1: Regular User Discovery Journey
```
┌─────────────┐
│  Homepage   │
└──────┬──────┘
       │
       ├──► Search by business name
       ├──► Browse by Region/Town
       └──► Featured Carousel
              │
              ▼
      ┌──────────────────┐
      │  Town Page       │
      │ (Ang Mo Kio)     │
      └────────┬─────────┘
               │
               ├──► View All Neighborhoods
               ├──► View Featured Businesses
               └──► Browse Businesses Grid
                      │
                      ▼
            ┌──────────────────────┐
            │  Area Page           │
            │ (Cheng San)          │
            │ - All 18 businesses  │
            │ - Map View           │
            │ - FAQ                │
            └────────┬─────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Business Detail     │
          │  - Photos            │
          │  - Hours             │
          │  - Map/Directions    │
          └────────┬─────────────┘
                   │
                   ├──► Call Business
                   ├──► Visit Website
                   └──► Save to List
```

### Flow 2: Business Owner Claim & Upgrade
```
┌────────────────────────┐
│ Find Own Business      │
│ (via search/browse)    │
└───────────┬────────────┘
            │
            ▼
    ┌──────────────────┐
    │ Business Detail  │
    │ Page             │
    │ [Claim Button]   │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Create Account       │
    │ (Magic Link Auth)    │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Claim Form           │
    │ - Owner Details      │
    │ - Verification Info  │
    │ - Submit for Review  │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Pending (Admin Review)   │
    │ 0-2 Days                 │
    └────────┬─────────────────┘
             │
         ✓ APPROVED
             │
             ▼
    ┌──────────────────────────┐
    │ Dashboard Access         │
    │ - Edit Business Info     │
    │ - View Analytics         │
    └────────┬─────────────────┘
             │
             ├──► Edit Business
             ├──► Upload Logo/Images
             │
             ▼
    ┌──────────────────────────┐
    │ [Upgrade to Featured]    │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Featured Upgrade Page    │
    │ - Show Benefits          │
    │ - Pricing Options        │
    │ - Select Duration        │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Stripe Checkout          │
    │ - Enter Card             │
    │ - Apply Coupon (optional)│
    │ - Pay                    │
    └────────┬─────────────────┘
             │
         ✓ PAYMENT SUCCESS
             │
             ▼
    ┌──────────────────────────┐
    │ Success Page             │
    │ - Confirmation           │
    │ - Upload Photos (8 max)  │
    │ - View Featured Listing  │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Business Now Featured    │
    │ - Top placement on area  │
    │ - page with blue border  │
    │ - Multiple photos        │
    │ - More visibility!       │
    └──────────────────────────┘
```

### Flow 3: Admin Approval Workflow
```
┌─────────────────────┐
│ Admin Dashboard     │
│ Login               │
└────────┬────────────┘
         │
         ├──► Claims Tab (5 pending)
         │         │
         │         ├──► View Claim #1
         │         │    - Owner Details
         │         │    - Business Info
         │         │    [Approve] [Reject]
         │         │
         │         ├──► Approve
         │         │    └─► Email Sent to Owner
         │         │
         │         └──► Reject
         │              └─► Email with Reason
         │
         ├──► Submissions Tab (8 pending)
         │         │
         │         ├──► View Submission #1
         │         │    - Check for duplicates
         │         │    - Verify legitimacy
         │         │    [Approve] [Reject]
         │         │
         │         ├──► Approve
         │         │    ├─► Create area page if new
         │         │    └─► Go live in directory
         │         │
         │         └──► Reject
         │              └─► Email reason
         │
         └──► Coupons Tab
              │
              ├──► Generate New Coupon
              │    - Set discount
              │    - Set max uses
              │    - Set expiry
              │    └─► Create Code (e.g., HALAL2024XYZ)
              │
              └──► View Active Codes
                   - Track usage
                   - Deactivate if needed
```

### Flow 4: Programmatic SEO Page Generation
```
Admin Approves New Business Submission
└──► Check if new area needed
     │
     ├─ YES, NEW AREA ───────────────┐
     │                                │
     └─ NO, AREA EXISTS ────────────┐ │
                                    │ │
                                    ▼ ▼
                         ┌──────────────────────┐
                         │ Create/Update:       │
                         │ - areas table        │
                         │ - businesses table   │
                         │ - Update town counts │
                         └────────┬─────────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ Auto-Generate Pages:   │
                     │                        │
                     │ 1. Town Page (if new)  │
                     │    /directory/town     │
                     │                        │
                     │ 2. Area Page (always)  │
                     │    /directory/town/    │
                     │    area                │
                     │                        │
                     │ 3. Business Detail     │
                     │    /business/id        │
                     │                        │
                     │ 4. Add Schema Markup   │
                     │    - LocalBusiness     │
                     │    - ItemList          │
                     │    - Breadcrumb        │
                     │                        │
                     │ 5. Generate Meta Tags  │
                     │    - Title             │
                     │    - Description       │
                     │    - OG Tags           │
                     └────────┬────────────────┘
                              │
                              ▼
                  ┌──────────────────────────┐
                  │ Pages Now Live & Indexed │
                  │                          │
                  │ Start Ranking For:       │
                  │ - "halal restaurants     │
                  │   [town]"                │
                  │ - "halal food [area]"    │
                  │ - "halal [town] near me" │
                  └──────────────────────────┘
```

---

## 📱 Mobile vs Desktop Layout Changes

### Homepage
```
DESKTOP:
┌─ Hero Search (centered, wide)
├─ Stats in 3 columns
├─ Featured carousel (4 items visible)
├─ Regions in 3x3 grid
└─ FAQ accordion

MOBILE:
┌─ Hero Search (full width)
├─ Stats stacked vertically
├─ Featured carousel (1 item visible, swipeable)
├─ Regions stacked (1 per row)
└─ FAQ accordion (no accordion arrows visible)
```

### Directory Pages (Town/Area)
```
DESKTOP:
┌─ Sidebar with filters
├─ Main content (2/3 width)
├─ Cards in 2x2 grid
└─ Business table with all columns

MOBILE:
┌─ Full-screen content
├─ Filters in collapsible bottom sheet
├─ Cards stacked (single column)
└─ Business list (simplified columns)
```

### Business Detail
```
DESKTOP:
┌─ Left: Image gallery + details (70%)
└─ Right: Info box + CTA + sidebar (30%)

MOBILE:
┌─ Full-width image gallery (swipeable)
├─ Sticky call button at bottom
├─ All details stacked
└─ CTA buttons full-width
```

---

## 🎨 Component Hierarchy & Reusability

```
Base Components
├── Button (variants: primary, secondary, danger)
├── Card (base container)
├── Input (text, email, phone, etc.)
├── Dropdown/Select
├── Modal/Dialog
├── Toast/Alert
└── Loading Spinner

Composite Components
├── BusinessCard
│   ├── Image + Badge
│   ├── Name
│   ├── Type/Cert
│   ├── Rating
│   └── Actions
│
├── LocationCard
│   ├── Name
│   ├── Business Count
│   ├── Thumbnails
│   └── Link
│
├── BusinessListItem
│   ├── Image Thumbnail
│   ├── Name + Type
│   ├── Address + Hours
│   ├── Rating
│   └── CTA Buttons
│
├── FeaturedBanner
│   ├── Large Image
│   ├── Blue Border
│   ├── Featured Badge
│   ├── Business Info
│   └── Photo Gallery
│
└── SearchBar
    ├── Input Field
    ├── Location Filter
    ├── Type Filter
    └── Search Button

Complex Sections
├── Hero Section (homepage)
├── Featured Carousel
├── Business Map
├── FAQ Accordion
├── Reviews/Ratings
└── Image Gallery (swipeable)
```

---

## 📊 Page Breakdown by Complexity

### Simple Pages (Quick to build)
1. **Homepage** - Uses existing components
2. **Success Page** - Minimal components
3. **404/Error Pages** - Basic layout

### Medium Complexity
1. **Directory Page** - Grid of location cards
2. **Featured Upgrade Page** - Pricing table + checkout
3. **Badge Generator** - Multi-step form

### High Complexity
1. **Town Page** - Multiple sections, SEO optimization
2. **Area Page** - Map integration, dynamic content
3. **Business Detail** - Image gallery, reviews, map
4. **Dashboard** - Analytics, forms, real-time updates
5. **Admin Dashboard** - Complex workflows, tables

---

## 🚀 Implementation Order (Recommended)

**Phase 1: Core Pages (Week 1-2)**
1. Homepage
2. Business Detail Page
3. Directory Page (all towns)

**Phase 2: Programmatic SEO (Week 2-3)**
4. Town Page (/directory/[town])
5. Area Page (/directory/[town]/[area])

**Phase 3: Business Features (Week 3-4)**
6. User Dashboard
7. Featured Upgrade Page
8. Success Page

**Phase 4: Additional Features (Week 4-5)**
9. Badge Generator
10. Search/Filter
11. Admin Dashboard

**Phase 5: Polish (Week 5-6)**
12. 404/Error Pages
13. Mobile optimization
14. Performance optimization
15. Testing

---

## 🔍 Key UX Decisions

### 1. Call-to-Action Placement
- **Homepage**: Multiple CTAs (Search, Browse, Claim, Featured)
- **Business Detail**: Sticky call button (top right on desktop, bottom on mobile)
- **Town/Area**: Explore buttons on every section
- **Featured**: Upgrade button in dashboard + business page

### 2. Information Hierarchy
- **Homepage**: Most important first (search, featured)
- **Business Detail**: Photo first, then info, then details
- **Area Page**: Featured businesses above standard

### 3. Mobile Patterns
- Hamburger menu for navigation
- Bottom sheet for filters
- Sticky headers with search
- Swipeable image galleries
- Full-width buttons (minimum 44px tall)

### 4. Accessibility
- All images have alt text
- All form inputs have labels
- Color contrast ≥ 4.5:1
- Keyboard navigation support
- ARIA labels for screen readers

---

## 📐 Responsive Breakpoints & Changes

```
Mobile First Approach:
┌─ 0px - 640px (sm): Phone
│   └─ Single column, stacked
│   └─ Large touch targets (44x44px)
│   └─ Hamburger menu
│   └─ Bottom sheets
│
├─ 640px - 1024px (md): Tablet
│   └─ 2-3 columns
│   └─ Side-by-side layouts start
│   └─ Regular menu appears
│   └─ Larger text sizes
│
└─ 1024px+ (lg): Desktop
    └─ 3-4 columns
    └─ Sidebar layouts
    └─ Full navigation
    └─ Hover states
```

---

## 🎯 Conversion Optimization

### Key Conversion Points:
1. **Search Box** (Homepage) → Directory
2. **Browse Button** (Homepage) → Town Page
3. **Business Card Click** (Directory) → Business Detail
4. **Call Button** (Business Detail) → Phone call
5. **Claim Button** (Business Detail) → Claim Form
6. **Upgrade Button** (Dashboard) → Featured Page
7. **Checkout** (Featured Page) → Payment

### Optimization Tactics:
- Clear CTAs with high contrast colors
- Minimal form fields (3-4 max before submission)
- Social proof (reviews, ratings, "featured" badges)
- Urgency (limited-time coupons, featured benefits)
- Trust signals (verified badges, certification badges)
- Mobile-optimized flows (no unnecessary scrolling)

---

## 📋 Design System Quick Reference

### Colors to Use Everywhere
```
Primary Call-to-Action: #10b981 (Green)
Featured/Special: #3b82f6 (Blue)
Danger/Alert: #ef4444 (Red)
Success: #10b981 (Green)
Text: #1f2937 (Dark Gray)
Secondary Text: #6b7280 (Medium Gray)
Backgrounds: #f3f4f6 (Light Gray)
```

### Typography Scale
```
H1 - 36px Bold (Page Titles)
H2 - 28px Bold (Section Headers)
H3 - 20px Semi-bold (Subsections)
Body - 16px Regular (Main Text)
Small - 14px Regular (Descriptions)
Tiny - 12px Regular (Labels)
```

### Spacing Between Elements
```
Tight: 8px
Normal: 16px
Relaxed: 24px
Loose: 32px
Extra Loose: 48px
```

---

## ✅ QA Checklist for Each Page

- [ ] Page loads in < 2 seconds
- [ ] Mobile responsive (test on phone)
- [ ] All images optimized (< 2MB)
- [ ] Heading hierarchy correct (1 H1 per page)
- [ ] Links have descriptive text (not "click here")
- [ ] Forms have labels on all inputs
- [ ] Color contrast ≥ 4.5:1
- [ ] Buttons are 44x44px minimum
- [ ] Schema markup validates
- [ ] Meta tags are unique and descriptive
- [ ] No typos or grammatical errors
- [ ] Canonical tag present
- [ ] No broken links or images
- [ ] CTA buttons have high contrast
- [ ] Breadcrumbs are clickable
- [ ] Search/filters work properly
- [ ] Map loads and is interactive
- [ ] Images have alt text
- [ ] Forms submit successfully
- [ ] Confirmation messages appear
- [ ] Error states are clear
- [ ] Loading states show spinner

---

## 🎬 Next Steps

1. **Review** all wireframes with stakeholders
2. **Get Approval** before development starts
3. **Create Figma Prototype** (optional, for interactive demo)
4. **Hand Off to Development** (Claude Code)
5. **Build Components** following this structure
6. **Test Mobile** thoroughly
7. **Performance Audit** (Lighthouse)
8. **Launch & Monitor** with analytics

---

## Notes for Development Team

- All pages should use the component library consistently
- Mobile-first development approach
- Use Next.js Image component for optimization
- Implement ISR for programmatic pages (revalidate: 3600)
- Add error boundaries to catch issues
- Use TypeScript for all components
- Test accessibility with axe DevTools
- Monitor Core Web Vitals with PageSpeed Insights

Good luck with the build! 🚀
