/**
 * Bulk Geocoding Script for Singapore Halal Directory
 *
 * Purpose: Geocode existing businesses that don't have latitude/longitude coordinates
 *
 * Usage:
 *   npx ts-node scripts/bulk-geocode.ts
 *   npx tsx scripts/bulk-geocode.ts (if using tsx)
 *
 * Features:
 * - Fetches all businesses with NULL coordinates
 * - Rate limits to 1 request/second (Nominatim policy)
 * - Logs progress and results
 * - Handles errors gracefully
 * - Updates database with successful geocodes
 */

import { createClient } from '@supabase/supabase-js';
import { batchGeocode, formatAddressForGeocoding } from '../lib/geocoding';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface Business {
  id: string;
  name: string;
  address: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
}

async function main() {
  console.log('🚀 Starting bulk geocoding process...\n');

  // Fetch all businesses with NULL coordinates
  const { data: businesses, error: fetchError } = await supabase
    .from('businesses')
    .select('id, name, address, postal_code, latitude, longitude')
    .or('latitude.is.null,longitude.is.null')
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('❌ Error fetching businesses:', fetchError);
    process.exit(1);
  }

  if (!businesses || businesses.length === 0) {
    console.log('✅ All businesses already have coordinates!');
    process.exit(0);
  }

  console.log(`📍 Found ${businesses.length} businesses without coordinates\n`);

  // Prepare addresses for batch geocoding
  const addressesToGeocode = businesses.map((business: Business) => ({
    id: business.id,
    address: formatAddressForGeocoding(
      business.address,
      business.postal_code || undefined,
      'Singapore'
    ),
  }));

  // Log sample addresses
  console.log('Sample addresses to geocode:');
  addressesToGeocode.slice(0, 3).forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.address}`);
  });
  console.log('');

  // Perform batch geocoding with rate limiting
  console.log('⏳ Geocoding in progress (1 request/second)...');
  console.log('   This will take approximately', Math.ceil(businesses.length / 60), 'minutes\n');

  const results = await batchGeocode(
    addressesToGeocode,
    (current, total) => {
      const percentage = ((current / total) * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${current}/${total} (${percentage}%)`);
    }
  );

  console.log('\n\n📊 Geocoding Results:\n');

  // Separate successful and failed geocodes
  const successful = results.filter((r) => r.coordinates !== null);
  const failed = results.filter((r) => r.coordinates === null);

  console.log(`   ✅ Successful: ${successful.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  console.log('');

  // Update database with successful geocodes
  if (successful.length > 0) {
    console.log('💾 Updating database with geocoded coordinates...\n');

    let updateSuccessCount = 0;
    let updateFailCount = 0;

    for (const result of successful) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          latitude: result.coordinates!.latitude,
          longitude: result.coordinates!.longitude,
        })
        .eq('id', result.id);

      if (updateError) {
        console.error(`   ❌ Failed to update business ${result.id}:`, updateError.message);
        updateFailCount++;
      } else {
        updateSuccessCount++;
      }
    }

    console.log(`   ✅ Successfully updated: ${updateSuccessCount}`);
    console.log(`   ❌ Update failed: ${updateFailCount}`);
    console.log('');
  }

  // Log failed geocodes for manual review
  if (failed.length > 0) {
    console.log('⚠️  Failed Geocodes (requires manual review):\n');

    for (const result of failed) {
      const business = businesses.find((b: Business) => b.id === result.id);
      if (business) {
        console.log(`   Business: ${business.name}`);
        console.log(`   Address: ${business.address}`);
        console.log(`   Postal Code: ${business.postal_code || 'N/A'}`);
        console.log(`   Error: ${result.error || 'No results found'}`);
        console.log('');
      }
    }

    // Export failed addresses to CSV for manual review
    const csvContent = [
      'Business ID,Business Name,Address,Postal Code,Error',
      ...failed.map((result) => {
        const business = businesses.find((b: Business) => b.id === result.id);
        if (!business) return '';
        return `"${business.id}","${business.name}","${business.address}","${business.postal_code || ''}","${result.error || 'No results'}"`;
      }),
    ].join('\n');

    const fs = require('fs');
    const csvPath = './failed-geocodes.csv';
    fs.writeFileSync(csvPath, csvContent);
    console.log(`📄 Failed geocodes exported to: ${csvPath}\n`);
  }

  // Summary
  console.log('✅ Bulk geocoding completed!\n');
  console.log('Summary:');
  console.log(`   Total businesses: ${businesses.length}`);
  console.log(`   Successfully geocoded: ${successful.length}`);
  console.log(`   Failed to geocode: ${failed.length}`);
  console.log(`   Success rate: ${((successful.length / businesses.length) * 100).toFixed(1)}%`);
  console.log('');

  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
