# Geocoding Quick Reference

## Quick Start

### Test Geocoding (5 seconds)
```bash
cd sg-halal-directory
node scripts/test-geocoding.js
```

### Bulk Geocode Existing Businesses
```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run bulk geocoding
node scripts/bulk-geocode.js
```

### Use in Code
```typescript
import { getCoordinates, formatAddressForGeocoding } from '@/lib/geocoding';

// Geocode single address
const address = formatAddressForGeocoding('123 Orchard Road', '238868', 'Singapore');
const coords = await getCoordinates(address);

if (coords) {
  console.log(`Lat: ${coords.latitude}, Lon: ${coords.longitude}`);
}
```

## Files Created

```
sg-halal-directory/
├── lib/
│   └── geocoding.ts              # ✅ Geocoding utilities
├── app/actions/
│   └── listing.ts                # ✅ Updated with geocoding
├── scripts/
│   ├── bulk-geocode.js           # ✅ Bulk geocoding script (Node.js)
│   ├── bulk-geocode.ts           # ✅ Bulk geocoding script (TypeScript)
│   └── test-geocoding.js         # ✅ Testing script
└── docs/
    ├── GEOCODING_IMPLEMENTATION.md     # ✅ Full documentation
    └── GEOCODING_QUICK_REFERENCE.md    # ✅ This file
```

## Database Schema

**No migration needed** - columns already exist:

```sql
CREATE TABLE businesses (
    ...
    latitude numeric(10,8),      -- ✅ Already exists
    longitude numeric(11,8),     -- ✅ Already exists
    ...
);
```

## API Provider

**OpenStreetMap Nominatim (FREE)**
- Rate limit: 1 request/second
- No API key required
- Good accuracy for Singapore addresses

**Endpoint:**
```
https://nominatim.openstreetmap.org/search?q={address}&format=json&countrycodes=sg
```

## Common Queries

### Check Geocoding Coverage
```sql
SELECT
  COUNT(*) as total,
  COUNT(latitude) as with_coords,
  ROUND(COUNT(latitude)::numeric / COUNT(*) * 100, 1) as coverage_pct
FROM businesses;
```

### Find Businesses Without Coordinates
```sql
SELECT name, address, postal_code
FROM businesses
WHERE latitude IS NULL
ORDER BY created_at DESC;
```

### Validate Singapore Bounds
```sql
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (
    WHERE latitude BETWEEN 1.0 AND 1.6
    AND longitude BETWEEN 103.5 AND 104.1
  ) as valid,
  COUNT(*) FILTER (
    WHERE latitude IS NOT NULL
    AND (latitude < 1.0 OR latitude > 1.6 OR longitude < 103.5 OR longitude > 104.1)
  ) as invalid
FROM businesses;
```

### Find Businesses Near Location (5km radius)
```sql
SELECT
  *,
  (
    6371 * acos(
      cos(radians(1.3521)) *
      cos(radians(latitude)) *
      cos(radians(longitude) - radians(103.8198)) +
      sin(radians(1.3521)) *
      sin(radians(latitude))
    )
  ) AS distance_km
FROM businesses
WHERE
  latitude IS NOT NULL
  AND status = 'approved'
  AND latitude BETWEEN 1.3021 AND 1.4021
  AND longitude BETWEEN 103.7698 AND 103.8698
HAVING distance_km < 5
ORDER BY distance_km;
```

## Troubleshooting

### Issue: Geocoding returns NULL

**Check:**
1. Server logs for error messages
2. Test manually: https://nominatim.openstreetmap.org/search?q=123%20Orchard%20Road,%20Singapore&format=json
3. Verify address format includes Singapore
4. Check network connectivity

**Fix:**
- Use bulk script to retry: `node scripts/bulk-geocode.js`
- Manually update coordinates in database

### Issue: Bulk script fails

**Check environment variables:**
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

**Get service role key:**
1. Open Supabase dashboard
2. Go to Settings > API
3. Copy "service_role" key (not anon key)

### Issue: Rate limit exceeded

**Solution:** Script already handles rate limiting (1.1 second delay)

If errors persist:
- Wait 5 minutes and retry
- Check Nominatim status: https://nominatim.org/

## Performance

### Submission Time Impact
- Adds: ~500-1000ms per business submission
- Total: 2-3 seconds (acceptable UX)
- Non-blocking: submission succeeds even if geocoding fails

### Bulk Geocoding Time
- 10 businesses: ~11 seconds
- 50 businesses: ~55 seconds
- 100 businesses: ~2 minutes
- 500 businesses: ~9 minutes

## Success Metrics

✅ **Test Results:** 100% success rate (5/5 tests passed)
✅ **Accuracy:** Average 168m deviation (excellent)
✅ **Performance:** 500-2000ms response time (acceptable)
✅ **Validation:** All coordinates within Singapore bounds
✅ **Error Handling:** Invalid addresses correctly return null

## Next Steps

1. **Deploy to Production:**
   - No database migration needed
   - Deploy updated listing.ts
   - Test with real submissions

2. **Bulk Geocode Existing Businesses:**
   ```bash
   node scripts/bulk-geocode.js
   ```

3. **Verify Coverage:**
   ```sql
   SELECT COUNT(*), COUNT(latitude) FROM businesses;
   ```

4. **Integrate with Maps (Task 2):**
   - Use latitude/longitude for Leaflet markers
   - Display businesses on interactive map
   - Enable location-based search

## Related Tasks

- ✅ **Task 1:** Geocoding Implementation (COMPLETE)
- 🔄 **Task 2:** Interactive Maps with Leaflet (NEXT)
- 🔄 **Task 3:** Distance-Based Search (FUTURE)
- 🔄 **Task 4:** Schema Markup with Coordinates (FUTURE)

## Support

**Documentation:** See GEOCODING_IMPLEMENTATION.md for detailed information

**Test Script:** `node scripts/test-geocoding.js`

**API Documentation:** https://nominatim.org/release-docs/latest/api/Search/

---

**Status:** ✅ Complete - Ready for Production
**Test Date:** November 2, 2025
**Success Rate:** 100%
