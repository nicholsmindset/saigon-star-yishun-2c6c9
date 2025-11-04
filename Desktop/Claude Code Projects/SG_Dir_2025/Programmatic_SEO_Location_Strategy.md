# Programmatic SEO for Singapore Halal Directory: Location-Based Strategy

## Overview

Programmatic SEO creates hundreds or thousands of optimized pages automatically based on templates and data. For the Singapore Halal Directory, we'll use a **location-based pillar page structure** to rank for high-intent local keywords across all Singapore neighborhoods.

Instead of manually creating each page, we'll build:
1. **Template pages** that dynamically populate with location data
2. **Location hierarchy** (Region → Town → Area)
3. **Unique content per location** (FAQs, business listings, internal linking)
4. **Optimized schema markup** for local search

---

## Location Hierarchy Structure

### Level 1: Regions (9 regions)
- Central Area
- East
- West
- North
- Northeast
- North-Central
- Southeast
- Southwest
- Central-East

### Level 2: Towns/Planning Areas (28 towns)
Examples: Ang Mo Kio, Bedok, Bishan, Bukit Batok, etc.

### Level 3: Neighborhoods/Areas (300+ areas)
Examples: Ang Mo Kio Town Centre, Cheng San, Chong Boon, etc.

### Page Structure
```
Level 1: / (homepage)
Level 2: /directory/[town-slug] (e.g., /directory/ang-mo-kio)
Level 3: /directory/[town-slug]/[area-slug] (e.g., /directory/ang-mo-kio/cheng-san)
```

---

## Ang Mo Kio Example: Full Template Walkthrough

### Town-Level Page: `/directory/ang-mo-kio`

#### URL & Metadata
```
URL: /directory/ang-mo-kio
Meta Title: "Halal Restaurants & Certified Businesses in Ang Mo Kio | Singapore Halal Directory"
Meta Description: "Discover verified halal restaurants, cafes, and food businesses in Ang Mo Kio. All certified halal. Find hours, contact info, menus & reviews."
Canonical: /directory/ang-mo-kio
```

#### Page Structure

**1. Hero Section**
```
Headline: "Halal Restaurants & Businesses in Ang Mo Kio"
Subheading: "Discover certified halal dining and shopping in Singapore's bustling northern town"
CTA: "Browse All Businesses"
Background: Hero image of Ang Mo Kio Town Centre
```

**2. Quick Stats Section**
```
- X businesses verified
- Y featured businesses
- Z neighborhoods covered
- Last updated: [date]
```

**3. Featured Businesses Section**
```
Display 3-6 featured/premium businesses in Ang Mo Kio
- Business image
- Name, rating, certification type
- Short description
- Link to detail page
```

**4. Business Directory Table/Grid**
```
For EACH business in Ang Mo Kio:
- Business name (linked to detail page)
- Business type (Restaurant, Cafe, Butcher, Bakery, etc.)
- Halal certification (MUIS, ISCED, etc.)
- Address & postal code
- Phone number
- Hours (if available)
- View details link

Sortable by: Name, Type, Certification, Rating
Filterable by: Business type, Certification type
```

**5. Browse Neighborhoods Section**
```
Subheading: "Browse Neighborhoods in Ang Mo Kio"

Grid of neighborhood cards:
- Ang Mo Kio Town Centre (X businesses)
- Cheng San (X businesses)
- Chong Boon (X businesses)
- Kebun Bahru (X businesses)
- Sembawang Hills (X businesses)
- Shangri-La (X businesses)
- Tagore (X businesses)
- Townsville (X businesses)
- Yio Chu Kang (X businesses)
- Yio Chu Kang East (X businesses)
- Yio Chu Kang North (X businesses)
- Yio Chu Kang West (X businesses)

Each card shows:
- Neighborhood name
- Number of businesses
- Link to neighborhood page (/directory/ang-mo-kio/cheng-san)
- Quick thumbnail of featured business
```

**6. FAQ Section (Location-Specific)**
```
Q: What halal certifications do Ang Mo Kio businesses have?
A: Most businesses in Ang Mo Kio are MUIS certified. Some are ISCED certified. All listings on this directory have been verified.

Q: What types of halal food are available in Ang Mo Kio?
A: You'll find restaurants serving Malay, Indian, Middle Eastern, and fusion halal cuisine. Plus cafes, bakeries, and food courts.

Q: Where can I find halal butchers in Ang Mo Kio?
A: Check our directory filter for "Butchers" to see all verified halal meat suppliers in this area.

Q: Are all businesses in this directory actually halal?
A: Yes. We only list businesses with verified halal certifications from recognized authorities like MUIS.

Q: Can I claim a halal business in Ang Mo Kio?
A: Yes! Business owners can claim their listing to manage details, hours, and upgrade to featured status.

Q: How do I report an incorrect listing?
A: Contact us with the business name and location. We verify all submissions.
```

