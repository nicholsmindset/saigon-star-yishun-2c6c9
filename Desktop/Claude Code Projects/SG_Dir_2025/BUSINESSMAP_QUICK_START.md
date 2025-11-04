# BusinessMap Component - Quick Start Guide

## Installation

Dependencies already installed:
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "@types/leaflet": "^1.9.21"
}
```

## Basic Usage

### 1. Single Business (Detail Page)

```tsx
import BusinessMap from '@/app/components/BusinessMap';

// In your component
<BusinessMap
  businesses={[
    {
      id: '123',
      name: 'Halal Restaurant',
      latitude: 1.3521,
      longitude: 103.8198,
      address: '1 Marina Bay, Singapore',
      business_type: 'Restaurant',
      is_featured: false,
    }
  ]}
  zoom={15}
  height="h-[400px]"
/>
```

### 2. Multiple Businesses (Area Page)

```tsx
import BusinessMap from '@/app/components/BusinessMap';

// Fetch from database
const { data: businesses } = await supabase
  .from('businesses')
  .select('id, name, latitude, longitude, address, business_type, is_featured')
  .eq('area_id', areaId);

// Render map
<BusinessMap
  businesses={businesses}
  onMarkerClick={(businessId) => {
    // Handle marker click
    router.push(`/business/${businessId}`);
  }}
  enableClustering={true}
/>
```

## Testing

Visit test page: `http://localhost:3000/test-map`

Use mock data:
```tsx
import { mockSingleBusiness, mockBugisBusinesses } from '@/app/lib/mockBusinessData';

<BusinessMap businesses={mockBugisBusinesses} />
```

## Database Setup

```sql
-- Add columns (if not exists)
ALTER TABLE businesses
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;

-- Add index
CREATE INDEX idx_businesses_coordinates
ON businesses(latitude, longitude);
```

## Props Reference

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `businesses` | `BusinessLocation[]` | - | Yes |
| `zoom` | `number` | 12-15 (auto) | No |
| `height` | `string` | `'h-[300px] md:h-[400px]'` | No |
| `onMarkerClick` | `(id: string) => void` | - | No |
| `center` | `[number, number]` | Auto-calculated | No |
| `enableClustering` | `boolean` | `true` | No |
| `clusterThreshold` | `number` | `10` | No |
| `className` | `string` | `''` | No |

## Key Features

- ✅ Green markers for standard listings
- ✅ Blue markers with star for featured listings
- ✅ Interactive popups with business info
- ✅ Auto-centering and zoom
- ✅ Keyboard navigation (arrows, +/-)
- ✅ Mobile-friendly
- ✅ Error states for missing/invalid data

## Common Patterns

### Scroll to Business Card on Marker Click

```tsx
const handleMarkerClick = (businessId: string) => {
  const element = document.getElementById(`business-${businessId}`);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

<BusinessMap businesses={businesses} onMarkerClick={handleMarkerClick} />
```

### Google Maps Directions

```tsx
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

<a href={directionsUrl} target="_blank">Get Directions</a>
```

### Filter Featured Businesses

```tsx
const featuredOnly = businesses.filter(b => b.is_featured);

<BusinessMap businesses={featuredOnly} />
```

## Troubleshooting

**Map not showing?**
- Check console for errors
- Verify businesses array has valid coordinates
- Ensure parent container has height

**Markers not appearing?**
- Verify latitude/longitude are numbers, not strings
- Check coordinates are within Singapore bounds (1.1-1.5 lat, 103.6-104.1 lng)

**Performance slow with many markers?**
- Install leaflet.markercluster: `npm install leaflet.markercluster`
- Component will log recommendation when >10 markers detected

## File Locations

- Component: `/sg-halal-directory/app/components/BusinessMap.tsx`
- Mock Data: `/sg-halal-directory/app/lib/mockBusinessData.ts`
- Test Page: `/sg-halal-directory/app/test-map/page.tsx`
- Full Docs: `/sg-halal-directory/app/components/README_BusinessMap.md`

## Next Steps

1. Test component: Visit `/test-map`
2. Add database columns for latitude/longitude
3. Populate coordinate data for businesses
4. Integrate into business detail pages
5. Integrate into area listing pages

## Need Help?

- Check full documentation: `app/components/README_BusinessMap.md`
- View examples: `app/examples/*MapExample.tsx`
- Test interactively: Visit `/test-map`
- Review implementation summary: Root `BUSINESSMAP_IMPLEMENTATION_SUMMARY.md`
