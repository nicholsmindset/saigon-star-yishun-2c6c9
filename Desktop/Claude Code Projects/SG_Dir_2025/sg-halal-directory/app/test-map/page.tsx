'use client';

/**
 * Map Component Test Page
 *
 * This page demonstrates all map component features with interactive examples.
 * Visit: http://localhost:3000/test-map
 */

import { useState } from 'react';
import BusinessMap from '@/app/components/BusinessMap';
import {
  mockSingleBusiness,
  mockBugisBusinesses,
  mockOrchardBusinesses,
  mockTampinesBusinesses,
  mockJurongBusinesses,
  mockLargeDataset,
  mockEmptyBusinesses,
  mockInvalidCoordinates,
  mockMixedValidInvalid,
  SINGAPORE_BOUNDS,
} from '@/app/lib/mockBusinessData';
import type { BusinessLocation } from '@/app/components/BusinessMap';

type TestCase = 'single' | 'area' | 'multiple-areas' | 'large' | 'empty' | 'invalid' | 'mixed';

export default function MapTestPage() {
  const [activeTest, setActiveTest] = useState<TestCase>('single');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Get businesses based on active test
  const getBusinesses = (): BusinessLocation[] => {
    switch (activeTest) {
      case 'single':
        return [mockSingleBusiness];
      case 'area':
        return mockBugisBusinesses;
      case 'multiple-areas':
        return [
          ...mockBugisBusinesses,
          ...mockOrchardBusinesses,
          ...mockTampinesBusinesses,
          ...mockJurongBusinesses,
        ];
      case 'large':
        return mockLargeDataset;
      case 'empty':
        return mockEmptyBusinesses;
      case 'invalid':
        return mockInvalidCoordinates;
      case 'mixed':
        return mockMixedValidInvalid;
      default:
        return [mockSingleBusiness];
    }
  };

  const businesses = getBusinesses();

  const handleMarkerClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    console.log('Marker clicked:', businessId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">BusinessMap Component Test Suite</h1>
          <p className="text-gray-600 mt-2">
            Interactive testing environment for the Leaflet map component
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Test Case Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setActiveTest('single')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'single'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Single Business
            </button>

            <button
              onClick={() => setActiveTest('area')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'area'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Area Listing
            </button>

            <button
              onClick={() => setActiveTest('multiple-areas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'multiple-areas'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Multiple Areas
            </button>

            <button
              onClick={() => setActiveTest('large')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'large'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Large Dataset
            </button>

            <button
              onClick={() => setActiveTest('empty')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'empty'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Empty Data
            </button>

            <button
              onClick={() => setActiveTest('invalid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'invalid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Invalid Data
            </button>

            <button
              onClick={() => setActiveTest('mixed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTest === 'mixed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mixed Data
            </button>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Test: {activeTest.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Businesses</p>
              <p className="text-2xl font-bold text-blue-900">{businesses.length}</p>
            </div>

            <div>
              <p className="text-sm text-blue-700 font-medium">Featured Listings</p>
              <p className="text-2xl font-bold text-blue-900">
                {businesses.filter(b => b.is_featured).length}
              </p>
            </div>

            <div>
              <p className="text-sm text-blue-700 font-medium">Selected Business</p>
              <p className="text-2xl font-bold text-blue-900">
                {selectedBusinessId ? selectedBusinessId.substring(0, 10) + '...' : 'None'}
              </p>
            </div>
          </div>

          {selectedBusinessId && (
            <button
              onClick={() => setSelectedBusinessId(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Map Display */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Map View</h2>

            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                Standard
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                Featured
              </span>
            </div>
          </div>

          <BusinessMap
            businesses={businesses}
            onMarkerClick={handleMarkerClick}
            height="h-[500px]"
            enableClustering={true}
          />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">Map Features</p>
              <ul className="text-gray-600 space-y-1">
                <li>✓ Click markers to view business info</li>
                <li>✓ Scroll to zoom, drag to pan</li>
                <li>✓ Use arrow keys for keyboard navigation</li>
                <li>✓ Featured listings show blue markers with star</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">Current Configuration</p>
              <ul className="text-gray-600 space-y-1">
                <li>Height: 500px</li>
                <li>Clustering: Enabled (threshold: 10)</li>
                <li>Tile Server: OpenStreetMap</li>
                <li>Click Handler: Active</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Business List */}
        {businesses.length > 0 && businesses.some(b => b.latitude && b.longitude && !isNaN(b.latitude)) && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Business Listings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses
                .filter(b => b.latitude && b.longitude && !isNaN(b.latitude))
                .map((business) => (
                  <div
                    key={business.id}
                    id={`business-${business.id}`}
                    className={`border rounded-lg p-4 transition-all ${
                      business.is_featured ? 'border-blue-500 border-2' : 'border-gray-200'
                    } ${
                      selectedBusinessId === business.id
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {business.name}
                      </h3>
                      {business.is_featured && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{business.business_type}</p>

                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{business.address}</p>

                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>Lat: {business.latitude.toFixed(4)}</span>
                      <span>Lng: {business.longitude.toFixed(4)}</span>
                    </div>

                    <button
                      onClick={() => handleMarkerClick(business.id)}
                      className="mt-3 w-full px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Show on Map
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Developer Info */}
        <div className="bg-gray-900 text-gray-100 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Developer Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-emerald-400">Component Props</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`<BusinessMap
  businesses={businesses}
  onMarkerClick={handleMarkerClick}
  height="h-[500px]"
  enableClustering={true}
  clusterThreshold={10}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-emerald-400">Singapore Bounds</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify(SINGAPORE_BOUNDS, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-emerald-400">Usage Notes</h3>
            <ul className="text-sm space-y-1 text-gray-300">
              <li>• Component lazy-loads Leaflet for optimal bundle size</li>
              <li>• Automatically calculates center and zoom for multiple markers</li>
              <li>• Filters out invalid coordinates (NaN, null, undefined)</li>
              <li>• Shows clustering recommendation for 10+ markers</li>
              <li>• Full accessibility support with ARIA labels and keyboard nav</li>
              <li>• Mobile-friendly with touch gesture support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
