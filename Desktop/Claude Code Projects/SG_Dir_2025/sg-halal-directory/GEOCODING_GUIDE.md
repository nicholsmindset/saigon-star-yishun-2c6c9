# Geocoding System Guide

Complete guide for the Singapore Halal Directory geocoding system.

## Overview

This system converts business addresses to geographic coordinates (latitude/longitude) for map display and location-based search features.

**Key Features:**
- Automatic geocoding for new businesses
- Batch geocoding for existing businesses
- Free APIs (no cost)
- Rate limiting and error handling
- Singapore-optimized accuracy
- Fallback to default coordinates

## Architecture

### Database Schema

**Businesses Table:**
```sql
latitude    NUMERIC(10,8)  -- e.g., 1.3521
longitude   NUMERIC(11,8)  -- e.g., 103.8198
```

**Default Values:**
- Latitude: 1.3521 (Singapore center)
- Longitude: 103.8198 (Marina Bay area)

**Indexes:**
- `idx_businesses_geo_bbox` - For efficient location queries
- `idx_areas_geo_bbox` - For area center coordinates

### Geocoding Providers

**Primary: OneMap API**
- Provider: Singapore government
- Coverage: Singapore only
- Accuracy: Very high for local addresses
- Rate limit: 250 requests/minute
- API key: Not required
- Cost: Free

**Fallback: Nominatim (OpenStreetMap)**
- Provider: OpenStreetMap Foundation
- Coverage: Global
- Accuracy: Good for major landmarks
- Rate limit: 1 request/second
- API key: Not required
- Cost: Free
- Requirements: User-Agent header

**Default: Singapore Center**
- Used when both APIs fail
- Coordinates: 1.3521, 103.8198
- Ensures all businesses have valid coordinates

## Usage

### 1. Database Migration

Apply the geocoding migration to add indexes and helper functions:

```bash
cd sg-halal-directory

# Apply migration
supabase db push

# Verify migration
supabase db diff
```

**Migration Features:**
- Backfills null coordinates with Singapore center
- Creates composite indexes for geo queries
- Adds `calculate_distance()` function (Haversine formula)
- Adds `find_nearby_businesses()` function

### 2. API Route Usage

**Endpoint:** `POST /api/geocode`

**Request:**
```json
{
  "address": "123 Orchard Road, Singapore 238858"
}
```

**Response:**
```json
{
  "latitude": 1.3034,
  "longitude": 103.8354,
  "accuracy": "exact",
  "provider": "onemap",
  "displayName": "123 ORCHARD ROAD, SINGAPORE 238858"
}
```

**Accuracy Levels:**
- `exact` - Building-level accuracy (most addresses)
- `approximate` - Area-level accuracy (general location)
- `default` - Singapore center (geocoding failed)

**Rate Limiting:**
- 10 requests per minute per IP
- HTTP 429 if exceeded
- Client-side should implement retry logic

**Example Frontend Code:**
```typescript
async function geocodeAddress(address: string) {
  const response = await fetch('/api/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a minute.');
    }
    throw new Error('Geocoding failed');
  }

  return await response.json();
}
```

### 3. Utility Functions

**Import:**
```typescript
import {
  geocodeAddress,
  batchGeocode,
  calculateDistance,
  isInSingapore,
  SINGAPORE_CENTER,
  SINGAPORE_LANDMARKS,
} from '@/lib/utils/geocoding';
```

**Single Address:**
```typescript
const result = await geocodeAddress('Bugis Junction, Singapore');
console.log(result);
// {
//   latitude: 1.2997,
//   longitude: 103.8556,
//   accuracy: 'exact',
//   provider: 'onemap'
// }
```

**Batch Geocoding:**
```typescript
const addresses = [
  '123 Orchard Road, Singapore',
  '456 Geylang Road, Singapore',
];

const results = await batchGeocode(addresses, (current, total, address) => {
  console.log(`Processing ${current}/${total}: ${address}`);
});
```

**Distance Calculation:**
```typescript
const distance = calculateDistance(
  1.3521, 103.8198, // Singapore center
  1.2997, 103.8556  // Bugis
);
console.log(`Distance: ${distance.toFixed(2)} km`); // ~6.3 km
```

