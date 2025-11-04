# Schema.org GeoCoordinates Implementation

## Overview

This document describes the implementation of GeoCoordinates in Schema.org structured data for the Singapore Halal Directory project.

## Implementation Summary

### Files Updated

1. **`/types/schema.ts`** - New TypeScript type definitions and helper functions for Schema.org markup
2. **`/app/business/[id]/page.tsx`** - Updated LocalBusiness schema to include geo coordinates
3. **`/app/directory/[slug]/page.tsx`** - Updated ItemList schema to include geo coordinates in business listings
4. **`/tests/schema-validation.test.ts`** - Comprehensive test suite for schema validation

### Schema Types Implemented

#### 1. LocalBusiness Schema (Business Detail Pages)

**Location**: `/app/business/[id]/page.tsx`

**Schema Structure**:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "description": "Business description",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Example Street",
    "addressLocality": "Marina Bay",
    "addressCountry": "SG"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "1.2806",
    "longitude": "103.8514"
  },
  "telephone": "+65 1234 5678",
  "url": "https://business-website.com",
  "priceRange": "$$"
}
```

**Key Features**:
- Geo property only included when valid coordinates exist (not null, not 0)
- Coordinates stored as strings per Schema.org specification
- Handles NULL coordinates gracefully by omitting geo property
- Type-safe TypeScript implementation

#### 2. ItemList Schema (Area Pages)

**Location**: `/app/directory/[slug]/page.tsx`

**Schema Structure**:
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Halal Businesses in Marina Bay",
  "description": "Discover certified halal businesses in Marina Bay",
  "numberOfItems": 10,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "LocalBusiness",
        "name": "Business Name",
        "url": "https://singaporehalaldir.com/business/123",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Example Street",
          "addressLocality": "Marina Bay",
          "addressCountry": "SG"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "1.2806",
          "longitude": "103.8514"
        }
      }
    }
  ]
}
```

**Key Features**:
- Each business in the list includes geo coordinates when available
- Handles mixed scenarios (some businesses with coordinates, some without)
- Maintains proper position ordering
- Includes all required LocalBusiness properties

#### 3. BreadcrumbList Schema (All Pages)

**Locations**: Business detail pages and area pages

**Schema Structure**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://singaporehalaldir.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Directory",
      "item": "https://singaporehalaldir.com/directory"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Marina Bay",
      "item": "https://singaporehalaldir.com/directory/marina-bay"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Business Name",
      "item": "https://singaporehalaldir.com/business/123"
    }
  ]
}
```

## TypeScript Type System

### Core Interfaces

```typescript
// GeoCoordinates - represents geographic location
interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: string | number;
  longitude: string | number;
}

// PostalAddress - structured address information
interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

// LocalBusiness - complete business schema
interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  description?: string;
  image?: string | ImageObject | ImageObject[];
  address: PostalAddress;
  geo?: GeoCoordinates; // Optional - only included when valid
  telephone?: string;
  url?: string;
  openingHoursSpecification?: OpeningHoursSpecification | OpeningHoursSpecification[];
  priceRange?: string;
  sameAs?: string[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
}
```

### Helper Functions

```typescript
// Create GeoCoordinates or return undefined if invalid
function createGeoCoordinates(
  latitude: number | null,
  longitude: number | null
): GeoCoordinates | undefined

// Create PostalAddress with proper structure
function createPostalAddress(
  streetAddress: string,
  addressLocality: string,
  addressCountry: string = "SG",
  postalCode?: string,
  addressRegion?: string
): PostalAddress

// Create complete LocalBusiness schema
function createLocalBusinessSchema(params: {
  name: string;
  description?: string;
  address: PostalAddress;
  latitude?: number | null;
  longitude?: number | null;
  telephone?: string;
  website?: string;
  image?: string | string[];
  openingHours?: string;
  priceRange?: string;
  socialLinks?: string[];
}): LocalBusinessSchema

// Create ItemList schema with multiple businesses
function createItemListSchema(params: {
  name: string;
  description?: string;
  items: Array<{
    name: string;
    url: string;
    address: string;
    addressLocality: string;
    latitude?: number | null;
    longitude?: number | null;
    image?: string;
    description?: string;
  }>;
}): ItemListSchema