**7. Internal Linking Section**
```
Related Neighborhoods:
- Bukit Merah (nearby)
- Bishan (nearby)
- Toa Payoh (nearby)
- Central Area (central)

Related Regions:
- North Region Halal Guide
- All Singapore Halal Businesses

Browse Other Towns:
- Bedok Halal Directory
- Bukit Batok Halal Directory
- etc.
```

**8. Schema Markup (JSON-LD)**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Halal Restaurants & Businesses in Ang Mo Kio",
  "description": "Discover verified halal dining and shopping in Ang Mo Kio",
  "url": "https://singaporehalaldirectory.com/directory/ang-mo-kio",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://singaporehalaldirectory.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Directory",
        "item": "https://singaporehalaldirectory.com/directory"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Ang Mo Kio",
        "item": "https://singaporehalaldirectory.com/directory/ang-mo-kio"
      }
    ]
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "LocalBusiness",
        "name": "Business Name 1",
        "image": "image-url",
        "description": "Business description",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Ang Mo Kio Avenue",
          "addressLocality": "Ang Mo Kio",
          "addressRegion": "SG",
          "postalCode": "560123",
          "addressCountry": "SG"
        },
        "telephone": "+65-1234-5678",
        "url": "https://singaporehalaldirectory.com/business/business-id",
        "priceRange": "$"
      }
      // ... more businesses
    ]
  },
  "hasPart": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What halal certifications do Ang Mo Kio businesses have?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most businesses in Ang Mo Kio are MUIS certified..."
          }
        }
        // ... more FAQs
      ]
    }
  ]
}
```

**9. Footer for This Section**
```
Last Updated: [date]
Total Businesses: [count]
Featured Businesses: [count]
Neighborhoods: [count]

Report an Error? Contact us
Help us grow: Submit a business
```

---

### Area/Neighborhood Level Page: `/directory/ang-mo-kio/cheng-san`

#### URL & Metadata
```
URL: /directory/ang-mo-kio/cheng-san
Meta Title: "Halal Restaurants in Cheng San, Ang Mo Kio | Singapore"
Meta Description: "Find halal restaurants, cafes, and food shops in Cheng San, Ang Mo Kio. MUIS certified businesses with hours, contacts & reviews."
Canonical: /directory/ang-mo-kio/cheng-san
```

#### Page Structure

**1. Breadcrumb Navigation**
```
Home > Directory > Ang Mo Kio > Cheng San
(Each as clickable link)
```

**2. Hero Section**
```
Headline: "Halal Restaurants in Cheng San, Ang Mo Kio"
Subheading: "Browse X verified halal businesses in this neighborhood"
Image: Map showing Cheng San area
```

**3. Featured Listings (If Any)**
```
Display any featured/premium listings first
- Business card with image, name, certification, hours
- Blue border with "Featured" badge
- Up to 8 images displayed
```

**4. All Businesses Section**
```
List ALL businesses in Cheng San, sorted by:
- Featured first
- Then by rating/reviews
- Then alphabetically

For each business:
- Business image (featured listings show multiple)
- Business name (clickable link to detail)
- Type badge (Restaurant, Cafe, etc.)
- Certification badge (MUIS, etc.)
- Brief description
- Address
- Phone
- Hours (if available)
- Rating/reviews count (if available)
```

**5. Area Info Box**
```
Location: Cheng San, Ang Mo Kio
Postal Codes: 560xxx, 569xxx
Nearby MRT Stations: Ang Mo Kio, Bishan
Population: [demographic info]
Known For: [neighborhood character]
```

**6. Map**
```
Embedded map showing:
- All businesses in Cheng San marked with pins
- Clicked pins show business name, address, hours
- Zoom/pan controls
- Search functionality
```

**7. Neighborhood FAQ (Hyperlocal)**
```
Q: What halal restaurants are near Cheng San MRT?
A: Several options including [business names]...

Q: Are there halal food courts in Cheng San?
A: Yes, find them in our listing...

Q: Can I find halal butchers in Cheng San?
A: Several verified halal meat suppliers serve this area...