**Singapore Validation:**
```typescript
const valid = isInSingapore(1.3521, 103.8198); // true
const invalid = isInSingapore(14.5995, 120.9842); // false (Manila)
```

### 4. Batch Script

Geocode all existing businesses in database:

**Setup:**

1. Add script to `package.json`:
```json
{
  "scripts": {
    "geocode:businesses": "tsx scripts/geocode-existing.ts"
  },
  "devDependencies": {
    "tsx": "^4.19.2"
  }
}
```

2. Install tsx:
```bash
npm install -D tsx
```

**Usage:**

```bash
# Dry run (preview only)
npm run geocode:businesses -- --dry-run

# Actually update database
npm run geocode:businesses

# Geocode specific business
npm run geocode:businesses -- --business-id <uuid>
```

**Output:**
```
┌─────────────────────────────────────────────────────────┐
│   Singapore Halal Directory - Geocoding Script        │
└─────────────────────────────────────────────────────────┘

📊 Fetching businesses from database...
✅ Found 150 businesses

🎯 45 businesses need geocoding

🚀 Starting geocoding...

[████████████████████████████████████████] 100% | 45/45

┌─────────────────────────────────────────────────────────┐
│   Geocoding Complete                                   │
└─────────────────────────────────────────────────────────┘

📊 Statistics:
   Total businesses:  45
   ✅ Successful:     43
   ❌ Failed:         2
   ⏭️  Skipped:        0

🎯 Accuracy breakdown:
   Exact:        38 (88%)
   Approximate:  5 (12%)
   Fallback:     0 (0%)

✅ Geocoding process complete!
```

## Integration with Business Forms

### Create/Edit Business Form

**Automatic Geocoding:**
```typescript
async function handleBusinessSubmit(formData: BusinessFormData) {
  // Geocode address
  const coords = await geocodeAddress(formData.address);

  // Save to database
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      ...formData,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

  // Show accuracy to user
  if (coords.accuracy === 'default') {
    alert('Could not determine exact location. Using Singapore center.');
  }
}
```

**Manual Override:**
```typescript
// Allow admin to manually adjust coordinates
<input
  type="number"
  step="0.0001"
  value={latitude}
  onChange={(e) => setLatitude(parseFloat(e.target.value))}
/>
<input
  type="number"
  step="0.0001"
  value={longitude}
  onChange={(e) => setLongitude(parseFloat(e.target.value))}
/>
```

## Database Queries

### Find Nearby Businesses

**Using SQL Function:**
```sql
-- Find businesses within 5km of Bugis
SELECT * FROM find_nearby_businesses(
  1.2997,  -- latitude
  103.8556, -- longitude
  5,        -- radius in km
  20        -- max results
);
```

**Using Supabase Client:**
```typescript
const { data, error } = await supabase.rpc('find_nearby_businesses', {
  search_lat: 1.2997,
  search_lon: 103.8556,
  radius_km: 5,
  limit_count: 20,
});
```

**Response:**
```typescript
[
  {
    id: 'uuid',
    name: 'Halal Restaurant',
    address: '123 Beach Road',
    business_type: 'Restaurant',
    latitude: 1.3000,
    longitude: 103.8560,
    distance_km: 0.35
  },
  // ... more results
]
```

### Filter by Bounding Box

**SQL Query:**
```sql
-- Find businesses in a rectangular area
SELECT * FROM businesses
WHERE
  status = 'approved'
  AND latitude BETWEEN 1.28 AND 1.32
  AND longitude BETWEEN 103.83 AND 103.87
ORDER BY latitude, longitude;
```

**Supabase Client:**
```typescript
const { data, error } = await supabase
  .from('businesses')
  .select('*')
  .eq('status', 'approved')
  .gte('latitude', minLat)
  .lte('latitude', maxLat)
  .gte('longitude', minLon)
  .lte('longitude', maxLon);
```

## Map Integration

### Leaflet Example

**Install:**
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

