# BusinessMap Component Documentation

## Overview

`BusinessMap` is a fully-featured Leaflet map component for displaying halal business locations in the Singapore Halal Directory. It supports both single and multiple business markers with automatic bounds calculation, custom styling, and accessibility features.

## Features

- **Single & Multiple Markers**: Display one business or hundreds with automatic view optimization
- **Custom Markers**: Color-coded markers (green for standard, blue for featured businesses)
- **Auto-Centering**: Automatically calculates optimal center and zoom based on business locations
- **Interactive Popups**: Click markers to view business info with direct links
- **Responsive Design**: Mobile-friendly with touch support
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Error Handling**: Graceful fallbacks for missing or invalid coordinates
- **Performance**: Client-side rendering with dynamic imports for optimal bundle size
- **Clustering Ready**: Detects when clustering would improve performance (>10 markers)

## Installation

The required dependencies are already installed:

```bash
# Already in package.json
"leaflet": "^1.9.4"
"react-leaflet": "^5.0.0"
"@types/leaflet": "^1.9.21"
```

## Basic Usage

### Single Business (Detail Page)

```tsx
import BusinessMap from '@/app/components/BusinessMap';

const business = {
  id: '123',
  name: 'Halal Restaurant',
  latitude: 1.3521,
  longitude: 103.8198,
  address: '1 Marina Bay, Singapore',
  business_type: 'Restaurant',
  is_featured: false,
};

<BusinessMap
  businesses={[business]}
  zoom={15}
  height="h-[400px]"
/>
```

### Multiple Businesses (Area Listing Page)

```tsx
import BusinessMap from '@/app/components/BusinessMap';

const businesses = [
  // Array of business objects
];

<BusinessMap
  businesses={businesses}
  onMarkerClick={(businessId) => {
    // Handle marker click
    console.log('Clicked business:', businessId);
  }}
  enableClustering={true}
  height="h-[350px]"
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `businesses` | `BusinessLocation[]` | **Required** | Array of business locations to display |
| `center` | `[number, number]` | Auto-calculated | Map center coordinates `[lat, lng]` |
| `zoom` | `number` | Auto (13-15) | Initial zoom level (1-19) |
| `className` | `string` | `''` | Additional CSS classes |
| `height` | `string` | `'h-[300px] md:h-[400px]'` | Map container height (Tailwind classes) |
| `onMarkerClick` | `(id: string) => void` | `undefined` | Callback when marker is clicked |
| `enableClustering` | `boolean` | `true` | Enable clustering for many markers |
| `clusterThreshold` | `number` | `10` | Minimum markers to trigger clustering notification |

## BusinessLocation Interface

```typescript
interface BusinessLocation {
  id: string;                // Unique business ID
  name: string;              // Business name
  latitude: number;          // Latitude coordinate
  longitude: number;         // Longitude coordinate
  address: string;           // Full address
  business_type?: string;    // Optional: Restaurant, Café, etc.
  is_featured?: boolean;     // Optional: Featured listing status
}
```

## Integration Examples

### 1. Business Detail Page (`/business/[id]/page.tsx`)

```tsx
import BusinessMap from '@/app/components/BusinessMap';
import { createClient } from '@/lib/supabase/server';

