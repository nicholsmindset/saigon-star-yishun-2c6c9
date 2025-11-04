'use server';

/**
 * Geocoding service using OneMap Singapore API (recommended for Singapore addresses)
 * Falls back to Nominatim (OpenStreetMap) if OneMap fails
 * Returns coordinates or default Singapore center on failure
 */

interface GeocodingResult {
  latitude: number;
  longitude: number;
  success: boolean;
  source?: 'onemap' | 'nominatim' | 'default';
}

// Default Singapore coordinates (Marina Bay Sands area)
const SINGAPORE_DEFAULT = {
  latitude: 1.2838,
  longitude: 103.8606,
};

/**
 * Geocode address using OneMap Singapore API
 */
async function geocodeWithOneMap(address: string): Promise<GeocodingResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodedAddress}&returnGeom=Y&getAddrDetails=Y`,
      {
        headers: {
          'User-Agent': 'Singapore Halal Directory',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.found > 0 && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: parseFloat(result.LATITUDE),
        longitude: parseFloat(result.LONGITUDE),
        success: true,
        source: 'onemap',
      };
    }

    return null;
  } catch (error) {
    console.error('OneMap geocoding error:', error);
    return null;
  }
}

/**
 * Geocode address using Nominatim (OpenStreetMap) API
 */
async function geocodeWithNominatim(address: string): Promise<GeocodingResult | null> {
  try {
    const encodedAddress = encodeURIComponent(`${address}, Singapore`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'Singapore Halal Directory',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        success: true,
        source: 'nominatim',
      };
    }

    return null;
  } catch (error) {
    console.error('Nominatim geocoding error:', error);
    return null;
  }
}

/**
 * Main geocoding function with fallback strategy
 * Priority: OneMap (Singapore-specific) → Nominatim (global) → Default center
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!address || address.trim() === '') {
    return {
      ...SINGAPORE_DEFAULT,
      success: false,
      source: 'default',
    };
  }

  // Try OneMap first (best for Singapore addresses)
  const oneMapResult = await geocodeWithOneMap(address);
  if (oneMapResult) {
    return oneMapResult;
  }

  // Fallback to Nominatim
  const nominatimResult = await geocodeWithNominatim(address);
  if (nominatimResult) {
    return nominatimResult;
  }

  // Final fallback to default Singapore center
  console.warn(`Geocoding failed for address: ${address}. Using default coordinates.`);
  return {
    ...SINGAPORE_DEFAULT,
    success: false,
    source: 'default',
  };
}

/**
 * Batch geocode multiple addresses (useful for data migration)
 * Includes rate limiting to respect API limits
 */
export async function batchGeocodeAddresses(
  addresses: Array<{ id: string; address: string }>
): Promise<Array<{ id: string; latitude: number; longitude: number; success: boolean }>> {
  const results = [];

  for (let i = 0; i < addresses.length; i++) {
    const { id, address } = addresses[i];

    // Rate limiting: 1 request per second to respect API limits
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const geocodeResult = await geocodeAddress(address);
    results.push({
      id,
      latitude: geocodeResult.latitude,
      longitude: geocodeResult.longitude,
      success: geocodeResult.success,
    });
  }

  return results;
}

/**
 * Validate coordinates are within Singapore bounds
 */
export function isWithinSingapore(latitude: number, longitude: number): boolean {
  // Singapore rough bounds
  const MIN_LAT = 1.15;
  const MAX_LAT = 1.47;
  const MIN_LNG = 103.6;
  const MAX_LNG = 104.05;

  return (
    latitude >= MIN_LAT &&
    latitude <= MAX_LAT &&
    longitude >= MIN_LNG &&
    longitude <= MAX_LNG
  );
}
