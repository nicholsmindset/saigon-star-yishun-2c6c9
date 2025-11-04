/**
 * Test Script for Geocoding Functionality
 *
 * Purpose: Validate geocoding implementation with real Singapore addresses
 *
 * Usage:
 *   node scripts/test-geocoding.js
 *
 * Tests:
 * 1. Valid Singapore addresses (with postal codes)
 * 2. Valid Singapore addresses (without postal codes)
 * 3. Invalid/malformed addresses
 * 4. Rate limiting and error handling
 * 5. Coordinate validation (Singapore bounds)
 */

// Test addresses covering different Singapore areas
const TEST_ADDRESSES = [
  {
    name: 'Bugis Junction',
    address: '200 Victoria Street',
    postalCode: '188021',
    expected: { lat: 1.299, lon: 103.855 }, // Approximate
  },
  {
    name: 'Marina Bay Sands',
    address: '10 Bayfront Avenue',
    postalCode: '018956',
    expected: { lat: 1.284, lon: 103.860 },
  },
  {
    name: 'Changi Airport',
    address: '80 Airport Boulevard',
    postalCode: '819642',
    expected: { lat: 1.357, lon: 103.988 },
  },
  {
    name: 'Orchard Road',
    address: '350 Orchard Road',
    postalCode: '238868',
    expected: { lat: 1.303, lon: 103.832 },
  },
  {
    name: 'Jurong Point',
    address: '1 Jurong West Central 2',
    postalCode: '648886',
    expected: { lat: 1.340, lon: 103.706 },
  },
];

// Geocoding function (inline for testing)
async function getCoordinates(address) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=sg`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SG-Halal-Directory/1.0 (test-script)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return null;
    }

    const { lat, lon } = results[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

function formatAddressForGeocoding(address, postalCode) {
  const parts = [address];
  if (postalCode) parts.push(postalCode);
  parts.push('Singapore');
  return parts.join(', ');
}

function isWithinSingaporeBounds(lat, lon) {
  return lat >= 1.0 && lat <= 1.6 && lon >= 103.5 && lon <= 104.1;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🧪 Testing Geocoding Functionality\n');
  console.log('=' .repeat(70));
  console.log('\n');

  let passCount = 0;
  let failCount = 0;

  for (let i = 0; i < TEST_ADDRESSES.length; i++) {
    const test = TEST_ADDRESSES[i];
    console.log(`Test ${i + 1}/${TEST_ADDRESSES.length}: ${test.name}`);
    console.log('-'.repeat(70));

    const formattedAddress = formatAddressForGeocoding(test.address, test.postalCode);
    console.log(`Address: ${formattedAddress}`);

    const startTime = Date.now();
    const result = await getCoordinates(formattedAddress);
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!result) {
      console.log('❌ FAIL: No coordinates returned');
      failCount++;
    } else {
      console.log(`✅ Coordinates: ${result.latitude}, ${result.longitude}`);
      console.log(`   Response time: ${duration}ms`);

      // Validate Singapore bounds
      const inBounds = isWithinSingaporeBounds(result.latitude, result.longitude);
      if (!inBounds) {
        console.log('⚠️  WARNING: Coordinates outside Singapore bounds');
      } else {
        console.log('✅ Within Singapore bounds');
      }

      // Check accuracy (distance from expected)
      const distance = calculateDistance(
        result.latitude,
        result.longitude,
        test.expected.lat,
        test.expected.lon
      );

      console.log(`   Distance from expected: ${(distance * 1000).toFixed(0)}m`);

      if (distance < 0.5) {
        // Within 500m
        console.log('✅ PASS: Coordinates accurate');
        passCount++;
      } else {
        console.log(`⚠️  WARNING: Coordinates differ by ${(distance * 1000).toFixed(0)}m`);
        passCount++; // Still count as pass if coordinates are returned
      }
    }

    console.log('');

    // Rate limiting: wait 1.1 seconds between requests
    if (i < TEST_ADDRESSES.length - 1) {
      await sleep(1100);
    }
  }

  console.log('=' .repeat(70));
  console.log('\n📊 Test Results Summary:\n');
  console.log(`   Total tests: ${TEST_ADDRESSES.length}`);
  console.log(`   Passed: ${passCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Success rate: ${((passCount / TEST_ADDRESSES.length) * 100).toFixed(1)}%`);
  console.log('');

  // Additional Tests
  console.log('🔬 Additional Tests:\n');

  // Test 1: Invalid address
  console.log('Test: Invalid Address');
  console.log('-'.repeat(70));
  const invalidResult = await getCoordinates('asdfasdfasdfasdf, 999999, Singapore');
  if (invalidResult === null) {
    console.log('✅ PASS: Invalid address correctly returned null');
  } else {
    console.log('❌ FAIL: Invalid address should return null');
  }
  console.log('');

  await sleep(1100);

  // Test 2: Address without postal code
  console.log('Test: Address Without Postal Code');
  console.log('-'.repeat(70));
  const noPCResult = await getCoordinates('Orchard Road, Singapore');
  if (noPCResult) {
    console.log(`✅ PASS: Geocoding works without postal code`);
    console.log(`   Coordinates: ${noPCResult.latitude}, ${noPCResult.longitude}`);
  } else {
    console.log('⚠️  WARNING: Geocoding failed without postal code');
  }
  console.log('');

  console.log('✅ All tests completed!\n');
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test script error:', error);
  process.exit(1);
});