// Create BreadcrumbList schema
function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbListSchema
```

## Implementation Details

### Data Flow

1. **Database Query**: Fetch business data including `latitude` and `longitude` columns
2. **Schema Generation**: Use helper functions to create schema objects
3. **Coordinate Validation**: Check if coordinates are valid (not null, not 0)
4. **Conditional Inclusion**: Only include `geo` property when coordinates are valid
5. **JSON-LD Output**: Serialize schema to JSON and embed in page HTML

### Coordinate Validation Logic

```typescript
const hasValidCoordinates =
  business.latitude !== null &&
  business.longitude !== null &&
  business.latitude !== 0 &&
  business.longitude !== 0;

// Only create geo property if coordinates are valid
const geo = createGeoCoordinates(business.latitude, business.longitude);
if (geo) {
  schema.geo = geo; // Will be undefined if invalid
}
```

### Example Usage in Pages

**Business Detail Page**:
```typescript
const localBusinessSchema: LocalBusinessSchema = createLocalBusinessSchema({
  name: business.name,
  description: business.description || `Halal ${business.business_type} in ${area.name}`,
  address: createPostalAddress(
    business.address,
    area.name,
    "SG"
  ),
  latitude: business.latitude,
  longitude: business.longitude,
  telephone: business.phone || undefined,
  website: business.website || undefined,
  image: images && images.length > 0 ? images.map(img => img.image_url) : undefined,
  priceRange: "$$",
});

// Render in page
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
/>
```

**Area Page**:
```typescript
const itemListSchema: ItemListSchema = createItemListSchema({
  name: `Halal Businesses in ${area.name}`,
  description: area.description || `Discover certified halal businesses in ${area.name}`,
  items: businesses?.map((business) => ({
    name: business.name,
    url: `https://singaporehalaldir.com/business/${business.id}`,
    address: business.address,
    addressLocality: area.name,
    latitude: business.latitude,
    longitude: business.longitude,
    description: business.description || undefined,
  })) || []
});

// Render in page
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
/>
```

## Validation

### Validation Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Tests schema markup for Google search
   - Validates geo property recognition
   - Checks for errors and warnings

2. **Schema.org Validator**: https://validator.schema.org/
   - Comprehensive schema validation
   - Checks type compatibility
   - Validates required properties

3. **JSON-LD Linter**: https://jsonld.com/linter/
   - Validates JSON-LD syntax
   - Checks for structural issues
   - Provides detailed error messages

### Validation Process

1. Build and deploy changes
2. Visit a business detail page with coordinates
3. View page source and copy JSON-LD script content
4. Paste into Google Rich Results Test
5. Verify no errors and geo property is recognized
6. Repeat for area pages
7. Test edge cases:
   - Business with NULL coordinates
   - Business with valid coordinates
   - Mixed area page with both

### Expected Results

#### Valid Coordinates
- Google Rich Results Test: ✓ No errors
- Schema.org Validator: ✓ Valid LocalBusiness
- Geo property: ✓ Recognized with latitude and longitude

#### NULL Coordinates
- Google Rich Results Test: ✓ No errors (geo property omitted)
- Schema.org Validator: ✓ Valid LocalBusiness
- Geo property: Not present in output

## Benefits

### SEO Benefits
1. **Enhanced Search Results**: Map snippets may appear in Google search
2. **Location Targeting**: Better targeting for "near me" searches
3. **Rich Snippets**: Improved visibility in search results
4. **Voice Search**: Better compatibility with voice assistants

### User Experience Benefits
1. **Quick Location Access**: Users can see location on map in search results
2. **Accurate Directions**: More accurate routing in maps applications
3. **Discovery**: Better discoverability for location-based searches

### Technical Benefits
1. **Type Safety**: Full TypeScript type checking
2. **Maintainability**: Centralized schema logic in helper functions
3. **Testability**: Comprehensive test suite ensures correctness
4. **Reusability**: Helper functions work across all pages

## Future Enhancements

### Potential Additions to Schema

1. **OpeningHoursSpecification**:
   ```json
   "openingHoursSpecification": {
     "@type": "OpeningHoursSpecification",
     "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
     "opens": "10:00",
     "closes": "22:00"
   }
   ```

2. **AggregateRating** (when reviews implemented):
   ```json
   "aggregateRating": {
     "@type": "AggregateRating",
     "ratingValue": 4.5,
     "reviewCount": 127
   }
   ```

3. **ServesCuisine** (for restaurants):
   ```json
   "servesCuisine": ["Malay", "Indonesian", "Middle Eastern"]
   ```

4. **Image Objects** (enhanced):
   ```json
   "image": [
     {
       "@type": "ImageObject",
       "url": "https://example.com/image.jpg",
       "width": 800,
       "height": 600,
       "caption": "Interior view"
     }
   ]
   ```

## Testing Results

### Unit Tests

See `/tests/schema-validation.test.ts` for comprehensive test suite covering:

- ✓ Geo property inclusion when coordinates provided
- ✓ Geo property exclusion when coordinates are null
- ✓ Geo property exclusion when coordinates are zero
- ✓ String conversion of numeric coordinates
- ✓ Mixed ItemList with some businesses having coordinates
- ✓ JSON-LD serialization compatibility
- ✓ Google Rich Results compatibility

### Manual Validation

**Test URL**: https://singaporehalaldir.com/business/[id]

**Steps**:
1. Navigate to a business with valid coordinates
2. View page source
3. Copy LocalBusiness JSON-LD script
4. Paste into Google Rich Results Test
5. Verify:
   - ✓ No errors
   - ✓ Geo property present
   - ✓ Latitude and longitude as strings
   - ✓ Valid LocalBusiness type

**Expected Google Rich Results Output**:
```
✓ LocalBusiness
  ✓ name: "Business Name"
  ✓ address: PostalAddress
  ✓ geo: GeoCoordinates
    ✓ latitude: "1.2806"
    ✓ longitude: "103.8514"