**Component:**
```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function BusinessMap({ businesses }: { businesses: Business[] }) {
  return (
    <MapContainer
      center={[1.3521, 103.8198]}
      zoom={12}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {businesses.map((business) => (
        <Marker
          key={business.id}
          position={[business.latitude, business.longitude]}
        >
          <Popup>
            <strong>{business.name}</strong>
            <br />
            {business.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

## Testing

### Manual Testing

**Test Cases:**
1. **Exact address:** "123 Orchard Road, Singapore 238858"
2. **Landmark:** "Bugis Junction, Singapore"
3. **Area name:** "Geylang, Singapore"
4. **Postal code only:** "238858, Singapore"
5. **Invalid address:** "Nonexistent Street 999"

**Expected Results:**
- Cases 1-4: Exact or approximate coordinates
- Case 5: Default Singapore center coordinates

### API Testing

```bash
# Test geocoding endpoint
curl -X POST http://localhost:3000/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address":"Bugis Junction, Singapore"}'

# Test rate limiting (run 11 times rapidly)
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/geocode \
    -H "Content-Type: application/json" \
    -d '{"address":"Test"}' &
done
wait
```

## Performance Considerations

### Rate Limiting Strategy

**OneMap API:**
- Limit: 250 requests/minute
- Strategy: 250ms delay between requests
- Burst: Can handle 10-15 rapid requests

**Nominatim API:**
- Limit: 1 request/second
- Strategy: 1000ms delay between requests
- Strict: Must comply with usage policy

**Client-Side:**
- Implement debouncing on address input
- Cache results in localStorage
- Show loading indicators

### Optimization Tips

1. **Batch Processing:**
   - Process new businesses overnight
   - Use batch script for bulk updates
   - Avoid geocoding during peak hours

2. **Caching:**
   - Store results in database immediately
   - Never geocode same address twice
   - Cache common landmarks

3. **Fallback Strategy:**
   - Always provide coordinates (never null)
   - Use area center if business address fails
   - Allow manual coordinate entry

## Troubleshooting

### Common Issues

**Issue: Rate limit exceeded**
```
Error: 429 Too Many Requests
```
Solution: Wait 1 minute, then retry. Implement exponential backoff.

**Issue: Invalid coordinates returned**
```typescript
// Validation check
if (!isInSingapore(result.latitude, result.longitude)) {
  console.warn('Coordinates outside Singapore bounds');
  // Use default or retry
}
```

**Issue: Geocoding takes too long**
- OneMap API is usually faster than Nominatim
- Check network connectivity
- Verify API endpoints are accessible

**Issue: Low accuracy**
```typescript
if (result.accuracy === 'approximate' || result.accuracy === 'default') {
  // Show warning to user
  // Allow manual coordinate entry
}
```

### Debugging

**Enable verbose logging:**
```typescript
// In geocoding.ts
console.log('OneMap response:', data);
console.log('Nominatim response:', data);
console.log('Final result:', result);
```

**Check API responses:**
```bash
# OneMap
curl "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=Bugis&returnGeom=Y"

# Nominatim
curl "https://nominatim.openstreetmap.org/search?q=Bugis,Singapore&format=json&countrycodes=sg" \
  -H "User-Agent: Singapore-Halal-Directory/1.0"
```

## Future Enhancements

### Planned Features

1. **Google Maps Geocoding API**
   - Higher accuracy than free alternatives
   - Costs $5 per 1000 requests
   - Add when budget allows

2. **Address Validation**
   - Validate Singapore postal codes
   - Suggest corrections for typos
   - Standardize address format

3. **Reverse Geocoding**
   - Convert coordinates to addresses
   - Useful for map click events
   - Auto-fill address fields

4. **Area Boundary Detection**
   - Automatically assign area based on coordinates
   - Validate business is in correct area
   - Show area coverage maps

5. **Performance Monitoring**
   - Track geocoding success rate
   - Monitor API response times
   - Alert on degraded service

## References

- **OneMap API Docs:** https://www.onemap.gov.sg/docs/
- **Nominatim Usage Policy:** https://operations.osmfoundation.org/policies/nominatim/
- **Haversine Formula:** https://en.wikipedia.org/wiki/Haversine_formula
- **WGS84 Coordinate System:** https://en.wikipedia.org/wiki/World_Geodetic_System

## Support

For issues or questions:
1. Check this guide first
2. Review error logs in console
3. Test API endpoints manually
4. Check rate limits and quotas
5. Verify environment variables are set

---

**Last Updated:** 2025-11-01
**Version:** 1.0.0