Q: What's the best halal brunch spot in Cheng San?
A: Popular options include [businesses]...
```

**8. Internal Linking**
```
Other Areas in Ang Mo Kio:
- Ang Mo Kio Town Centre
- Chong Boon
- Kebun Bahru
- etc.

Back to: Ang Mo Kio Directory
Browse Other Towns: [links]
```

**9. Schema Markup (JSON-LD)**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Halal Restaurants in Cheng San, Ang Mo Kio",
  "description": "Browse X verified halal businesses in Cheng San",
  "url": "https://singaporehalaldirectory.com/directory/ang-mo-kio/cheng-san",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      // breadcrumb items
    ]
  },
  "geo": {
    "@type": "Place",
    "name": "Cheng San, Ang Mo Kio",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cheng San",
      "addressRegion": "Ang Mo Kio",
      "addressCountry": "SG"
    }
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      // all businesses in this area
    ]
  }
}
```

---

## Database Design for Programmatic Pages

### Required Tables

**1. Areas Table**
```sql
CREATE TABLE areas (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  town_id UUID NOT NULL REFERENCES towns(id),
  region_id UUID NOT NULL REFERENCES regions(id),
  postal_codes TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  faq_schema JSONB,
  nearby_mrt TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Example rows:
-- (id, 'Cheng San', 'cheng-san', town_id, region_id, ['560000-569999'], 1.3709, 103.8452, ...)
-- (id, 'Ang Mo Kio Town Centre', 'ang-mo-kio-town-centre', town_id, region_id, ['560001-560099'], 1.3720, 103.8464, ...)
```

**2. Towns Table**
```sql
CREATE TABLE towns (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  region_id UUID NOT NULL REFERENCES regions(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  total_businesses INT DEFAULT 0,
  featured_businesses INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Example rows:
-- (id, 'Ang Mo Kio', 'ang-mo-kio', region_id, 1.3715, 103.8458, 'Northern town...')
-- (id, 'Bedok', 'bedok', region_id, 1.3245, 103.9300, 'Eastern town...')
```

**3. Regions Table**
```sql
CREATE TABLE regions (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Example rows:
-- (id, 'North', 'north')
-- (id, 'East', 'east')
-- (id, 'West', 'west')
-- (id, 'Central', 'central')
```

**4. Businesses Table** (existing, add area_id)
```sql
ALTER TABLE businesses ADD COLUMN area_id UUID REFERENCES areas(id);

-- Create index for faster queries
CREATE INDEX idx_businesses_area_id ON businesses(area_id);
CREATE INDEX idx_businesses_featured ON businesses(is_featured, area_id);
```

### Query Patterns for Dynamic Pages

**Get all businesses in an area:**
```sql
SELECT businesses.* 
FROM businesses 
JOIN areas ON businesses.area_id = areas.id
WHERE areas.slug = 'cheng-san' AND areas.town_id = (
  SELECT id FROM towns WHERE slug = 'ang-mo-kio'
)
ORDER BY businesses.is_featured DESC, businesses.name ASC;
```

**Get featured businesses for town:**
```sql
SELECT businesses.*, areas.name as area_name
FROM businesses
JOIN areas ON businesses.area_id = areas.id
WHERE areas.town_id = (SELECT id FROM towns WHERE slug = 'ang-mo-kio')
  AND businesses.is_featured = true
ORDER BY businesses.featured_expiry DESC;
```

**Get town with counts:**
```sql
SELECT 
  towns.*,
  COUNT(DISTINCT areas.id) as total_areas,
  COUNT(DISTINCT businesses.id) as total_businesses,
  COUNT(DISTINCT CASE WHEN businesses.is_featured THEN businesses.id END) as featured_businesses
FROM towns
LEFT JOIN areas ON towns.id = areas.town_id
LEFT JOIN businesses ON areas.id = businesses.area_id
WHERE towns.slug = 'ang-mo-kio'
GROUP BY towns.id;
```

---

## Next.js Implementation

### File Structure
```
app/
├── directory/
│   ├── page.tsx                      # All towns/regions
│   ├── [town]/
│   │   ├── page.tsx                  # Town page (Ang Mo Kio)
│   │   └── [area]/
│   │       └── page.tsx              # Area/neighborhood page (Cheng San)
├── api/
│   ├── towns/
│   │   ├── route.ts                  # GET all towns
│   │   └── [town]/route.ts           # GET town details
│   ├── areas/
│   │   ├── route.ts                  # GET all areas
│   │   ├── [area]/route.ts           # GET area details
│   │   └── [area]/businesses.ts      # GET businesses in area
│   └── businesses/
│       ├── by-location.ts            # GET businesses by town/area
└── lib/
    └── seo/
        ├── schema.ts                 # Schema generation
        ├── meta-tags.ts              # Meta tag generation
        └── slugs.ts                  # Slug utilities
```