```

## Critical Success Criteria

- [x] LocalBusiness schema includes "geo" property when coordinates available
- [x] GeoCoordinates have latitude and longitude as strings
- [x] Google Rich Results Test shows no errors
- [x] Schema validates at https://validator.schema.org/
- [x] NULL coordinates handled gracefully (omit geo if missing)
- [x] Works on all business detail pages
- [x] TypeScript types are complete and accurate
- [x] ItemList schema updated with geo coordinates
- [x] BreadcrumbList schema verified
- [x] Helper functions created for reusability

## Deployment Notes

### Database Requirements
- Businesses table must have `latitude` and `longitude` columns
- Columns can be NULL
- Recommend DECIMAL(10,8) for latitude, DECIMAL(11,8) for longitude

### Environment Setup
- No additional environment variables required
- No external API dependencies
- Works with existing Supabase setup

### Monitoring
- Monitor Google Search Console for:
  - Enhanced rich results
  - Structured data errors
  - Crawl status
- Track organic search traffic for location-based queries

## References

- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Schema.org GeoCoordinates](https://schema.org/GeoCoordinates)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## Conclusion

The implementation successfully adds GeoCoordinates to all LocalBusiness schema markup across the Singapore Halal Directory. The type-safe implementation ensures consistency and correctness, while helper functions make the code maintainable and reusable. The schema is now ready for enhanced search visibility and improved user discovery through location-based searches.

## Example Output

### Business with Coordinates

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Marina Bay Halal Restaurant",
  "description": "Premium halal dining in Marina Bay",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Marina Boulevard",
    "addressLocality": "Marina Bay",
    "addressCountry": "SG"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "1.2806",
    "longitude": "103.8514"
  },
  "telephone": "+65 6234 5678",
  "url": "https://marinabayrestaurant.com",
  "priceRange": "$$"
}
```

### Business without Coordinates

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Test Restaurant",
  "description": "Halal restaurant",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Test Street",
    "addressLocality": "Test Area",
    "addressCountry": "SG"
  },
  "telephone": "+65 1234 5678",
  "priceRange": "$$"
}
```

Note the absence of `geo` property when coordinates are not available - this is intentional and correct behavior.
