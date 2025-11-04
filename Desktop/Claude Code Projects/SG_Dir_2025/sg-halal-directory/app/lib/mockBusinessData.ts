import { BusinessLocation } from '@/app/components/BusinessMap';

/**
 * Mock Business Data for Testing BusinessMap Component
 *
 * These are real Singapore coordinates for testing purposes.
 * Production data will come from Supabase database with actual business coordinates.
 */

// Singapore area bounding box for reference
export const SINGAPORE_BOUNDS = {
  north: 1.4707,
  south: 1.1496,
  east: 104.0930,
  west: 103.6059,
  center: [1.3521, 103.8198] as [number, number], // Singapore center
};

// Mock businesses for single business detail page testing
export const mockSingleBusiness: BusinessLocation = {
  id: 'mock-1',
  name: 'Halal Restaurant Singapore',
  latitude: 1.3521,
  longitude: 103.8198,
  address: '1 Marina Bay Sands, Singapore 018956',
  business_type: 'Restaurant',
  is_featured: false,
};

// Mock businesses for area listing page testing (Bugis area)
export const mockBugisBusinesses: BusinessLocation[] = [
  {
    id: 'bugis-1',
    name: 'Bugis Halal Café',
    latitude: 1.2990,
    longitude: 103.8558,
    address: '200 Victoria Street, Singapore 188021',
    business_type: 'Café',
    is_featured: true,
  },
  {
    id: 'bugis-2',
    name: 'Kampong Glam Bistro',
    latitude: 1.3025,
    longitude: 103.8590,
    address: '42 Arab Street, Singapore 199741',
    business_type: 'Restaurant',
    is_featured: false,
  },
  {
    id: 'bugis-3',
    name: 'Sultan Mosque Food Court',
    latitude: 1.3028,
    longitude: 103.8585,
    address: '3 Muscat Street, Singapore 198833',
    business_type: 'Food Court',
    is_featured: true,
  },
  {
    id: 'bugis-4',
    name: 'Halal Corner Store',
    latitude: 1.2985,
    longitude: 103.8545,
    address: '230 Bain Street, Singapore 180230',
    business_type: 'Grocery',
    is_featured: false,
  },
  {
    id: 'bugis-5',
    name: 'Malay Heritage Centre Café',
    latitude: 1.3020,
    longitude: 103.8595,
    address: '85 Sultan Gate, Singapore 198501',
    business_type: 'Café',
    is_featured: false,
  },
];

// Mock businesses for Orchard Road area
export const mockOrchardBusinesses: BusinessLocation[] = [
  {
    id: 'orchard-1',
    name: 'Orchard Central Halal Food',
    latitude: 1.3010,
    longitude: 103.8395,
    address: '181 Orchard Road, Singapore 238896',
    business_type: 'Restaurant',
    is_featured: true,
  },
  {
    id: 'orchard-2',
    name: 'Halal Delights ION',
    latitude: 1.3041,
    longitude: 103.8332,
    address: '2 Orchard Turn, Singapore 238801',
    business_type: 'Food Court',
    is_featured: false,
  },
  {
    id: 'orchard-3',
    name: 'Wisma Halal Kitchen',
    latitude: 1.3038,
    longitude: 103.8350,
    address: '435 Orchard Road, Singapore 238877',
    business_type: 'Restaurant',
    is_featured: true,
  },
];

// Mock businesses for Tampines area (East Singapore)
export const mockTampinesBusinesses: BusinessLocation[] = [
  {
    id: 'tampines-1',
    name: 'Tampines Mall Food Court',
    latitude: 1.3525,
    longitude: 103.9447,
    address: '4 Tampines Central 5, Singapore 529510',
    business_type: 'Food Court',
    is_featured: false,
  },
  {
    id: 'tampines-2',
    name: 'Century Square Halal Café',
    latitude: 1.3518,
    longitude: 103.9433,
    address: '2 Tampines Central 5, Singapore 529509',
    business_type: 'Café',
    is_featured: true,
  },
  {
    id: 'tampines-3',
    name: 'Tampines Hub Restaurant',
    latitude: 1.3543,
    longitude: 103.9401,
    address: '1 Tampines Walk, Singapore 528523',
    business_type: 'Restaurant',
    is_featured: false,
  },
];

// Mock businesses for Jurong area (West Singapore)
export const mockJurongBusinesses: BusinessLocation[] = [
  {
    id: 'jurong-1',
    name: 'JEM Halal Kitchen',
    latitude: 1.3333,
    longitude: 103.7436,
    address: '50 Jurong Gateway Road, Singapore 608549',
    business_type: 'Food Court',
    is_featured: true,
  },
  {
    id: 'jurong-2',
    name: 'Westgate Halal Bistro',
    latitude: 1.3337,
    longitude: 103.7425,
    address: '3 Gateway Drive, Singapore 608532',
    business_type: 'Restaurant',
    is_featured: false,
  },
  {
    id: 'jurong-3',
    name: 'IMM Building Food Court',
    latitude: 1.3276,
    longitude: 103.7464,
    address: '2 Jurong East Street 21, Singapore 609601',
    business_type: 'Food Court',
    is_featured: false,
  },
];

// Large dataset for testing clustering (50+ markers)
export const mockLargeDataset: BusinessLocation[] = [
  ...mockBugisBusinesses,
  ...mockOrchardBusinesses,
  ...mockTampinesBusinesses,
  ...mockJurongBusinesses,
  // Add more duplicates with slight coordinate variations to test clustering
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `cluster-test-${i}`,
    name: `Test Business ${i + 1}`,
    latitude: 1.3521 + (Math.random() - 0.5) * 0.1,
    longitude: 103.8198 + (Math.random() - 0.5) * 0.1,
    address: `${i + 1} Test Street, Singapore`,
    business_type: i % 3 === 0 ? 'Restaurant' : i % 3 === 1 ? 'Café' : 'Food Court',
    is_featured: i % 5 === 0,
  })),
];

// Test cases for edge cases
export const mockEmptyBusinesses: BusinessLocation[] = [];

export const mockInvalidCoordinates: BusinessLocation[] = [
  {
    id: 'invalid-1',
    name: 'Invalid Business',
    latitude: NaN,
    longitude: NaN,
    address: 'Invalid Address',
    business_type: 'Restaurant',
    is_featured: false,
  },
];

export const mockMixedValidInvalid: BusinessLocation[] = [
  ...mockBugisBusinesses.slice(0, 2),
  {
    id: 'mixed-invalid',
    name: 'Invalid Coordinates',
    latitude: NaN,
    longitude: 103.8585,
    address: 'Partial Invalid',
    business_type: 'Café',
    is_featured: false,
  },
  ...mockBugisBusinesses.slice(2),
];

/**
 * Helper function to get mock businesses by area
 */
export function getMockBusinessesByArea(areaSlug: string): BusinessLocation[] {
  const areaMap: Record<string, BusinessLocation[]> = {
    bugis: mockBugisBusinesses,
    orchard: mockOrchardBusinesses,
    tampines: mockTampinesBusinesses,
    jurong: mockJurongBusinesses,
  };

  return areaMap[areaSlug.toLowerCase()] || mockBugisBusinesses;
}

/**
 * Helper function to generate random Singapore coordinates
 */
export function generateRandomSingaporeCoordinate(): [number, number] {
  const lat = SINGAPORE_BOUNDS.south + Math.random() * (SINGAPORE_BOUNDS.north - SINGAPORE_BOUNDS.south);
  const lng = SINGAPORE_BOUNDS.west + Math.random() * (SINGAPORE_BOUNDS.east - SINGAPORE_BOUNDS.west);
  return [lat, lng];
}
