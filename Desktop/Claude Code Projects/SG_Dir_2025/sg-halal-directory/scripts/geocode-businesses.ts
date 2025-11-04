/**
 * Geocode Businesses Script
 *
 * This script geocodes all businesses that don't have coordinates yet.
 * Run with: npx tsx scripts/geocode-businesses.ts
 *
 * Usage:
 * 1. Install tsx: npm install -D tsx
 * 2. Run: npx tsx scripts/geocode-businesses.ts
 */

import { createClient } from '@supabase/supabase-js';
import { geocodeAddress } from '../app/actions/geocoding';

// Initialize Supabase client with service role key (for admin operations)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
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

async function geocodeBusinesses() {
  console.log('🚀 Starting business geocoding...\n');

  // Fetch all businesses without coordinates
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, address, latitude, longitude')
    .or('latitude.is.null,longitude.is.null');

  if (error) {
    console.error('❌ Error fetching businesses:', error);
    return;
  }

  if (!businesses || businesses.length === 0) {
    console.log('✅ All businesses already have coordinates!');
    return;
  }

  console.log(`📍 Found ${businesses.length} businesses to geocode\n`);

  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i] as Business;

    console.log(`[${i + 1}/${businesses.length}] Processing: ${business.name}`);
    console.log(`  Address: ${business.address}`);

    // Rate limiting: Wait 1 second between requests
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      // Geocode the address
      const result = await geocodeAddress(business.address);

      if (result.success) {
        // Update business with coordinates
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            latitude: result.latitude,
            longitude: result.longitude,
          })
          .eq('id', business.id);

        if (updateError) {
          console.error(`  ❌ Failed to update database:`, updateError);
          failureCount++;
        } else {
          console.log(`  ✅ Geocoded successfully (${result.source}): ${result.latitude}, ${result.longitude}`);
          successCount++;
        }
      } else {
        console.warn(`  ⚠️  Geocoding failed, using default coordinates`);

        // Still update with default coordinates
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            latitude: result.latitude,
            longitude: result.longitude,
          })
          .eq('id', business.id);

        if (updateError) {
          console.error(`  ❌ Failed to update database:`, updateError);
          failureCount++;
        } else {
          console.log(`  ⚠️  Updated with default Singapore coordinates`);
          skippedCount++;
        }
      }
    } catch (error) {
      console.error(`  ❌ Error:`, error);
      failureCount++;
    }

    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Geocoding Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successfully geocoded: ${successCount}`);
  console.log(`⚠️  Default coordinates: ${skippedCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📝 Total processed: ${businesses.length}`);
  console.log('='.repeat(50) + '\n');
}

// Run the script
geocodeBusinesses()
  .then(() => {
    console.log('🏁 Geocoding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
