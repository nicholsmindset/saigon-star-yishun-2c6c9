/**
 * Geocoding Setup Verification Script
 *
 * Purpose: Verify all geocoding components are properly installed and configured
 *
 * Usage: node scripts/verify-geocoding-setup.js
 *
 * Checks:
 * - Required files exist
 * - Database schema has latitude/longitude columns
 * - Geocoding API is accessible
 * - Environment variables are set (for bulk operations)
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Geocoding Setup...\n');
console.log('=' .repeat(70));
console.log('\n');

let allChecksPass = true;

// Check 1: Required Files
console.log('📁 Check 1: Required Files\n');
console.log('-'.repeat(70));

const requiredFiles = [
  {
    path: 'lib/geocoding.ts',
    description: 'Core geocoding utilities',
  },
  {
    path: 'app/actions/listing.ts',
    description: 'Server action with geocoding integration',
  },
  {
    path: 'scripts/bulk-geocode.js',
    description: 'Bulk geocoding script (Node.js)',
  },
  {
    path: 'scripts/test-geocoding.js',
    description: 'Testing script',
  },
];

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file.path);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file.path}`);
    console.log(`   ${file.description}`);
  } else {
    console.log(`❌ ${file.path}`);
    console.log(`   MISSING: ${file.description}`);
    allChecksPass = false;
  }
});

console.log('');

// Check 2: Database Schema
console.log('📊 Check 2: Database Schema\n');
console.log('-'.repeat(70));

const schemaPath = path.join(
  process.cwd(),
  '../supabase/migrations/20251031090527_initial_schema.sql'
);

if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const hasLatitude = schemaContent.includes('latitude numeric(10,8)');
  const hasLongitude = schemaContent.includes('longitude numeric(11,8)');

  if (hasLatitude && hasLongitude) {
    console.log('✅ Database schema has latitude/longitude columns');
    console.log('   latitude: numeric(10,8)');
    console.log('   longitude: numeric(11,8)');
  } else {
    console.log('❌ Database schema missing coordinate columns');
    console.log('   Run migration to add latitude/longitude columns');
    allChecksPass = false;
  }
} else {
  console.log('⚠️  Cannot verify database schema (migration file not found)');
  console.log('   Expected: supabase/migrations/20251031090527_initial_schema.sql');
}

console.log('');

// Check 3: Nominatim API Accessibility
console.log('🌐 Check 3: Nominatim API Accessibility\n');
console.log('-'.repeat(70));

async function checkNominatimAPI() {
  try {
    const testAddress = 'Singapore';
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(testAddress)}&format=json&limit=1`;

    console.log('Testing API endpoint...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SG-Halal-Directory/1.0 (verification-script)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        console.log('✅ Nominatim API is accessible');
        console.log('   Status: 200 OK');
        console.log('   Response time: ' + response.headers.get('x-response-time') || 'N/A');
      } else {
        console.log('⚠️  API returned empty results');
        console.log('   This may indicate rate limiting or API issues');
      }
    } else {
      console.log(`❌ API returned error: ${response.status} ${response.statusText}`);
      allChecksPass = false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('❌ API request timed out (>5 seconds)');
    } else {
      console.log(`❌ API request failed: ${error.message}`);
    }
    allChecksPass = false;
  }

  console.log('');
}

// Check 4: Environment Variables (for bulk operations)
console.log('🔑 Check 4: Environment Variables (Optional for Bulk Operations)\n');
console.log('-'.repeat(70));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set');
  console.log(`   Value: ${supabaseUrl.substring(0, 30)}...`);
} else {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL not set');
  console.log('   Required for bulk geocoding script');
  console.log('   Not required for development server');
}

if (supabaseKey) {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY is set');
  console.log(`   Value: ${supabaseKey.substring(0, 20)}...`);
} else {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not set');
  console.log('   Required for bulk geocoding script');
  console.log('   Not required for development server');
}

console.log('');

// Check 5: Documentation
console.log('📚 Check 5: Documentation\n');
console.log('-'.repeat(70));

const docFiles = [
  {
    path: '../GEOCODING_IMPLEMENTATION.md',
    description: 'Full technical documentation',
  },
  {
    path: '../GEOCODING_QUICK_REFERENCE.md',
    description: 'Quick reference guide',
  },
  {
    path: '../TASK_1_GEOCODING_COMPLETE.md',
    description: 'Task completion summary',
  },
];

docFiles.forEach((file) => {
  const docPath = path.join(process.cwd(), file.path);
  const exists = fs.existsSync(docPath);

  if (exists) {
    console.log(`✅ ${file.description}`);
  } else {
    console.log(`⚠️  ${file.description} not found`);
    console.log(`   Expected: ${file.path}`);
  }
});

console.log('');

// Run async checks
async function runAsyncChecks() {
  await checkNominatimAPI();

  // Final Summary
  console.log('=' .repeat(70));
  console.log('\n📋 Verification Summary\n');

  if (allChecksPass) {
    console.log('✅ All critical checks passed!');
    console.log('\nGeocoding implementation is ready for use.');
    console.log('\nNext steps:');
    console.log('  1. Run tests: node scripts/test-geocoding.js');
    console.log('  2. Test business submission in dev server');
    console.log('  3. Deploy to production');
    console.log('  4. Run bulk geocoding: node scripts/bulk-geocode.js');
  } else {
    console.log('❌ Some checks failed. Please review errors above.');
    console.log('\nCommon issues:');
    console.log('  - Missing files: Re-run geocoding implementation');
    console.log('  - API errors: Check network connectivity');
    console.log('  - Schema issues: Run database migrations');
  }

  console.log('');
}

runAsyncChecks();