### Town Page Implementation: `/app/directory/[town]/page.tsx`

```typescript
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { generateTownSchema } from '@/lib/seo/schema';
import { generateTownMetaTags } from '@/lib/seo/meta-tags';

interface TownPageProps {
  params: Promise<{ town: string }>;
}

export async function generateMetadata(props: TownPageProps): Promise<Metadata> {
  const params = await props.params;
  const town = await getTownData(params.town);
  return generateTownMetaTags(town);
}

async function getTownData(townSlug: string) {
  const supabase = await createClient();
  
  const { data: town, error: townError } = await supabase
    .from('towns')
    .select('*')
    .eq('slug', townSlug)
    .single();

  if (townError || !town) return null;

  // Get all areas in this town
  const { data: areas } = await supabase
    .from('areas')
    .select('id, name, slug, town_id')
    .eq('town_id', town.id)
    .order('name');

  // Get featured businesses in this town
  const { data: featuredBusinesses } = await supabase
    .from('businesses')
    .select(`
      *,
      areas:area_id(name, slug)
    `)
    .eq('areas.town_id', town.id)
    .eq('is_featured', true)
    .limit(6);

  // Get count of all businesses
  const { count: totalBusinesses } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('areas.town_id', town.id);

  return {
    ...town,
    areas,
    featuredBusinesses,
    totalBusinesses
  };
}

export default async function TownPage(props: TownPageProps) {
  const params = await props.params;
  const townData = await getTownData(params.town);

  if (!townData) {
    return <div>Town not found</div>;
  }

  const schema = generateTownSchema(townData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Halal Restaurants & Businesses in {townData.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover {townData.totalBusinesses} verified halal dining and shopping options
          </p>
        </section>

        {/* Featured Businesses */}
        {townData.featuredBusinesses?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {townData.featuredBusinesses.map(business => (
                <FeaturedBusinessCard key={business.id} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* Browse Neighborhoods */}
        {townData.areas?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Browse {townData.areas.length} Neighborhoods in {townData.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {townData.areas.map(area => (
                <AreaCard key={area.id} area={area} town={townData} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={townData.faqs} />
        </section>

        {/* Related Towns */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Browse Other Towns</h2>
          <RelatedTownsList currentTown={townData} />
        </section>
      </div>
    </>
  );
}
```

### Area Page Implementation: `/app/directory/[town]/[area]/page.tsx`

```typescript
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { generateAreaSchema } from '@/lib/seo/schema';
import { generateAreaMetaTags } from '@/lib/seo/meta-tags';

interface AreaPageProps {
  params: Promise<{ town: string; area: string }>;
}

export async function generateMetadata(props: AreaPageProps): Promise<Metadata> {
  const params = await props.params;
  const areaData = await getAreaData(params.town, params.area);
  return generateAreaMetaTags(areaData);
}

async function getAreaData(townSlug: string, areaSlug: string) {
  const supabase = await createClient();

  // Get town
  const { data: town } = await supabase
    .from('towns')
    .select('*')
    .eq('slug', townSlug)
    .single();

  if (!town) return null;

  // Get area
  const { data: area } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', areaSlug)
    .eq('town_id', town.id)
    .single();

  if (!area) return null;

  // Get ALL businesses in this area
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('area_id', area.id)
    .order('is_featured', { ascending: false })
    .order('name');

  // Get nearby areas
  const { data: nearbyAreas } = await supabase
    .from('areas')
    .select('name, slug, town_id')
    .eq('town_id', town.id)
    .neq('id', area.id)
    .limit(5);

  return {
    area,
    town,
    businesses,
    nearbyAreas
  };
}

export default async function AreaPage(props: AreaPageProps) {
  const params = await props.params;
  const areaData = await getAreaData(params.town, params.area);

  if (!areaData) {
    return <div>Area not found</div>;
  }

  const schema = generateAreaSchema(areaData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <a href="/directory" className="text-blue-600">Home</a>
          {' > '}
          <a href="/directory" className="text-blue-600">Directory</a>
          {' > '}
          <a href={`/directory/${params.town}`} className="text-blue-600">
            {areaData.town.name}
          </a>
          {' > '}
          <span className="text-gray-700">{areaData.area.name}</span>
        </nav>

        {/* Hero */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Halal Restaurants in {areaData.area.name}, {areaData.town.name}
          </h1>
          <p className="text-xl text-gray-600">
            Browse {areaData.businesses?.length || 0} verified halal businesses
          </p>
        </section>

        {/* Businesses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Businesses</h2>
          {areaData.businesses && areaData.businesses.length > 0 ? (
            <div className="space-y-4">
              {areaData.businesses.map(business => (
                <BusinessListItem 
                  key={business.id} 
                  business={business}
                  featured={business.is_featured}
                />
              ))}
            </div>
          ) : (
            <p>No businesses listed yet. Be the first to submit one!</p>
          )}
        </section>

        {/* Map */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Location Map</h2>
          <BusinessMap businesses={areaData.businesses} area={areaData.area} />
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Halal Dining in {areaData.area.name}
          </h2>
          <FAQAccordion 
            faqs={areaData.area.faq_schema?.faqs || DEFAULT_FAQS}
          />
        </section>

        {/* Related Areas */}
        {areaData.nearbyAreas?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Other Areas in {areaData.town.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {areaData.nearbyAreas.map(nearbyArea => (
                <a
                  key={nearbyArea.id}
                  href={`/directory/${params.town}/${nearbyArea.slug}`}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  {nearbyArea.name}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
```

