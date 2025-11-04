/**
 * Geocoding API Route
 *
 * POST /api/geocode
 *
 * Convert addresses to geographic coordinates using free geocoding services.
 * Includes rate limiting and error handling.
 *
 * Request body:
 * {
 *   "address": "123 Main Street, Singapore"
 * }
 *
 * Response:
 * {
 *   "latitude": 1.3521,
 *   "longitude": 103.8198,
 *   "accuracy": "exact" | "approximate" | "default",
 *   "provider": "nominatim" | "onemap" | "fallback",
 *   "displayName": "Full formatted address"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/utils/geocoding';

// Rate limiting: Store request timestamps per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

/**
 * Check if IP has exceeded rate limit
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Update map with valid timestamps + new request
  rateLimitMap.set(ip, [...validTimestamps, now]);

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupRateLimitMap();
  }

  return false;
}

/**
 * Clean up old rate limit entries
 */
function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validTimestamps);
    }
  }
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default (shouldn't happen in production)
  return 'unknown';
}

/**
 * POST /api/geocode
 * Geocode an address to coordinates
 */
export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Maximum 10 requests per minute. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { address } = body;

    // Validate input
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Address is required and must be a non-empty string.',
        },
        { status: 400 }
      );
    }

    if (address.length > 500) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Address must be less than 500 characters.',
        },
        { status: 400 }
      );
    }

    // Geocode the address
    const result = await geocodeAddress(address);

    // Return result
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Geocoding API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to geocode address. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/geocode
 * Return API information
 */
export async function GET() {
  return NextResponse.json(
    {
      name: 'Geocoding API',
      version: '1.0.0',
      description: 'Convert addresses to geographic coordinates',
      endpoints: {
        POST: {
          description: 'Geocode an address',
          body: {
            address: 'string (required, max 500 chars)',
          },
          response: {
            latitude: 'number',
            longitude: 'number',
            accuracy: '"exact" | "approximate" | "default"',
            provider: '"nominatim" | "onemap" | "fallback"',
            displayName: 'string (optional)',
          },
        },
      },
      rateLimit: {
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowMs: RATE_LIMIT_WINDOW,
        description: `Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute per IP address`,
      },
      providers: {
        primary: 'OneMap API (Singapore government)',
        fallback: 'Nominatim (OpenStreetMap)',
        default: 'Singapore center coordinates (1.3521, 103.8198)',
      },
    },
    { status: 200 }
  );
}
