# Singapore Halal Directory: Complete Site Wireframes & Architecture

## Table of Contents
1. [User Personas](#user-personas)
2. [User Flows](#user-flows)
3. [Navigation Structure](#navigation-structure)
4. [Page Wireframes](#page-wireframes)
5. [Component Library](#component-library)
6. [Mobile Responsiveness](#mobile-responsiveness)
7. [Admin Dashboard](#admin-dashboard)
8. [Color & Design System](#color--design-system)

---

## User Personas

### Persona 1: Home Chef / Regular User
**Goal**: Find halal restaurants and shops nearby
**Devices**: Mobile-first (80% of traffic)
**Actions**: Search, browse by area, read reviews, call/visit business

### Persona 2: Business Owner
**Goal**: Claim their business, showcase it, attract customers
**Devices**: Desktop + Mobile
**Actions**: Create account, claim business, upload images, upgrade to featured, respond to inquiries

### Persona 3: Directory Admin
**Goal**: Approve businesses, manage featured listings, track metrics
**Devices**: Desktop
**Actions**: Review claims, approve submissions, manage coupons, view analytics

### Persona 4: SG Tourist/New Resident
**Goal**: Discover halal food options in unfamiliar areas
**Devices**: Mobile + Desktop
**Actions**: Search by location, read descriptions, check hours, call ahead

---

## User Flows

### Flow 1: Regular User Discovery → Purchase

```
Entry Point: Google Search / Direct
     ↓
Homepage (Browse / Search)
     ↓
Directory/Town Page (Browse by neighborhood)
     ↓
Directory/Area Page (See all businesses in specific area)
     ↓
Business Detail Page (View full info, images, map, reviews)
     ↓
Action: Call / Visit / Save for Later
     ↓
[Potential: Featured business catches eye → Upgrade page]
```

### Flow 2: Business Owner Claim Process

```
Entry Point: Search for own business
     ↓
Business Detail Page (See own listing)
     ↓
"Claim This Business" Button
     ↓
Create Account (Email signup)
     ↓
Claim Form (Owner details, verification)
     ↓
Submit for Review
     ↓
Admin Approval (0-2 days)
     ↓
Success: Dashboard Access
     ↓
Actions Available:
   - Edit business info
   - Upload images (if featured)
   - View featured status
   - Upgrade to featured
   - Download badge for backlink
```

### Flow 3: Business Owner Upgrade to Featured

```
From: Business Dashboard
     ↓
"Upgrade to Featured" Button
     ↓
Featured Listing Landing Page
   - Show benefits
   - Show pricing options
   - Show comparison (standard vs featured)
     ↓
Select Duration (1 month / 3 months / 6 months)
     ↓
Stripe Checkout
   - Enter card details
   - Apply coupon code (optional)
     ↓
Payment Success
     ↓
Redirect to Success Page
   - Show expiry date
   - Enable image upload (max 8)
   - Display featured status
     ↓
Business now appears at top of area page with blue border + "Featured" badge
```

### Flow 4: Business Submission (Programmatic SEO)

```
Entry Point: "Submit a Business" button (on directory pages or navbar)
     ↓
Business Submission Form
   - Business name
   - Type (Restaurant / Cafe / Butcher / Bakery / Other)
   - Area (dropdown with autocomplete)
   - Address / Postal code
   - Phone
   - Website (optional)
   - Hours
   - Certification type
   - Description
     ↓
Form Validation
   - Check for duplicates
   - Validate postal code format
     ↓
Submit for Admin Review
     ↓
Thank you message + Status tracking
     ↓
Admin Review (in admin dashboard)
   - Approve → Auto-create area page if new → Go live
   - Reject → Send reason via email
```

### Flow 5: Admin Approval Workflow

```
Admin Dashboard Login
     ↓
View Pending:
   - Business Claims (2-5 per week)
   - Business Submissions (5-10 per week)
   - Coupon Code Requests (Badge program)
     ↓
Claims Tab:
   - Review business owner details
   - Verify phone/email if needed
   - Approve → Mark as claimed → Send email confirmation
   - Reject → Send reason to user
     ↓
Submissions Tab:
   - Review new business details
   - Check if duplicate
   - Approve → Create area page if needed → Go live
   - Reject → Send reason to submitter
     ↓
Coupons Tab:
   - Generate coupon codes (batch or single)
   - Track badge program participation
   - Deactivate expired codes
```

### Flow 6: Badge Program (Backlink Strategy)

```
From: Navbar / "Partner With Us" link
     ↓
Partner Landing Page
   - Explain partnership
   - Show benefits
   - CTA: "Generate Your Badge"
     ↓
Badge Generator Page
   - User selects their area
   - Choose option:
     a) HTML embed (for tech-savvy)
     b) Branded anchor text (for non-tech)
     ↓
Badge Code Generated + Preview
   - Show working badge
   - Show HTML code (copy button)
   - Show anchor text template
     ↓
Coupon Code Generated ($29 value / 1 month free featured)
   - Display coupon code
   - Email coupon to user
     ↓
User places badge on their website
   - Links back to their business page on directory
     ↓
Directory gets high-quality backlink from relevant local business
```

---

## Navigation Structure

### Header/Navbar (All Pages)
```
LEFT SIDE:
├── Logo (home link)
└── "Singapore Halal Directory"

CENTER (Desktop only):
├── Home
├── Directory
│   ├── Browse by Region (submenu showing North, East, West, Central, etc.)
│   └── Browse by Town (submenu showing all 28 towns)
├── Partner With Us (badge program)
└── Help / FAQ

RIGHT SIDE:
├── Search Box (across all pages)
│   └── [Search by business name or area]
├── Login / Sign Up (if not logged in)
│   └── "Sign In"
└── Account / Dashboard (if logged in)
    ├── My Business (if business owner)
    ├── My Saved (if regular user)
    └── Admin (if admin)
```

### Mobile Navbar
```
LEFT: Hamburger menu (opens sidebar)
CENTER: Logo
RIGHT: Search icon (opens search modal)

Hamburger Menu Opens:
├── Home
├── Directory
├── Browse Regions
├── Browse Towns
├── Partner With Us
├── Help
├── Sign In / My Account
```

### Footer (All Pages)
```
COLUMN 1: Company
├── About Us
├── Contact
├── Blog
└── Careers

COLUMN 2: Directory
├── Browse All Towns
├── Browse All Regions
├── Recently Added
└── Most Popular

COLUMN 3: For Businesses
├── Claim Your Business
├── Upgrade to Featured
├── Advertise With Us
├── Partner Program
└── Bulk Listings

COLUMN 4: Legal
├── Privacy Policy
├── Terms & Conditions
├── Cookies
└── Disclaimer

BOTTOM:
├── Social Media Links (Facebook, Instagram, LinkedIn)
├── Newsletter Signup
└── Copyright + Last Updated Date
```

---

## Page Wireframes

### PAGE 1: Homepage / Landing Page

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
║  [Logo] Singapore Halal Directory    [Search] [Login]           ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                        HERO SECTION                            ║
║                                                                 ║
║         Discover Singapore's Halal Businesses                  ║
║    Find restaurants, cafes, butchers & shops near you          ║
║                                                                 ║
║    ┌─────────────────────────────────────────────────────────┐ ║
║    │ [Search by business name or area]  [Search Button]      │ ║
║    └─────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║         [Browse Directory] [View Map] [Submit Business]        ║
║                                                                 ║
║        [Hero Image: Halal food scene or map of SG]            ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                    QUICK STATS SECTION                         ║
║                                                                 ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         ║
║  │  X Businesses  │  │ Y Neighborhoods │  │ Z Featured  │        ║
║  │   Verified   │  │   Covered    │  │   Listings  │        ║
║  └──────────────┘  └──────────────┘  └──────────────┘         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              FEATURED BUSINESSES CAROUSEL                      ║
║                                                                 ║
║  Featured in Your Area                                         ║
║                                                                 ║
║  ◄  [Business Card] [Business Card] [Business Card]  ►         ║
║     [Image]         [Image]         [Image]                    ║
║     [Name]          [Name]          [Name]                     ║
║     [Type/Cert]     [Type/Cert]     [Type/Cert]                ║
║     [Rating]        [Rating]        [Rating]                   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                 BROWSE BY REGION SECTION                       ║
║                                                                 ║
║  Browse Halal Businesses by Region                             ║
║                                                                 ║
║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   ║
║  │   NORTH    │ │   EAST     │ │   WEST     │ │ CENTRAL    │   ║
║  │ X Towns    │ │ X Towns    │ │ X Towns    │ │ X Areas    │   ║
║  │ X Businesses│ │ X Businesses│ │ X Businesses│ │ X Businesses│   ║
║  └────────────┘ └────────────┘ └────────────┘ └────────────┘   ║
║                                                                 ║
║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   ║
║  │NORTHEAST   │ │N-CENTRAL   │ │SOUTHEAST   │ │SOUTHWEST   │   ║
║  │ X Towns    │ │ X Towns    │ │ X Towns    │ │ X Towns    │   ║
║  │ X Businesses│ │ X Businesses│ │ X Businesses│ │ X Businesses│   ║
║  └────────────┘ └────────────┘ └────────────┘ └────────────┘   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                 HOW IT WORKS SECTION                           ║
║                                                                 ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         ║
║  │     [1]      │  │     [2]      │  │     [3]      │         ║
║  │   Search     │  │   Browse     │  │   Connect    │         ║
║  │ Find halal   │  │ Explore all  │  │ Call or      │         ║
║  │ businesses   │  │ options in   │  │ visit your   │         ║
║  │ by area      │  │ your area    │  │ choice       │         ║
║  └──────────────┘  └──────────────┘  └──────────────┘         ║
║                                                                 ║
║  ┌──────────────┐  ┌──────────────┐                            ║
║  │     [4]      │  │     [5]      │                            ║
║  │   Claim      │  │   Feature    │                            ║
║  │ Business     │  │ Showcase     │                            ║
║  │ owners claim │  │ your business│                            ║
║  │ listings     │  │ to stand out │                            ║
║  └──────────────┘  └──────────────┘                            ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║               FOR BUSINESS OWNERS SECTION                      ║
║                                                                 ║
║  Are You a Business Owner?                                     ║
║                                                                 ║
║  Get More Customers. Claim your business today.                ║
║                                                                 ║
║  [Claim Your Business Button]  [Learn More]                    ║
║                                                                 ║
║  ✓ Manage your business info        ✓ Showcase images          ║
║  ✓ Appear in local search results   ✓ Upgrade to featured      ║
║  ✓ Free & easy to claim             ✓ Drive more foot traffic  ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                  RECENT ADDITIONS SECTION                      ║
║                                                                 ║
║  Recently Added Businesses                                     ║
║                                                                 ║
║  [Business Card] [Business Card] [Business Card] [Business Card]║
║  [Business Card] [Business Card] [Business Card] [Business Card]║
║                                                                 ║
║                     [View All Recent]                          ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                     FAQ SECTION                                ║
║                                                                 ║
║  Frequently Asked Questions                                    ║
║                                                                 ║
║  ▼ How do I find halal restaurants near me?                    ║
║    └─ Use the search box above or browse by region...         ║
║                                                                 ║
║  ► Are all businesses in this directory certified halal?       ║
║  ► Can I claim my business?                                    ║
║  ► How do featured listings work?                              ║
║  ► What certifications do you recognize?                       ║
║  ► How do I submit a business that's not listed?               ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
║  Company | Directory | For Business | Legal | Social Media     ║
║                  © 2024 Singapore Halal Directory               ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 2: Directory / All Towns

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                    BREADCRUMB NAVIGATION                       ║
║  Home > Directory                                              ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      PAGE HEADER                               ║
║                                                                 ║
║  Halal Directory by Town                                       ║
║  Browse all X towns across Singapore. Each town has hundreds   ║
║  of verified halal restaurants, cafes, and shops.              ║
║                                                                 ║
║  [Filter/Search by town name]                                  ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                    TOWN CARDS GRID (2x4 per row)               ║
║                                                                 ║
║  ┌──────────────────────┐  ┌──────────────────────┐            ║
║  │  Ang Mo Kio          │  │  Bedok               │            ║
║  │  12 Areas            │  │  8 Areas             │            ║
║  │  247 Businesses      │  │  189 Businesses      │            ║
║  │  [Click to browse]   │  │  [Click to browse]   │            ║
║  └──────────────────────┘  └──────────────────────┘            ║
║                                                                 ║
║  ┌──────────────────────┐  ┌──────────────────────┐            ║
║  │  Bishan              │  │  Bukit Batok         │            ║
║  │  3 Areas             │  │  9 Areas             │            ║
║  │  156 Businesses      │  │  134 Businesses      │            ║
║  └──────────────────────┘  └──────────────────────┘            ║
║                                                                 ║
║  [... more town cards ...]                                     ║
║                                                                 ║
║  ┌──────────────────────┐  ┌──────────────────────┐            ║
║  │  Woodlands           │  │  Yishun              │            ║
║  │  9 Areas             │  │  8 Areas             │            ║
║  │  201 Businesses      │  │  178 Businesses      │            ║
║  └──────────────────────┘  └──────────────────────┘            ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 3: Town Page (Ang Mo Kio Example)

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                    BREADCRUMB NAVIGATION                       ║
║  Home > Directory > Ang Mo Kio                                 ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      PAGE HERO                                 ║
║                                                                 ║
║  Halal Restaurants & Businesses in Ang Mo Kio                  ║
║  Discover 247 verified halal dining and shopping options       ║
║                                                                 ║
║  Last updated: [Date]                                          ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              FEATURED BUSINESSES SECTION                       ║
║                                                                 ║
║  Featured Businesses in Ang Mo Kio                             ║
║                                                                 ║
║  ┌─────────────────────┐  ┌─────────────────────┐              ║
║  │ [Image - Featured]  │  │ [Image - Featured]  │              ║
║  │ ★ FEATURED ★        │  │ ★ FEATURED ★        │              ║
║  │ Business Name 1     │  │ Business Name 2     │              ║
║  │ Restaurant Type     │  │ Cafe Type           │              ║
║  │ MUIS Certified      │  │ MUIS Certified      │              ║
║  │ ★★★★★ (47 reviews) │  │ ★★★★☆ (32 reviews) │              ║
║  │ [View Details]      │  │ [View Details]      │              ║
║  └─────────────────────┘  └─────────────────────┘              ║
║                                                                 ║
║  ┌─────────────────────┐  ┌─────────────────────┐              ║
║  │ [Image - Featured]  │  │ [Image - Featured]  │              ║
║  │ ★ FEATURED ★        │  │ ★ FEATURED ★        │              ║
║  │ Business Name 3     │  │ Business Name 4     │              ║
║  │ Butcher Type        │  │ Bakery Type         │              ║
║  │ MUIS Certified      │  │ ISCED Certified     │              ║
║  │ ★★★★★ (61 reviews) │  │ ★★★★★ (28 reviews) │              ║
║  │ [View Details]      │  │ [View Details]      │              ║
║  └─────────────────────┘  └─────────────────────┘              ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║          BROWSE NEIGHBORHOODS IN ANG MO KIO                    ║
║                                                                 ║
║  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   ║
║  │ Ang Mo Kio     │  │ Cheng San      │  │ Chong Boon     │   ║
║  │ Town Centre    │  │                │  │                │   ║
║  │ 23 Businesses │  │ 18 Businesses │  │ 22 Businesses │   ║
║  │ [Browse]      │  │ [Browse]       │  │ [Browse]       │   ║
║  └────────────────┘  └────────────────┘  └────────────────┘   ║
║                                                                 ║
║  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   ║
║  │ Kebun Bahru    │  │ Sembawang      │  │ Shangri-La     │   ║
║  │                │  │ Hills          │  │                │   ║
║  │ 15 Businesses │  │ 19 Businesses │  │ 14 Businesses │   ║
║  │ [Browse]      │  │ [Browse]       │  │ [Browse]       │   ║
║  └────────────────┘  └────────────────┘  └────────────────┘   ║
║                                                                 ║
║  [... More neighborhood cards ...]                             ║
║                                                                 ║
║  Total: 12 neighborhoods in Ang Mo Kio                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              ALL BUSINESSES IN ANG MO KIO                      ║
║                                                                 ║
║  Viewing 247 Businesses  [Sort: Featured First ▼]              ║
║  [Filter by Type ▼] [Filter by Certification ▼] [Search]       ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Restaurant 1 - Name          | Ang Mo Kio Town Centre │   ║
║  │ Restaurant | MUIS Cert       | Rating: ★★★★★ (47)    │   ║
║  │ (02) 1234 5678               | [View Details] [Map]   │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Cafe 1 - Name                | Cheng San              │   ║
║  │ Cafe | MUIS Cert             | Rating: ★★★★☆ (32)    │   ║
║  │ (02) 2345 6789               | [View Details] [Map]   │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  [... More business listings ...]                              ║
║                                                                 ║
║  [Load More] or [Pagination: 1 2 3 4 5 ... Next]               ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              FAQ - ANG MO KIO HALAL GUIDE                      ║
║                                                                 ║
║  ▼ What halal certifications do Ang Mo Kio businesses have?   ║
║    └─ Most are MUIS certified. Some are ISCED. All verified.  ║
║                                                                 ║
║  ► What types of cuisine are available in Ang Mo Kio?         ║
║  ► Where can I find halal food courts in Ang Mo Kio?          ║
║  ► Are there halal butchers in Ang Mo Kio?                    ║
║  ► Can I claim a business in Ang Mo Kio?                      ║
║  ► How do I report an incorrect listing?                      ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              INTERNAL LINKING SECTION                          ║
║                                                                 ║
║  Related Areas:                                                ║
║  [Bukit Merah] [Bishan] [Toa Payoh]                            ║
║                                                                 ║
║  Browse Other Towns:                                           ║
║  [Bedok] [Bukit Batok] [Central Area] [Clementi] ...           ║
║                                                                 ║
║  Region Guide: [North Region Halal Directory]                  ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 4: Area/Neighborhood Page (Cheng San Example)

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                    BREADCRUMB NAVIGATION                       ║
║  Home > Directory > Ang Mo Kio > Cheng San                     ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      PAGE HERO                                 ║
║                                                                 ║
║  Halal Restaurants in Cheng San, Ang Mo Kio                    ║
║  Browse 18 verified halal businesses in this neighborhood      ║
║                                                                 ║
║  📍 Near: Ang Mo Kio MRT Station                               ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              FEATURED LISTINGS (if any)                        ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ ★ FEATURED ★                                           │   ║
║  │ [Large Image with Blue Border]                         │   ║
║  │ Business Name - Type - Certification                   │   ║
║  │ ★★★★★ (47 reviews)                                     │   ║
║  │ "This is the best halal restaurant in the area!"       │   ║
║  │ [View Photos] [Call] [Directions] [More Info]          │   ║
║  └────────────────────────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║            ALL BUSINESSES IN CHENG SAN                         ║
║                                                                 ║
║  [Search within this area] [Sort: Featured First ▼]            ║
║  [Filter by Type] [Filter by Certification]                    ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ [Image] Restaurant Name                                │   ║
║  │         Restaurant | MUIS Certified                    │   ║
║  │         Address: 123 Cheng San Lane #01-02             │   ║
║  │         Postal: 560123                                 │   ║
║  │         Phone: (02) 1234 5678                          │   ║
║  │         Hours: Mon-Sun 10AM - 10PM                     │   ║
║  │         ★★★★★ (47 reviews)                             │   ║
║  │         [View Full Details] [Map] [Call]               │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ [Image] Cafe Name                                      │   ║
║  │         Cafe | MUIS Certified                          │   ║
║  │         Address: 45 Cheng San Rise #03-15              │   ║
║  │         Postal: 560134                                 │   ║
║  │         Phone: (02) 2345 6789                          │   ║
║  │         Hours: Mon-Sun 8AM - 6PM (Closed Wednesdays)   │   ║
║  │         ★★★★☆ (32 reviews)                             │   ║
║  │         [View Full Details] [Map] [Call]               │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  [... More business listings ...]                              ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      LOCATION MAP                              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │                                                          │  ║
║  │    [Map showing all businesses as pins/markers]         │  ║
║  │                                                          │  ║
║  │    Red pin = Standard listing                           │  ║
║  │    Blue pin = Featured listing                          │  ║
║  │    Green pin = Your location                            │  ║
║  │                                                          │  ║
║  │    [Click pin to see business details]                  │  ║
║  │                                                          │  ║
║  └──────────────────────────────────────────────────────────┘  ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║        AREA INFO & NEARBY AMENITIES                            ║
║                                                                 ║
║  Location Details:                                             ║
║  └─ Neighborhood: Cheng San, Ang Mo Kio                        ║
║  └─ Postal Codes: 560000 - 569999                              ║
║  └─ Nearby MRT: Ang Mo Kio Station (500m away)                 ║
║  └─ Total Businesses: 18                                       ║
║  └─ Featured Businesses: 2                                     ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║        FAQ - HALAL DINING IN CHENG SAN                         ║
║                                                                 ║
║  ▼ What halal restaurants are near Cheng San MRT?             ║
║    └─ Several options including [business names]...           ║
║                                                                 ║
║  ► Are there halal food courts in Cheng San?                  ║
║  ► Can I find halal butchers in Cheng San?                    ║
║  ► What's the best halal brunch spot in Cheng San?            ║
║  ► Are all businesses in this area MUIS certified?            ║
║  ► How do I report an incorrect listing?                      ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║        OTHER AREAS IN ANG MO KIO                               ║
║                                                                 ║
║  [Ang Mo Kio Town Centre] [Chong Boon] [Kebun Bahru]           ║
║  [Sembawang Hills] [Shangri-La] [Tagore]                       ║
║  [Townsville] [Yio Chu Kang] [Yio Chu Kang East]               ║
║  [Yio Chu Kang North] [Yio Chu Kang West]                      ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 5: Business Detail Page

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                    BREADCRUMB NAVIGATION                       ║
║  Home > Directory > Ang Mo Kio > Cheng San > Business Name     ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                   BUSINESS HEADER SECTION                      ║
║                                                                 ║
║  [Large Hero Image or Image Gallery]                           ║
║                                                                 ║
║  Business Name                                                 ║
║  Restaurant | MUIS Certified                                   ║
║  ★★★★★ 4.8/5 (47 Reviews)                                      ║
║                                                                 ║
║  [Call: (02) 1234 5678] [Directions] [Website] [Share]         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                   TWO-COLUMN LAYOUT BELOW                      ║
║                                                                 ║
║  LEFT COLUMN (70%):                                            ║
║  ──────────────────                                            ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ ABOUT THIS BUSINESS                          │              ║
║  │                                              │              ║
║  │ Description: This restaurant serves         │              ║
║  │ authentic Malay halal cuisine...             │              ║
║  │                                              │              ║
║  │ Type: Restaurant                            │              ║
║  │ Cuisine: Malay, Fusion                      │              ║
║  │ Certification: MUIS (ID: XXXX)              │              ║
║  │ Price Range: $$                             │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ PHOTOS (Gallery view or carousel)            │              ║
║  │ [Image] [Image] [Image] [Image] [Image]      │              ║
║  │ [Image] [Image] [Image] [View All Photos]    │              ║
║  │                                              │              ║
║  │ (For featured listings: up to 8 images)     │              ║
║  │ (For standard listings: 1-2 images)         │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ LOCATION & HOURS                            │              ║
║  │                                              │              ║
║  │ Address: 123 Cheng San Lane #01-02          │              ║
║  │ Postal Code: 560123                         │              ║
║  │ Area: Cheng San, Ang Mo Kio                 │              ║
║  │                                              │              ║
║  │ Hours:                                      │              ║
║  │ Monday - Friday: 10:00 AM - 10:00 PM        │              ║
║  │ Saturday: 10:00 AM - 11:00 PM               │              ║
║  │ Sunday: 10:00 AM - 9:00 PM                  │              ║
║  │ (Closed: Wednesdays)                        │              ║
║  │                                              │              ║
║  │ [View on Map] [Get Directions] [Add to      │              ║
║  │  Calendar]                                  │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ CONTACT INFORMATION                         │              ║
║  │                                              │              ║
║  │ Phone: (02) 1234 5678                       │              ║
║  │ Website: www.businessname.com.sg            │              ║
║  │ Email: contact@businessname.com.sg          │              ║
║  │                                              │              ║
║  │ [Call] [Email] [Visit Website]              │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ REVIEWS & RATINGS                           │              ║
║  │                                              │              ║
║  │ Overall Rating: ★★★★★ 4.8/5 (47 Reviews)    │              ║
║  │                                              │              ║
║  │ "Great food and friendly staff!" - John     │              ║
║  │ ★★★★★ "Highly recommended!" - Jane         │              ║
║  │ ★★★★☆ "Good, but a bit pricey" - Ahmed      │              ║
║  │                                              │              ║
║  │ [View All Reviews] [Write a Review]         │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ MAP VIEW                                    │              ║
║  │ ┌────────────────────────────────────────┐   │              ║
║  │ │   [Embedded Map with Business Pin]     │   │              ║
║  │ │   [Zoom + Pan Controls]                │   │              ║
║  │ │   [Street View Option]                 │   │              ║
║  │ └────────────────────────────────────────┘   │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ MENU & PRICING (if available)               │              ║
║  │                                              │              ║
║  │ Signature Dishes: Rendang, Satay, Nasi...   │              ║
║  │ Average Price: $10-20 per person            │              ║
║  │                                              │              ║
║  │ [View Full Menu]                            │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║                                                                 ║
║  RIGHT COLUMN (30%):                                           ║
║  ──────────────────                                            ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ QUICK ACTIONS                               │              ║
║  │                                              │              ║
║  │ [Call Now Button - Large, Green]            │              ║
║  │ [Get Directions Button]                     │              ║
║  │ [Save / Add to List]                        │              ║
║  │ [Share with Friends]                        │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ BUSINESS STATUS                             │              ║
║  │                                              │              ║
║  │ ✓ Verified Business                         │              ║
║  │ ✓ MUIS Certified                            │              ║
║  │ ✓ Claimed by Owner                          │              ║
║  │                                              │              ║
║  │ Claimed by: Business Name Pte Ltd           │              ║
║  │ Last Updated: 2 days ago                    │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ CLAIMS & UPGRADES (if not claimed)          │              ║
║  │                                              │              ║
║  │ ► [Claim This Business]                     │              ║
║  │   (Add hours, images, and more!)            │              ║
║  │                                              │              ║
║  │ ► [Upgrade to Featured]                     │              ║
║  │   (Get 8 images, top placement)             │              ║
║  │                                              │              ║
║  │ ► [Report Incorrect Info]                   │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ NEARBY BUSINESSES                           │              ║
║  │                                              │              ║
║  │ Other halal restaurants in this area:       │              ║
║  │ • [Business 1] (200m away)                  │              ║
║  │ • [Business 2] (350m away)                  │              ║
║  │ • [Business 3] (400m away)                  │              ║
║  │                                              │              ║
║  │ [View All Nearby Businesses]                │              ║
║  └──────────────────────────────────────────────┘              ║
║                                                                 ║
║  ┌──────────────────────────────────────────────┐              ║
║  │ SHARE THIS BUSINESS                         │              ║
║  │                                              │              ║
║  │ [Share on Facebook]                         │              ║
║  │ [Share on WhatsApp]                         │              ║
║  │ [Share on Twitter]                          │              ║
║  │ [Copy Link]                                 │              ║
║  └──────────────────────────────────────────────┘              ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 6: User Dashboard (Claimed Business Owner)

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
║  [Logo] Directory    [My Dashboard] [Profile ▼] [Logout]       ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                   DASHBOARD SIDEBAR (Left)                    ║
║                                                                 ║
║  Business Dashboard                                            ║
║                                                                 ║
║  ┌─ My Businesses                                             ║
║  ├─ Featured Listings                                         ║
║  ├─ Performance                                               ║
║  ├─ Account Settings                                          ║
║  └─ Help & Support                                            ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              MAIN DASHBOARD AREA (Right)                       ║
║                                                                 ║
║  Welcome Back, [Business Owner Name]!                          ║
║                                                                 ║
║  ┌────────────────────┬────────────────────┬─────────────────┐ ║
║  │ Profile Views      │ Profile Clicks     │ Phone Calls     │ ║
║  │      234           │       156          │       45        │ ║
║  │    (This Month)    │    (This Month)    │  (This Month)   │ ║
║  └────────────────────┴────────────────────┴─────────────────┘ ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ MY BUSINESSES                                          │   ║
║  │                                                        │   ║
║  │ ✓ Business Name 1 (Claimed)                           │   ║
║  │   Restaurant | Ang Mo Kio | MUIS Certified            │   ║
║  │   ★ FEATURED - Expires in 15 days                     │   ║
║  │   Views: 234  |  Clicks: 156  |  Calls: 45            │   ║
║  │   [Edit] [Upgrade Featured] [View Public Page]        │   ║
║  │                                                        │   ║
║  │ ✓ Business Name 2 (Claimed)                           │   ║
║  │   Cafe | Cheng San | MUIS Certified                   │   ║
║  │   Standard Listing (Not Featured)                     │   ║
║  │   Views: 123  |  Clicks: 67   |  Calls: 12            │   ║
║  │   [Edit] [Upgrade to Featured] [View Public Page]     │   ║
║  │                                                        │   ║
║  │ [Claim Another Business] [Submit New Business]        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ RECENT ACTIVITY                                        │   ║
║  │                                                        │   ║
║  │ • 3 days ago - Featured listing renewed (auto)        │   ║
║  │ • 1 week ago - New review posted (4-star)             │   ║
║  │ • 2 weeks ago - Profile photo updated                 │   ║
║  │ • 1 month ago - Featured listing purchased            │   ║
║  │                                                        │   ║
║  │ [View All Activity]                                   │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ FEATURED LISTINGS STATUS                              │   ║
║  │                                                        │   ║
║  │ Business 1: ★ FEATURED                                │   ║
║  │ Status: ACTIVE - Expires in 15 days                   │   ║
║  │ Price Plan: 3 months ($75)                            │   ║
║  │ [Upload Images] [Manage] [Renew] [View Details]       │   ║
║  │                                                        │   ║
║  │ Business 2: Not Featured                              │   ║
║  │ Ready to stand out? [Upgrade to Featured]             │   ║
║  │ Starting at $29/month                                 │   ║
║  │                                                        │   ║
║  │ [View All Featured Businesses]                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 7: Featured Listing Upgrade Page

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      PAGE HERO                                 ║
║                                                                 ║
║  Get More Customers with Featured Listings                    ║
║  Stand out in search results and get found by more customers  ║
║                                                                 ║
║  ✓ Top placement  ✓ 8 Photos  ✓ Blue border  ✓ Featured badge ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              BENEFITS COMPARISON TABLE                         ║
║                                                                 ║
║              Standard Listing    Featured Listing              ║
║  ─────────────────────────────────────────────────────────     ║
║  Placement         Bottom            Top (Above others) ✓       ║
║  Photos            1                 Up to 8 ✓                  ║
║  Badge             None              "Featured" badge ✓         ║
║  Border            None              Blue border ✓              ║
║  Promotion         Basic             Enhanced ✓                 ║
║  Click Priority    Lower             Higher ✓                   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              PRICING OPTIONS (3 columns)                       ║
║                                                                 ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ ║
║  │  1 MONTH        │  │  3 MONTHS       │  │  6 MONTHS       │ ║
║  │                 │  │  (POPULAR)      │  │                 │ ║
║  │   $29           │  │   $75           │  │   $140          │ ║
║  │   per month     │  │   per month     │  │   per month     │ ║
║  │                 │  │                 │  │                 │ ║
║  │   ✓ Featured    │  │   ✓ Featured    │  │   ✓ Featured    │ ║
║  │   ✓ 8 Images   │  │   ✓ 8 Images   │  │   ✓ 8 Images   │ ║
║  │                 │  │   ✓ Save $12    │  │   ✓ Save $34    │ ║
║  │                 │  │                 │  │                 │ ║
║  │  [Select]       │  │  [Select] ◄─┐   │  │  [Select]       │ ║
║  │                 │  │    BEST    │   │  │                 │ ║
║  │                 │  │    VALUE   │   │  │                 │ ║
║  └─────────────────┘  └─────────────────┘  └─────────────────┘ ║
║                                                                 ║
║  Have a coupon code? [Apply Coupon]                            ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              BUSINESS PREVIEW (Left)                           ║
║                                                                 ║
║  How Your Business Will Look When Featured:                    ║
║                                                                 ║
║  ┌──────────────────────────────────────────┐                 ║
║  │ ★ FEATURED ★  [Blue Border]              │                 ║
║  │ [Large Featured Image]                   │                 ║
║  │ Business Name                            │                 ║
║  │ Type | Certification                     │                 ║
║  │ ★★★★★ (47 reviews)                       │                 ║
║  │ [View 8 Photos] [Call] [Directions]      │                 ║
║  └──────────────────────────────────────────┘                 ║
║                                                                 ║
║  Your business stands out! 👆                                  ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              CHECKOUT (Right)                                  ║
║                                                                 ║
║  Order Summary:                                                ║
║  ─────────────────────                                         ║
║                                                                 ║
║  Business: Business Name                                       ║
║  Plan: 3 Months Featured                                       ║
║  Price: $75.00                                                 ║
║  Discount (SAVE12): -$12.00                                    ║
║  ─────────────────────                                         ║
║  TOTAL: $63.00                                                 ║
║                                                                 ║
║  Billing Details:                                              ║
║  Name: [Pre-filled]                                            ║
║  Email: [Pre-filled]                                           ║
║  Phone: [Pre-filled]                                           ║
║                                                                 ║
║  Payment Method:                                               ║
║  ☑ Credit/Debit Card                                           ║
║  ☐ PayPal (if available)                                       ║
║                                                                 ║
║  [Proceed to Payment] or [Continue Shopping]                   ║
║                                                                 ║
║  Secured by Stripe ✓                                           ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              TESTIMONIALS SECTION                              ║
║                                                                 ║
║  Featured Business Owners Say:                                 ║
║                                                                 ║
║  "Featured listing helped us get 3x more calls!"              ║
║  - Restaurant Owner, Bedok                                    ║
║                                                                 ║
║  "Best investment for our cafe. Highly recommend!"             ║
║  - Cafe Owner, Central Area                                   ║
║                                                                 ║
║  "Our revenue increased significantly in the first month."     ║
║  - Butcher Shop Owner, Ang Mo Kio                             ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 8: Payment Success Page

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                   SUCCESS CONFIRMATION                         ║
║                                                                 ║
║                         ✓ SUCCESS!                             ║
║                                                                 ║
║              Your payment has been processed.                  ║
║        Your business is now featured for 3 months!             ║
║                                                                 ║
║  Thank you for upgrading your listing!                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              NEXT STEPS                                        ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 1. UPLOAD PHOTOS                                     │   ║
║  │    You can now upload up to 8 photos of your        │   ║
║  │    business! Showcase your best dishes, ambiance,   │   ║
║  │    and team.                                        │   ║
║  │                                                      │   ║
║  │    [Upload Photos Now] or [Do This Later]           │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 2. VIEW YOUR FEATURED LISTING                        │   ║
║  │    See how your business looks to customers!        │   ║
║  │                                                      │   ║
║  │    [View My Featured Business]                       │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 3. BACK TO DASHBOARD                                │   ║
║  │    Track your views, clicks, and calls.             │   ║
║  │                                                      │   ║
║  │    [Go to Dashboard]                                 │   ║
║  └──────────────────────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              ORDER DETAILS                                     ║
║                                                                 ║
║  Order ID: #123456789                                         ║
║  Date: January 15, 2025                                       ║
║  Amount: $63.00 (after discount)                              ║
║                                                                 ║
║  Business: Business Name                                      ║
║  Plan: 3 Months Featured                                      ║
║  Expires: April 15, 2025                                      ║
║                                                                 ║
║  Payment Method: Visa ending in 4242                          ║
║  Invoice: [Download PDF]                                      ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              CONFIRMATION EMAIL SENT                           ║
║                                                                 ║
║  A confirmation email has been sent to:                        ║
║  owner@businessemail.com                                       ║
║                                                                 ║
║  [Didn't receive? Resend Email]                                ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

### PAGE 9: Badge Generator Page

```
╔════════════════════════════════════════════════════════════════╗
║                         HEADER / NAVBAR                         ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              BADGE GENERATOR HERO                              ║
║                                                                 ║
║  Get a Free Month of Featured Listing                          ║
║  with Your Custom Halal Badge                                  ║
║                                                                 ║
║  Display our badge on your website. Link back to your          ║
║  featured business page. Get 1 month of featured listings       ║
║  ($29 value) completely free!                                  ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              STEP 1: SELECT YOUR LOCATION                      ║
║                                                                 ║
║  Which area is your business in?                               ║
║                                                                 ║
║  [Dropdown: Select Town ▼]                                     ║
║  └─ Ang Mo Kio / Bedok / Bishan / ...                          ║
║                                                                 ║
║  [Dropdown: Select Neighborhood ▼]                             ║
║  └─ Cheng San / Ang Mo Kio Town Centre / ...                   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              STEP 2: CHOOSE YOUR BADGE OPTION                  ║
║                                                                 ║
║  ┌────────────────────────────────────────┐                   ║
║  │ OPTION A: HTML BADGE (For Tech-Savvy)  │                   ║
║  │                                        │                   ║
║  │ Copy & paste this code into your       │                   ║
║  │ website. The badge will automatically  │                   ║
║  │ link back to your business page.       │                   ║
║  │                                        │                   ║
║  │ [HTML Code Box - Copy Button]          │                   ║
║  │                                        │                   ║
║  │ ┌────────────────────────────────────┐ │                   ║
║  │ │ <iframe src="..."></iframe>        │ │                   ║
║  │ │ [Copy]                             │ │                   ║
║  │ └────────────────────────────────────┘ │                   ║
║  │                                        │                   ║
║  │ Preview:                               │                   ║
║  │ ┌────────────────────────────────────┐ │                   ║
║  │ │ [Badge Preview Showing Here]       │ │                   ║
║  │ │ "Featured on Singapore Halal       │ │                   ║
║  │ │  Directory - Cheng San"            │ │                   ║
║  │ └────────────────────────────────────┘ │                   ║
║  └────────────────────────────────────────┘                   ║
║                                                                 ║
║  ┌────────────────────────────────────────┐                   ║
║  │ OPTION B: ANCHOR TEXT (Non-Technical)  │                   ║
║  │                                        │                   ║
║  │ Add this link to your website or       │                   ║
║  │ email it to us. We'll send you the     │                   ║
║  │ coupon code once we verify it.         │                   ║
║  │                                        │                   ║
║  │ Anchor Text:                           │                   ║
║  │ "Featured on Singapore Halal Directory"│                   ║
║  │                                        │                   ║
║  │ Link to:                               │                   ║
║  │ https://yourlistingpage.com            │                   ║ 
║  │                                        │                   ║
║  │ [Email Template - Copy]                │                   ║
║  │                                        │                   ║
║  │ Email to: partnerships@halaldirectory  │                   ║
║  └────────────────────────────────────────┘                   ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              YOUR COUPON CODE                                  ║
║                                                                 ║
║  ✓ You're all set!                                             ║
║                                                                 ║
║  Coupon Code: HALAL2024XYZ                                     ║
║  Value: $29 (1 Month Free Featured Listing)                   ║
║  Valid Until: February 15, 2025                               ║
║                                                                 ║
║  ┌────────────────────────────────────┐                       ║
║  │ HALAL2024XYZ                [Copy] │                       ║
║  └────────────────────────────────────┘                       ║
║                                                                 ║
║  We've also sent this to your email:                           ║
║  your@email.com                                                ║
║                                                                 ║
║  [Didn't receive? Resend Email]                                ║
║                                                                 ║
║  Next Step: [Upgrade to Featured & Apply Coupon]              ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║              HOW IT WORKS                                      ║
║                                                                 ║
║  1. Display the badge on your website                          ║
║  2. It links back to your featured business page               ║
║  3. We get a backlink from a relevant halal business           ║
║  4. You get 1 month of free featured listing ($29 value)       ║
║  5. More customers see your business!                          ║
║                                                                 ║
║  It's a win-win. Get started today!                            ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║                      FOOTER                                    ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Component Library

### Reusable Components

**1. Business Card Component**
```
├── Image (with overlay for featured badge)
├── Featured Badge (optional - blue background)
├── Business Name (linked to detail page)
├── Type + Certification (badges)
├── Rating (stars + count)
├── Address (short version)
├── Quick Actions (Call, Map, Save)
└── Hover State (shows more details)
```

**2. Location Card Component**
```
├── Location Name (town or area)
├── Business Count (e.g., "247 businesses")
├── Featured Count (e.g., "12 featured")
├── Thumbnail Images (3-4 businesses)
├── Link to Browse (clickable card)
└── Hover Animation (slight zoom)
```

**3. FAQ Accordion Component**
```
├── Question (clickable to expand)
├── Answer (slides down when expanded)
├── Icons (arrow showing expand/collapse)
├── Smooth Animation
└── Mobile Optimized (full width)
```

**4. Rating Component**
```
├── Star Rating (1-5 stars, filled/empty)
├── Numeric Rating (e.g., "4.8")
├── Review Count (e.g., "(47 reviews)")
└── Link to Reviews (optional)
```

**5. Breadcrumb Component**
```
├── Home (always first)
├── Parent Pages (linked)
├── Current Page (text, no link)
├── Separators (> symbols)
└── Responsive (collapses on mobile)
```

**6. Search/Filter Component**
```
├── Search Input (text)
├── Type Filter (dropdown)
├── Certification Filter (dropdown)
├── Location Filter (dropdown)
├── Clear All Filters (button)
└── Results Count (dynamic)
```

**7. Pagination Component**
```
├── Previous Button
├── Page Numbers (1, 2, 3... with current highlighted)
├── Next Button
├── Jump to Page (optional input)
└── Results Per Page (dropdown)
```

**8. Business Hours Component**
```
├── Day of Week
├── Open/Close Times
├── Open/Closed Status (with color coding)
├── Special Hours (holidays)
└── Display Format (12-hour or 24-hour)
```

---

## Mobile Responsiveness

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-Specific Changes

**Homepage**
- Hero search simplified
- Carousel instead of grid for featured
- Stacked sections (single column)
- Larger tap targets (minimum 44x44px)

**Directory Pages**
- Full-width business cards
- Collapsible filters
- Sticky header with search
- Bottom sheet for sorting/filtering

**Business Detail**
- Image gallery (swipeable)
- Map below content (not side-by-side)
- Sticky call button (always visible)
- Stacked layout

**Navigation**
- Hamburger menu (mobile only)
- Bottom tab bar (optional, for key sections)
- Simplified footer menu

---

## Admin Dashboard

```
╔════════════════════════════════════════════════════════════════╗
║                    ADMIN DASHBOARD                             ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────┐     ║
║  │ NAVIGATION SIDEBAR                                   │     ║
║  │                                                      │     ║
║  │ ▼ Dashboard                                          │     ║
║  │ ├─ Overview                                          │     ║
║  │ ├─ Analytics                                         │     ║
║  │ ├─ Quick Stats                                       │     ║
║  │                                                      │     ║
║  │ ► Business Management                                │     ║
║  │ ├─ Pending Claims (5 new)                            │     ║
║  │ ├─ Pending Submissions (8 new)                       │     ║
║  │ ├─ All Businesses                                    │     ║
║  │ ├─ Featured Listings                                 │     ║
║  │                                                      │     ║
║  │ ► Payments & Billing                                 │     ║
║  │ ├─ Coupon Codes                                      │     ║
║  │ ├─ Revenue                                           │     ║
║  │ ├─ Transactions                                      │     ║
║  │                                                      │     ║
║  │ ► Settings                                           │     ║
║  │ ├─ Site Settings                                     │     ║
║  │ ├─ Categories/Types                                 │     ║
║  │ ├─ Certifications                                    │     ║
║  │ ├─ Areas & Towns                                     │     ║
║  │ ├─ Users & Admins                                    │     ║
║  │                                                      │     ║
║  │ ► Help & Support                                     │     ║
║  │ ├─ Documentation                                     │     ║
║  │ ├─ Support Tickets                                   │     ║
║  │ ├─ FAQ                                               │     ║
║  └──────────────────────────────────────────────────────┘     ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────┐     ║
║  │ PENDING CLAIMS TAB                                   │     ║
║  │                                                      │     ║
║  │ Claim ID | Business | Owner | Submitted | Status    │     ║
║  │ ──────────────────────────────────────────────────── │     ║
║  │ #001     | Business 1 | John | 2 hrs | [View]      │     ║
║  │ #002     | Business 2 | Jane | 4 hrs | [View]      │     ║
║  │ #003     | Business 3 | Ahmed| 1 day| [View]       │     ║
║  │                                                      │     ║
║  │ [View Claim Details]                                 │     ║
║  │ Owner: John Smith                                    │     ║
║  │ Email: john@email.com                                │     ║
║  │ Phone: (02) 1234 5678                                │     ║
║  │                                                      │     ║
║  │ [Approve] [Reject] [Need More Info]                  │     ║
║  └──────────────────────────────────────────────────────┘     ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────┐     ║
║  │ COUPON CODES GENERATOR                               │     ║
║  │                                                      │     ║
║  │ [Generate New Code] Button                           │     ║
║  │                                                      │     ║
║  │ Discount Type: [Percentage ▼] or [Fixed Amount ▼]   │     ║
║  │ Amount: [Input field]                                │     ║
║  │ Max Uses: [Input field] (blank = unlimited)          │     ║
║  │ Expires: [Date Picker]                               │     ║
║  │ Notes: [Text area for tracking]                      │     ║
║  │                                                      │     ║
║  │ [Generate Code]                                      │     ║
║  │                                                      │     ║
║  │ Active Codes:                                        │     ║
║  │ HALAL2024XYZ | 25% off | 45/50 uses | Expires 2/15 │     ║
║  │ SAVE12        | $12 off | 120/∞ uses | Expires 3/31 │     ║
║  └──────────────────────────────────────────────────────┘     ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Color & Design System

### Color Palette
```
Primary Colors:
├── Brand Green: #10b981 (halal association)
├── Dark Green: #059669 (hover states)
└── Light Green: #d1fae5 (backgrounds)

Accent Colors:
├── Featured Blue: #3b82f6 (featured listings)
├── Gold/Yellow: #fbbf24 (ratings)
└── Alert Red: #ef4444 (errors/warnings)

Neutrals:
├── Dark Gray: #1f2937 (text)
├── Medium Gray: #6b7280 (secondary text)
├── Light Gray: #f3f4f6 (backgrounds)
└── White: #ffffff (cards/content areas)

Status Colors:
├── Success Green: #10b981 (approved)
├── Pending Orange: #f97316 (pending)
├── Error Red: #ef4444 (rejected)
└── Info Blue: #3b82f6 (information)
```

### Typography
```
Font Family: Inter or similar sans-serif

Headings:
├── H1: 36px, Bold (titles)
├── H2: 28px, Bold (section headers)
├── H3: 20px, Semi-bold (subsections)
└── H4: 16px, Semi-bold (labels)

Body:
├── Body Large: 16px, Regular (main text)
├── Body Regular: 14px, Regular (descriptions)
├── Small: 12px, Regular (captions)
└── Tiny: 10px, Regular (labels)

Line Height: 1.6 for body, 1.2 for headings
```

### Spacing System
```
Base Unit: 8px

Spacing Scale:
├── xs: 4px
├── sm: 8px
├── md: 16px
├── lg: 24px
├── xl: 32px
└── 2xl: 48px

Use: All padding, margins, and gaps
```

### Buttons
```
Primary Button:
├── Background: Green (#10b981)
├── Text: White
├── Padding: 12px 24px
├── Border Radius: 8px
└── Hover: Dark Green

Secondary Button:
├── Background: Light Gray
├── Text: Dark Gray
├── Border: 1px Light Gray
└── Hover: White with border

Danger Button:
├── Background: Red (#ef4444)
├── Text: White
└── Hover: Dark Red

Disabled Button:
├── Background: Light Gray
├── Text: Medium Gray
└── Cursor: not-allowed
```

---

## Summary

This comprehensive wireframe document provides:

✅ **9 main pages** with detailed layouts
✅ **Component library** for consistency
✅ **User flows** showing navigation paths
✅ **Mobile responsiveness** guidelines
✅ **Admin dashboard** structure
✅ **Design system** (colors, typography, spacing)
✅ **Navigation structure** (header, footer, sidebar)
✅ **Interactive elements** (buttons, forms, filters)

**Next Steps:**
1. Convert wireframes to Figma/design tool
2. Create interactive prototypes
3. Get stakeholder feedback
4. Hand off to development team (Claude Code)
5. Implement with Next.js components

---

## Implementation Notes for Claude Code

When implementing, use these wireframes as reference:
- Create components matching these layouts exactly
- Maintain spacing and alignment from wireframes
- Use the color palette consistently
- Ensure all pages are mobile-responsive
- Make interactive elements accessible (keyboard nav, ARIA labels)
- Keep performance in mind (lazy loading, optimized images)

All pages should be built as Next.js components with TypeScript types matching the data structure from the database.