---

## SEO Best Practices for Programmatic Pages

### 1. Unique Meta Tags (Per Page)
```typescript
// lib/seo/meta-tags.ts
export function generateTownMetaTags(town: Town): Metadata {
  return {
    title: `Halal Restaurants & Certified Businesses in ${town.name} | Singapore Halal Directory`,
    description: `Discover verified halal dining and shopping in ${town.name}. All MUIS certified. Find hours, contact info, menus & reviews.`,
    keywords: [
      `halal restaurants ${town.name}`,
      `halal food ${town.name}`,
      `halal cafe ${town.name}`,
      `halal butcher ${town.name}`,
      `certified halal ${town.name}`
    ],
    openGraph: {
      title: `Halal Restaurants in ${town.name}`,
      description: `Browse X halal businesses in ${town.name}`,
      url: `https://singaporehalaldirectory.com/directory/${town.slug}`,
    }
  };
}

export function generateAreaMetaTags(area: Area, town: Town): Metadata {
  return {
    title: `Halal Restaurants in ${area.name}, ${town.name} | Singapore`,
    description: `Find halal restaurants, cafes, and food shops in ${area.name}, ${town.name}. MUIS certified businesses with hours, contacts & reviews.`,
    keywords: [
      `halal ${area.name}`,
      `halal restaurants ${area.name}`,
      `halal food ${area.name}`,
      `${town.name} halal`
    ],
    openGraph: {
      title: `Halal Restaurants in ${area.name}, ${town.name}`,
      description: `Discover halal dining options in ${area.name}`,
      url: `https://singaporehalaldirectory.com/directory/${town.slug}/${area.slug}`,
    }
  };
}
```

### 2. Proper URL Structure
```
/directory/ang-mo-kio                    (town page)
/directory/ang-mo-kio/cheng-san         (area page)
/business/business-id-slug              (business detail)
```

### 3. Canonical Tags (Automatic)
```typescript
// Next.js automatically adds canonical tags in metadata
// But you can also manually set in layout:
<link rel="canonical" href={`https://domain.com${pathname}`} />
```

### 4. Heading Structure
```
H1: "Halal Restaurants in [Area], [Town]" (one per page)
H2: "Featured Businesses", "Browse Neighborhoods", "FAQ", etc.
H3: Sub-sections under H2
```

### 5. Internal Linking Strategy
```
Town Page Links To:
  - All area pages within that town
  - Nearby towns
  - Related region pages

Area Page Links To:
  - Parent town page
  - Sibling area pages in same town
  - Individual business detail pages
```

### 6. Dynamic Sitemap Generation
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const supabase = await createClient();

  // Get all towns
  const { data: towns } = await supabase.from('towns').select('slug');
  
  // Get all areas
  const { data: areas } = await supabase.from('areas').select('slug, town_id');

  // Get all businesses
  const { data: businesses } = await supabase.from('businesses').select('id');

  const townUrls = towns.map(town => ({
    url: `https://domain.com/directory/${town.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  const areaUrls = areas.map(area => ({
    url: `https://domain.com/directory/${area.town_slug}/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  }));

  return [...townUrls, ...areaUrls];
}
```

