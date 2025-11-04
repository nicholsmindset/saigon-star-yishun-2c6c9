'use client';

/**
 * Area Listing Page Map Integration Example
 *
 * This example shows how to integrate BusinessMap on area listing pages.
 * Use this pattern in /app/directory/[area]/page.tsx
 */

import { useState } from 'react';
import BusinessMap from '@/app/components/BusinessMap';
import { mockBugisBusinesses } from '@/app/lib/mockBusinessData';
import type { BusinessLocation } from '@/app/components/BusinessMap';

export default function AreaListingMapExample() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // In production, this data would come from Supabase
  // Example query:
  // const { data: businesses } = await supabase
  //   .from('businesses')
  //   .select('id, name, latitude, longitude, address, business_type, is_featured')
  //   .eq('area_id', areaId)
  //   .order('is_featured', { ascending: false })
  //   .order('name', { ascending: true });

  const businesses = mockBugisBusinesses;
  const areaName = "Bugis / Kampong Glam";

  // Handle marker click - scroll to business card
  const handleMarkerClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    // Scroll to business card
    const element = document.getElementById(`business-${businessId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add highlight effect
      element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <a href="/" className="hover:text-emerald-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/directory" className="hover:text-emerald-600">Directory</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{areaName}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Halal Businesses in {areaName}
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Discover {businesses.length} certified halal businesses in {areaName}. Browse verified listings
          with reviews, photos, and halal certification details.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
            <span className="text-2xl font-bold text-emerald-600">{businesses.length}</span>
            <span className="text-sm text-gray-600 ml-2">Total Businesses</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
            <span className="text-2xl font-bold text-blue-600">
              {businesses.filter(b => b.is_featured).length}
            </span>
            <span className="text-sm text-gray-600 ml-2">Featured</span>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Map View</h2>
          <button
            onClick={() => setSelectedBusinessId(null)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear Selection
          </button>
        </div>
        <BusinessMap
          businesses={businesses}
          zoom={14}
          height="h-[350px]"
          onMarkerClick={handleMarkerClick}
          enableClustering={true}
        />
        <p className="text-xs text-gray-500 mt-2">
          Click any marker to view business details below
        </p>
      </div>

      {/* Business Cards Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">All Businesses</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Filter
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Sort
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              isSelected={selectedBusinessId === business.id}
            />
          ))}
        </div>
      </div>

      {/* Area FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions about Halal Businesses in {areaName}
        </h2>

        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-900 py-3 border-b border-gray-200 group-open:text-emerald-600">
              What halal certifications do businesses in {areaName} have?
            </summary>
            <p className="text-gray-600 mt-3 pb-3">
              All businesses listed in our directory for {areaName} hold valid halal certifications
              from recognized Islamic authorities in Singapore, primarily MUIS (Majlis Ugama Islam Singapura).
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-900 py-3 border-b border-gray-200 group-open:text-emerald-600">
              How many halal restaurants are in {areaName}?
            </summary>
            <p className="text-gray-600 mt-3 pb-3">
              Currently, we have {businesses.filter(b => b.business_type === 'Restaurant').length} halal
              restaurants listed in {areaName}, ranging from fine dining to casual eateries.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-900 py-3 border-b border-gray-200 group-open:text-emerald-600">
              Are featured listings more reliable?
            </summary>
            <p className="text-gray-600 mt-3 pb-3">
              Featured listings have the same halal certification requirements as standard listings.
              The "Featured" badge indicates businesses that have chosen to enhance their profile
              with additional photos and prominent placement to better showcase their offerings.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

// Business Card Component
function BusinessCard({
  business,
  isSelected,
}: {
  business: BusinessLocation;
  isSelected: boolean;
}) {
  return (
    <div
      id={`business-${business.id}`}
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all ${
        business.is_featured ? 'border-2 border-blue-500' : 'border border-gray-200'
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      {/* Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-emerald-600">
        {business.is_featured && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            FEATURED
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {business.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3">{business.business_type}</p>

        <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-2">{business.address}</span>
        </div>

        {/* Halal Certified Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Halal Certified
          </div>
        </div>

        {/* CTA */}
        <a
          href={`/business/${business.id}`}
          className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          View Details
        </a>
      </div>
    </div>
  );
}
