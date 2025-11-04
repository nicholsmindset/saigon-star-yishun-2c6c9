/**
 * Bulk Geocoding Script for Singapore Halal Directory (JavaScript version)
 *
 * Purpose: Geocode existing businesses that don't have latitude/longitude coordinates
 *
 * Usage:
 *   node scripts/bulk-geocode.js
 *
 * Features:
 * - Fetches all businesses with NULL coordinates
 * - Rate limits to 1 request/second (Nominatim policy)
 * - Logs progress and results
 * - Handles errors gracefully
 * - Updates database with successful geocodes
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

/**
 * Geocode a single address using Nominatim API
 */
async function getCoordinates(address) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=sg`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SG-Halal-Directory/1.0 (contact@example.com)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { error: `API error: ${response.status}` };
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return { error: 'No results found' };
    }

    const { lat, lon } = results[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Format address for geocoding
 */
function formatAddressForGeocoding(address, postalCode) {
  const parts = [address];
  if (postalCode) parts.push(postalCode);
  parts.push('Singapore');
  return parts.join(', ');
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main script execution
 */
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

  // Log sample addresses
  console.log('Sample addresses to geocode:');
  businesses.slice(0, 3).forEach((business, index) => {
    const address = formatAddressForGeocoding(business.address, business.postal_code);
    console.log(`  ${index + 1}. ${address}`);
  });
  console.log('');

  console.log('⏳ Geocoding in progress (1 request/second)...');
  console.log('   This will take approximately', Math.ceil(businesses.length / 60), 'minutes\n');

  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Process each business with rate limiting
  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i];
    const address = formatAddressForGeocoding(business.address, business.postal_code);

    const geoData = await getCoordinates(address);

    if (geoData.error) {
      results.push({
        id: business.id,
        name: business.name,
        address: business.address,
        postalCode: business.postal_code,
        error: geoData.error,
        success: false,
      });
      failCount++;
    } else {
      results.push({
        id: business.id,
        name: business.name,
        coordinates: geoData,
        success: true,
      });
      successCount++;
    }

    // Progress indicator
    const percentage = (((i + 1) / businesses.length) * 100).toFixed(1);
    process.stdout.write(`\r   Progress: ${i + 1}/${businesses.length} (${percentage}%)`);

    // Rate limiting: 1.1 seconds between requests
    if (i < businesses.length - 1) {
      await sleep(1100);
    }
  }

  console.log('\n\n📊 Geocoding Results:\n');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('');

  // Update database with successful geocodes
  const successful = results.filter((r) => r.success);

  if (successful.length > 0) {
    console.log('💾 Updating database with geocoded coordinates...\n');

    let updateSuccessCount = 0;
    let updateFailCount = 0;

    for (const result of successful) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          latitude: result.coordinates.latitude,
          longitude: result.coordinates.longitude,
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

  // Log and export failed geocodes
  const failed = results.filter((r) => !r.success);

  if (failed.length > 0) {
    console.log('⚠️  Failed Geocodes (requires manual review):\n');

    failed.slice(0, 5).forEach((result) => {
      console.log(`   Business: ${result.name}`);
      console.log(`   Address: ${result.address}`);
      console.log(`   Postal Code: ${result.postalCode || 'N/A'}`);
      console.log(`   Error: ${result.error}`);
      console.log('');
    });

    if (failed.length > 5) {
      console.log(`   ... and ${failed.length - 5} more failed geocodes\n`);
    }

    // Export failed addresses to CSV
    const csvContent = [
      'Business ID,Business Name,Address,Postal Code,Error',
      ...failed.map((result) =>
        `"${result.id}","${result.name}","${result.address}","${result.postalCode || ''}","${result.error}"`
      ),
    ].join('\n');

    const csvPath = './failed-geocodes.csv';
    fs.writeFileSync(csvPath, csvContent);
    console.log(`📄 Failed geocodes exported to: ${csvPath}\n`);
  }

  // Summary
  console.log('✅ Bulk geocoding completed!\n');
  console.log('Summary:');
  console.log(`   Total businesses: ${businesses.length}`);
  console.log(`   Successfully geocoded: ${successCount}`);
  console.log(`   Failed to geocode: ${failCount}`);
  console.log(`   Success rate: ${((successCount / businesses.length) * 100).toFixed(1)}%`);
  console.log('');

  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