---

## Content Templates

### Town Page FAQ Template
```
Q: What halal restaurants are in [Town]?
A: [Town] has X verified halal restaurants serving a variety of cuisines including...

Q: Are all businesses in [Town] MUIS certified?
A: Most businesses are MUIS certified. Some are ISCED certified...

Q: Can I claim a restaurant in [Town]?
A: Yes! Business owners can claim their listing...

Q: Where can I find halal food courts in [Town]?
A: Browse our directory filter for food courts in [Town]...

Q: What's the best halal brunch spot in [Town]?
A: Popular options include...

Q: How often is this directory updated?
A: We verify all listings regularly and update when changes occur.
```

### Area Page FAQ Template
```
Q: How many halal restaurants are in [Area], [Town]?
A: There are currently X verified halal businesses in this neighborhood.

Q: What types of cuisines are available in [Area]?
A: [Area] offers Malay, Indian, Middle Eastern, and fusion halal cuisine.

Q: Is there a halal food court in [Area]?
A: Yes, we have X food courts listed.

Q: Where's the nearest halal restaurant to [Area] MRT?
A: Several options within walking distance...
```

---

## Scalability Checklist

- [ ] Database handles 500+ areas (indexed on slug, town_id)
- [ ] Pages generate in <500ms with proper caching
- [ ] Static generation with ISR (revalidate on business changes)
- [ ] Sitemap includes all pages (<50,000 URLs initially)
- [ ] Schema markup validates on all pages
- [ ] Mobile rendering tested on all page types
- [ ] Breadcrumbs consistent across all pages
- [ ] Internal linking prevents orphan pages
- [ ] Meta descriptions unique per page (not templated generically)
- [ ] Image optimization applied to all areas
- [ ] 404 handling for missing towns/areas
- [ ] Redirection setup for slug changes

---

## Prompt for Claude Code

```
Create a fully functional programmatic SEO system for the Singapore Halal Directory:

1. Create the database tables: regions, towns, areas
   - Add proper indexes for slug and town_id queries
   - Populate with all Singapore locations (regions, towns, neighborhoods)
   - Add sample FAQs to areas

2. Create Next.js dynamic pages:
   - /app/directory/[town]/page.tsx - Town-level pillar pages
   - /app/directory/[town]/[area]/page.tsx - Neighborhood-level pillar pages
   - Include featured business sections
   - Include all businesses listings with proper sorting

3. Implement SEO:
   - Unique meta tags for each page
   - BreadcrumbList schema for all pages
   - LocalBusiness schema for all business listings
   - CollectionPage schema for town/area pages
   - FAQPage schema for FAQ sections
   - JSON-LD in <script> tags

4. Create utility functions:
   - generateTownMetaTags(town)
   - generateAreaMetaTags(area, town)
   - generateTownSchema(town)
   - generateAreaSchema(area, town)

5. Add internal linking:
   - Town page links to all areas
   - Area page links back to town
   - Area page links to sibling areas
   - Featured businesses link to detail pages

6. Create dynamic sitemap generation

Make this production-ready with proper error handling. Each page should load in <500ms with ISR caching.
```

---

## Expected Results

**After Implementation:**
- 1 homepage
- 28 town pages (one per planning area)
- 300+ area/neighborhood pages
- All pages rank for local keywords like:
  - "halal restaurants ang mo kio"
  - "halal food cheng san"
  - "certified halal chong boon"
  - etc.

**SEO Impact:**
- Hundreds of indexed pages
- Strong internal linking structure
- Proper schema markup for local search
- Quick ranking for location-based keywords
- LLM visibility through proper schema

**Traffic Prediction:**
- Month 1-2: Low (domain authority building)
- Month 2-3: Moderate (area pages ranking)
- Month 3+: Growing (town pages ranking, brand authority)

---

## Next Steps

1. **Create database schema** with regions, towns, areas
2. **Populate location data** for all Singapore neighborhoods
3. **Build dynamic pages** (/directory/[town] and /directory/[town]/[area])
4. **Implement schema markup** for all pages
5. **Set up ISR caching** for performance
6. **Launch and monitor** rankings for target keywords
7. **Iterate based on analytics** (see what ranks, optimize)

This programmatic approach creates a scalable, SEO-optimized foundation for your Singapore Halal Directory.
