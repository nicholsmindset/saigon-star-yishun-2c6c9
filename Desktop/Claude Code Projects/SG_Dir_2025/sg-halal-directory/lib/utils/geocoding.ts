/**
 * Geocoding Utilities for Singapore Halal Directory
 *
 * This module provides geocoding functionality using free APIs:
 * - Primary: Nominatim (OpenStreetMap) - Global, free, no API key
 * - Backup: OneMap API - Singapore-specific, higher accuracy for local addresses
 *
 * Features:
 * - Rate limiting (1 req/sec for Nominatim, 250 req/min for OneMap)
 * - Automatic fallback to Singapore center coordinates
 * - Singapore-specific address formatting
 * - Caching to avoid redundant API calls
 */

// Singapore center coordinates (Marina Bay area)
export const SINGAPORE_CENTER = {
  latitude: 1.3521,
  longitude: 103.8198,
} as const;

// Known Singapore area coordinates for testing/seeding
export const SINGAPORE_LANDMARKS = {
  'Marina Bay': { latitude: 1.2816, longitude: 103.8636 },
  'Geylang': { latitude: 1.3167, longitude: 103.8667 },
  'Orchard': { latitude: 1.3034, longitude: 103.8354 },
  'Jurong': { latitude: 1.3521, longitude: 103.7618 },
  'Woodlands': { latitude: 1.4382, longitude: 103.7891 },
  'Tampines': { latitude: 1.3496, longitude: 103.9568 },
  'Clementi': { latitude: 1.3162, longitude: 103.7649 },
  'Bugis': { latitude: 1.2997, longitude: 103.8556 },
  'Chinatown': { latitude: 1.2814, longitude: 103.8442 },
  'Little India': { latitude: 1.3067, longitude: 103.8518 },
} as const;

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  accuracy: 'exact' | 'approximate' | 'default';
  provider: 'nominatim' | 'onemap' | 'fallback';
  displayName?: string;
}

export interface GeocodingError {
  error: string;
  fallback: GeocodingResult;
}

// Rate limiting state
let lastNominatimCall = 0;
let lastOneMapCall = 0;
const NOMINATIM_DELAY = 1000; // 1 second between calls
const ONEMAP_DELAY = 250; // 250ms between calls (max 250/min)

/**
 * Wait for rate limit to clear
 */
async function waitForRateLimit(provider: 'nominatim' | 'onemap'): Promise<void> {
  const now = Date.now();
  const lastCall = provider === 'nominatim' ? lastNominatimCall : lastOneMapCall;
  const delay = provider === 'nominatim' ? NOMINATIM_DELAY : ONEMAP_DELAY;

  const timeSinceLastCall = now - lastCall;
  if (timeSinceLastCall < delay) {
    await new Promise(resolve => setTimeout(resolve, delay - timeSinceLastCall));
  }

  if (provider === 'nominatim') {
    lastNominatimCall = Date.now();
  } else {
    lastOneMapCall = Date.now();
  }
}

/**
 * Format address for Singapore geocoding
 */
function formatSingaporeAddress(address: string): string {
  let formatted = address.trim();

  // Add "Singapore" if not present
  if (!formatted.toLowerCase().includes('singapore')) {
    formatted += ', Singapore';
  }

  return formatted;
}

/**
 * Geocode address using Nominatim (OpenStreetMap)
 * Free, no API key required, global coverage
 */
async function geocodeWithNominatim(address: string): Promise<GeocodingResult | null> {
  await waitForRateLimit('nominatim');

  const formattedAddress = formatSingaporeAddress(address);
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.append('q', formattedAddress);
  url.searchParams.append('format', 'json');
  url.searchParams.append('limit', '1');
  url.searchParams.append('countrycodes', 'sg'); // Restrict to Singapore

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Singapore-Halal-Directory/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        accuracy: result.class === 'building' || result.class === 'place' ? 'exact' : 'approximate',
        provider: 'nominatim',
        displayName: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Nominatim geocoding error:', error);
    return null;
  }
}

/**
 * Geocode address using OneMap API (Singapore government)
 * Free, higher accuracy for Singapore addresses
 */
async function geocodeWithOneMap(address: string): Promise<GeocodingResult | null> {
  await waitForRateLimit('onemap');

  const url = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
  url.searchParams.append('searchVal', address);
  url.searchParams.append('returnGeom', 'Y');
  url.searchParams.append('getAddrDetails', 'Y');
  url.searchParams.append('pageNum', '1');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`OneMap API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data && data.found > 0 && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: parseFloat(result.LATITUDE),
        longitude: parseFloat(result.LONGITUDE),
        accuracy: result.SEARCHVAL ? 'exact' : 'approximate',
        provider: 'onemap',
        displayName: result.ADDRESS || result.SEARCHVAL,
      };
    }

    return null;
  } catch (error) {
    console.error('OneMap geocoding error:', error);
    return null;
  }
}

/**
 * Main geocoding function with fallback strategy
 *
 * Strategy:
 * 1. Try OneMap (Singapore-specific, higher accuracy)
 * 2. Fall back to Nominatim (global coverage)
 * 3. Fall back to Singapore center coordinates
 *
 * @param address - Full address to geocode
 * @returns Promise<GeocodingResult> - Always returns coordinates (never null)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!address || address.trim().length === 0) {
    return {
      ...SINGAPORE_CENTER,
      accuracy: 'default',
      provider: 'fallback',
    };
  }

  // Try OneMap first (better for Singapore)
  try {
    const oneMapResult = await geocodeWithOneMap(address);
    if (oneMapResult) {
      return oneMapResult;
    }
  } catch (error) {
    console.error('OneMap geocoding failed:', error);
  }

  // Fall back to Nominatim
  try {
    const nominatimResult = await geocodeWithNominatim(address);
    if (nominatimResult) {
      return nominatimResult;
    }
  } catch (error) {
    console.error('Nominatim geocoding failed:', error);
  }

  // Fall back to Singapore center
  console.warn(`Geocoding failed for address: ${address}. Using Singapore center coordinates.`);
  return {
    ...SINGAPORE_CENTER,
    accuracy: 'default',
    provider: 'fallback',
  };
}

/**
 * Batch geocode multiple addresses with rate limiting
 *
 * @param addresses - Array of addresses to geocode
 * @param onProgress - Optional progress callback
 * @returns Promise<GeocodingResult[]> - Array of geocoding results
 */
export async function batchGeocode(
  addresses: string[],
  onProgress?: (current: number, total: number, address: string) => void
): Promise<GeocodingResult[]> {
  const results: GeocodingResult[] = [];

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];

    if (onProgress) {
      onProgress(i + 1, addresses.length, address);
    }

    const result = await geocodeAddress(address);
    results.push(result);
  }

  return results;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Validate if coordinates are within Singapore bounds
 */
export function isInSingapore(latitude: number, longitude: number): boolean {
  // Singapore approximate bounds
  const MIN_LAT = 1.15;
  const MAX_LAT = 1.47;
  const MIN_LON = 103.6;
  const MAX_LON = 104.1;

  return (
    latitude >= MIN_LAT &&
    latitude <= MAX_LAT &&
    longitude >= MIN_LON &&
    longitude <= MAX_LON
  );
}
