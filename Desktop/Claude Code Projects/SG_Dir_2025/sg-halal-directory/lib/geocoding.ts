/**
 * Geocoding Utility for Singapore Halal Directory
 *
 * Uses OpenStreetMap Nominatim API (FREE, no API key required)
 * Rate limit: 1 request/second
 *
 * Alternative providers (paid):
 * - Google Maps Geocoding API
 * - MapBox Geocoding API
 */

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Convert address to geographic coordinates using Nominatim API
 *
 * @param address - Full address string (e.g., "123 Main St, 123456, Singapore")
 * @returns Coordinates object or null if geocoding fails
 *
 * @example
 * const coords = await getCoordinates("123 Orchard Road, 238858, Singapore");
 * if (coords) {
 *   console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
 * }
 */
export async function getCoordinates(address: string): Promise<GeoCoordinates | null> {
  try {
    // OpenStreetMap Nominatim API
    // Docs: https://nominatim.org/release-docs/latest/api/Search/
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=sg`;

    const response = await fetch(url, {
      headers: {
        // User-Agent is required by Nominatim usage policy
        'User-Agent': 'SG-Halal-Directory/1.0 (contact@example.com)',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const results = await response.json();

    // Check if we got any results
    if (!results || results.length === 0) {
      console.warn(`No geocoding results found for address: ${address}`);
      return null;
    }

    const { lat, lon } = results[0];

    // Validate coordinates are within Singapore bounds
    // Singapore latitude: ~1.15° to 1.48°N
    // Singapore longitude: ~103.6° to 104.0°E
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (
      latitude < 1.0 || latitude > 1.6 ||
      longitude < 103.5 || longitude > 104.1
    ) {
      console.warn(`Coordinates outside Singapore bounds: ${latitude}, ${longitude}`);
      // Still return the coordinates - might be valid edge case
    }

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        console.error('Geocoding request timed out after 5 seconds');
      } else {
        console.error('Geocoding error:', error.message);
      }
    } else {
      console.error('Unknown geocoding error:', error);
    }
    return null;
  }
}

/**
 * Format address for geocoding
 * Combines address components into a single search string
 *
 * @param address - Street address
 * @param postalCode - Singapore postal code
 * @param country - Country (default: "Singapore")
 * @returns Formatted address string
 */
export function formatAddressForGeocoding(
  address: string,
  postalCode?: string,
  country: string = 'Singapore'
): string {
  const parts = [address];

  if (postalCode) {
    parts.push(postalCode);
  }

  parts.push(country);

  return parts.join(', ');
}

/**
 * Calculate distance between two coordinates using Haversine formula
 *
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 *
 * @example
 * const distance = calculateDistance(
 *   { latitude: 1.3521, longitude: 103.8198 },
 *   { latitude: 1.2897, longitude: 103.8501 }
 * );
 * console.log(`Distance: ${distance.toFixed(2)} km`);
 */
export function calculateDistance(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates
): number {
  const R = 6371; // Earth's radius in kilometers

  const lat1Rad = (coord1.latitude * Math.PI) / 180;
  const lat2Rad = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Batch geocode multiple addresses with rate limiting
 * Respects Nominatim's 1 request/second rate limit
 *
 * @param addresses - Array of address objects with id and address
 * @param onProgress - Optional callback for progress updates
 * @returns Array of geocoding results
 *
 * @example
 * const results = await batchGeocode(
 *   [
 *     { id: 'abc123', address: '123 Main St, 123456, Singapore' },
 *     { id: 'def456', address: '456 Elm St, 654321, Singapore' }
 *   ],
 *   (current, total) => console.log(`Processed ${current}/${total}`)
 * );
 */
export async function batchGeocode(
  addresses: Array<{ id: string; address: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ id: string; coordinates: GeoCoordinates | null; error?: string }>> {
  const results: Array<{ id: string; coordinates: GeoCoordinates | null; error?: string }> = [];

  for (let i = 0; i < addresses.length; i++) {
    const { id, address } = addresses[i];

    try {
      const coordinates = await getCoordinates(address);
      results.push({ id, coordinates });

      if (onProgress) {
        onProgress(i + 1, addresses.length);
      }

      // Rate limiting: 1 request per second for Nominatim
      if (i < addresses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1100)); // 1.1 seconds to be safe
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({ id, coordinates: null, error: errorMessage });

      if (onProgress) {
        onProgress(i + 1, addresses.length);
      }
    }
  }

  return results;
}
