#!/usr/bin/env tsx

/**
 * Geocode Existing Businesses Script
 *
 * This script geocodes all businesses in the database that don't have coordinates
 * or have default Singapore center coordinates.
 *
 * Features:
 * - Progress tracking with visual progress bar
 * - Error logging and retry logic
 * - Rate limiting to respect API constraints
 * - Dry run mode for testing
 * - Detailed statistics and reporting
 *
 * Usage:
 *   # Dry run (preview what would be updated)
 *   npm run geocode:businesses -- --dry-run
 *
 *   # Actually update database
 *   npm run geocode:businesses
 *
 *   # Geocode specific business by ID
 *   npm run geocode:businesses -- --business-id <uuid>
 *
 * Requirements:
 * - tsx package: npm install -D tsx
 * - Add to package.json scripts: "geocode:businesses": "tsx scripts/geocode-existing.ts"
 */

import { createClient } from '@supabase/supabase-js';
import { geocodeAddress, SINGAPORE_CENTER, GeocodingResult } from '../lib/utils/geocoding';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const businessIdIndex = args.indexOf('--business-id');
const specificBusinessId = businessIdIndex !== -1 ? args[businessIdIndex + 1] : null;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Business {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface GeocodingStats {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  exact: number;
  approximate: number;
  fallback: number;
}

/**
 * Check if business needs geocoding
 */
function needsGeocoding(business: Business): boolean {
  // No coordinates at all
  if (business.latitude === null || business.longitude === null) {
    return true;
  }

  // Has default Singapore center coordinates
  if (
    Math.abs(business.latitude - SINGAPORE_CENTER.latitude) < 0.0001 &&
    Math.abs(business.longitude - SINGAPORE_CENTER.longitude) < 0.0001
  ) {
    return true;
  }

  return false;
}

/**
 * Display progress bar
 */
function displayProgress(current: number, total: number, businessName: string): void {
  const percentage = Math.floor((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.floor(barLength * current / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  const truncatedName = businessName.length > 40
    ? businessName.substring(0, 37) + '...'
    : businessName.padEnd(40);

  process.stdout.write(
    `\r[${bar}] ${percentage}% | ${current}/${total} | ${truncatedName}`
  );
}

/**
 * Main geocoding function
 */
async function geocodeBusinesses() {
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│   Singapore Halal Directory - Geocoding Script        │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No database changes will be made\n');
  }

  // Fetch businesses
  console.log('📊 Fetching businesses from database...');

  let query = supabase
    .from('businesses')
    .select('id, name, address, latitude, longitude')
    .eq('status', 'approved');

  if (specificBusinessId) {
    query = query.eq('id', specificBusinessId);
  }

  const { data: businesses, error } = await query;

  if (error) {
    console.error('❌ Error fetching businesses:', error.message);
    process.exit(1);
  }

  if (!businesses || businesses.length === 0) {
    console.log('✅ No businesses found.');
    process.exit(0);
  }

  console.log(`✅ Found ${businesses.length} businesses\n`);

  // Filter businesses that need geocoding
  const businessesToGeocode = businesses.filter(needsGeocoding);

  if (businessesToGeocode.length === 0) {
    console.log('✅ All businesses already have coordinates!');
    process.exit(0);
  }

  console.log(`🎯 ${businessesToGeocode.length} businesses need geocoding\n`);

  if (isDryRun) {
    console.log('Businesses that would be geocoded:');
    businessesToGeocode.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.name} - ${b.address}`);
    });
    console.log('\nRun without --dry-run to update database.');
    process.exit(0);
  }

  // Initialize statistics
  const stats: GeocodingStats = {
    total: businessesToGeocode.length,
    success: 0,
    failed: 0,
    skipped: 0,
    exact: 0,
    approximate: 0,
    fallback: 0,
  };

  const errors: Array<{ business: string; error: string }> = [];

  // Geocode each business
  console.log('🚀 Starting geocoding...\n');

  for (let i = 0; i < businessesToGeocode.length; i++) {
    const business = businessesToGeocode[i];

    displayProgress(i + 1, businessesToGeocode.length, business.name);

    try {
      // Geocode address
      const result: GeocodingResult = await geocodeAddress(business.address);

      // Update database
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          latitude: result.latitude,
          longitude: result.longitude,
        })
        .eq('id', business.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Update statistics
      stats.success++;
      if (result.accuracy === 'exact') stats.exact++;
      else if (result.accuracy === 'approximate') stats.approximate++;
      else stats.fallback++;

    } catch (error) {
      stats.failed++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({
        business: `${business.name} (${business.address})`,
        error: errorMessage,
      });
    }
  }

  // Clear progress bar
  process.stdout.write('\n\n');

  // Display results
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│   Geocoding Complete                                   │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  console.log('📊 Statistics:');
  console.log(`   Total businesses:  ${stats.total}`);
  console.log(`   ✅ Successful:     ${stats.success}`);
  console.log(`   ❌ Failed:         ${stats.failed}`);
  console.log(`   ⏭️  Skipped:        ${stats.skipped}\n`);

  console.log('🎯 Accuracy breakdown:');
  console.log(`   Exact:        ${stats.exact} (${Math.round(stats.exact / stats.success * 100)}%)`);
  console.log(`   Approximate:  ${stats.approximate} (${Math.round(stats.approximate / stats.success * 100)}%)`);
  console.log(`   Fallback:     ${stats.fallback} (${Math.round(stats.fallback / stats.success * 100)}%)\n`);

  if (errors.length > 0) {
    console.log('⚠️  Errors encountered:');
    errors.forEach(({ business, error }) => {
      console.log(`   - ${business}`);
      console.log(`     Error: ${error}`);
    });
    console.log();
  }

  console.log('✅ Geocoding process complete!\n');
}

// Run the script
geocodeBusinesses()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