export default async function BusinessDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Fetch business from database
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, latitude, longitude, address, business_type, is_featured')
    .eq('id', params.id)
    .single();

  if (!business) return <div>Business not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1>{business.name}</h1>
          {/* More content */}
        </div>

        {/* Sidebar with map */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <BusinessMap
              businesses={[business]}
              zoom={15}
              height="h-[300px]"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full btn-primary"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Area Listing Page (`/directory/[area]/page.tsx`)

```tsx
'use client';

import { useState } from 'react';
import BusinessMap from '@/app/components/BusinessMap';
import { createClient } from '@/lib/supabase/client';

export default function AreaListingPage({ params }: { params: { area: string } }) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Fetch businesses for this area
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, latitude, longitude, address, business_type, is_featured')
    .eq('area_slug', params.area)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  const handleMarkerClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    // Scroll to business card
    document.getElementById(`business-${businessId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div>
      {/* Map section */}
      <BusinessMap
        businesses={businesses}
        onMarkerClick={handleMarkerClick}
        height="h-[350px]"
      />

      {/* Business cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            isSelected={selectedBusinessId === business.id}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. Custom Marker Click Handler

```tsx
const handleMarkerClick = (businessId: string) => {
  // Option 1: Navigate to business page
  router.push(`/business/${businessId}`);

  // Option 2: Scroll to card and highlight
  const element = document.getElementById(`business-${businessId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('ring-2', 'ring-blue-500');
    setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500'), 2000);
  }

  // Option 3: Open modal with business details
  setSelectedBusiness(businesses.find(b => b.id === businessId));
  setIsModalOpen(true);
};

<BusinessMap
  businesses={businesses}
  onMarkerClick={handleMarkerClick}
/>
```

## Mock Data for Testing

```tsx
import {
  mockSingleBusiness,
  mockBugisBusinesses,
  mockOrchardBusinesses,
  mockLargeDataset,
  getMockBusinessesByArea,
} from '@/app/lib/mockBusinessData';

// Test single business
<BusinessMap businesses={[mockSingleBusiness]} zoom={15} />

// Test area listings
<BusinessMap businesses={mockBugisBusinesses} />

// Test clustering (50+ markers)
<BusinessMap businesses={mockLargeDataset} enableClustering={true} />

// Get mock data by area
const businesses = getMockBusinessesByArea('bugis');
<BusinessMap businesses={businesses} />
```

## Error States

The component handles three error states automatically:

### 1. No Businesses (Empty Array)

```tsx
<BusinessMap businesses={[]} />
// Displays: "No location data available" with map icon
```

### 2. Invalid Coordinates

```tsx
const invalidBusiness = {
  id: '1',
  name: 'Invalid',
  latitude: NaN,
  longitude: NaN,
  address: 'Unknown',
};
<BusinessMap businesses={[invalidBusiness]} />
// Displays: "Invalid location coordinates" warning
```

### 3. Mixed Valid/Invalid

```tsx
// Component filters out invalid coordinates automatically
// and displays only valid business locations
```

## Styling & Customization

### Custom Height

```tsx
// Mobile: 200px, Desktop: 350px
<BusinessMap height="h-[200px] md:h-[350px]" businesses={businesses} />

// Fixed 500px
<BusinessMap height="h-[500px]" businesses={businesses} />
```

### Custom Classes

```tsx
<BusinessMap
  businesses={businesses}
  className="shadow-xl rounded-2xl border-4 border-emerald-500"
/>
```

### Custom Center & Zoom

```tsx
// Override auto-calculation
<BusinessMap
  businesses={businesses}
  center={[1.3521, 103.8198]} // Singapore center
  zoom={11}
/>
```

## Marker Colors

- **Standard Listings**: Green (`#10b981`) - Emerald color
- **Featured Listings**: Blue (`#3b82f6`) - Blue color with star icon

Markers include:
- White center dot
- Drop shadow
- White border
- Featured star badge (for featured listings)

## Popup Content

Each marker popup includes:
- Business name (clickable)
- Business type (if available)
- Full address
- "View Details" link to business page
- Color-coded featured badge (if applicable)

## Accessibility Features

### Keyboard Navigation

- Arrow keys: Pan the map
- `+` / `-` keys: Zoom in/out
- `Tab` key: Focus on map controls
- `Enter` key: Activate focused control

### Screen Reader Support

```html
<div role="region" aria-label="Interactive business location map">
  <!-- Screen reader instructions -->
  <div class="sr-only">
    <p>Use arrow keys to pan the map, plus and minus keys to zoom.</p>
    <p>Displaying 15 business locations.</p>
  </div>
</div>
```

### ARIA Labels

- Each marker has `title` attribute for tooltip
- Each marker has `alt` attribute for screen readers
- Map container has `role="region"` and `aria-label`

## Performance Optimization

### Client-Side Only

The component uses `'use client'` directive and only renders on the client to avoid SSR issues with Leaflet.

### Dynamic Imports

Leaflet is loaded dynamically only when the map is rendered:

```typescript
const L = (await import('leaflet')).default;
await import('leaflet/dist/leaflet.css');
```

### Memoization

Component is wrapped in `React.memo()` to prevent unnecessary re-renders.

### Clustering Recommendation

When displaying >10 markers, the component logs a recommendation to install marker clustering:

```bash
npm install leaflet.markercluster @types/leaflet.markercluster
```

Then update the component to use clustering for better performance.

## Google Maps Integration

Link to Google Maps for directions:

```tsx
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;

<a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
  Get Directions
</a>
```

## Common Use Cases

### 1. Show All Featured Businesses

```tsx
const featuredBusinesses = businesses.filter(b => b.is_featured);
<BusinessMap businesses={featuredBusinesses} />
```

### 2. Filter by Business Type

```tsx
const restaurants = businesses.filter(b => b.business_type === 'Restaurant');
<BusinessMap businesses={restaurants} />
```

### 3. Search Results Map

```tsx
const searchResults = businesses.filter(b =>
  b.name.toLowerCase().includes(searchQuery.toLowerCase())
);
<BusinessMap businesses={searchResults} />
```

### 4. Nearby Businesses

```tsx
// Filter businesses within radius
const nearbyBusinesses = businesses.filter(business => {
  const distance = calculateDistance(
    userLocation,
    [business.latitude, business.longitude]
  );
  return distance <= 5; // 5km radius
});
<BusinessMap businesses={nearbyBusinesses} center={userLocation} />
```

## Production Checklist

Before deploying to production:

- [ ] Replace mock data with Supabase queries
- [ ] Ensure `latitude` and `longitude` columns exist in `businesses` table
- [ ] Add database indexes on latitude/longitude for performance
- [ ] Test with varying numbers of businesses (1, 10, 50, 100+)
- [ ] Verify mobile responsiveness on actual devices
- [ ] Test accessibility with screen readers
- [ ] Add error boundary for map failures
- [ ] Consider installing `leaflet.markercluster` for large datasets
- [ ] Optimize images for business popups
- [ ] Add analytics tracking for map interactions
- [ ] Test on slow network connections (3G)

## Future Enhancements

Potential improvements for future versions:

1. **Marker Clustering**: Install and integrate `leaflet.markercluster`
2. **User Location**: Show user's current location on map
3. **Directions**: Integrate with Google Maps/Apple Maps APIs
4. **Search**: Add search bar to filter businesses on map
5. **Filters**: Category, rating, distance filters
6. **Custom Icons**: Upload custom halal certification icons
7. **Street View**: Integrate Google Street View
8. **Print Map**: Add print-friendly map view
9. **Offline Mode**: Cache map tiles for offline access
10. **Heat Maps**: Show business density heat map

## Troubleshooting

### Map Not Displaying

1. Check browser console for errors
2. Verify Leaflet CSS is imported
3. Ensure businesses array has valid coordinates
4. Check that parent container has defined height

### Markers Not Appearing

1. Verify `latitude` and `longitude` are numbers, not strings
2. Check coordinates are within Singapore bounds (1.1-1.5 lat, 103.6-104.1 lng)
3. Ensure `businesses` array is not empty

### Performance Issues

1. Enable clustering for >50 markers
2. Reduce initial zoom level for many markers
3. Lazy load map component with `dynamic` import
4. Debounce pan/zoom events

### Mobile Issues

1. Set `scrollWheelZoom: false` for better UX
2. Test touch gestures (pinch zoom, pan)
3. Ensure map height is appropriate for mobile viewports

## Support & Documentation

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap Tile Server](https://wiki.openstreetmap.org/wiki/Tile_servers)

## License

This component is part of the Singapore Halal Directory project and follows the project's license terms.
