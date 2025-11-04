'use client';

/**
 * Business Detail Page Map Integration Example
 *
 * This example shows how to integrate BusinessMap on a single business detail page.
 * Use this pattern in /app/business/[id]/page.tsx
 */

import BusinessMap from '@/app/components/BusinessMap';
import { mockSingleBusiness } from '@/app/lib/mockBusinessData';

export default function BusinessDetailMapExample() {
  // In production, this data would come from Supabase
  // Example query:
  // const { data: business } = await supabase
  //   .from('businesses')
  //   .select('id, name, latitude, longitude, address, business_type, is_featured')
  //   .eq('id', params.id)
  //   .single();

  const business = mockSingleBusiness;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {business.name}
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Halal certified restaurant
              serving authentic cuisine in the heart of Singapore.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Business Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{business.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+65 1234 5678</p>
                </div>
              </div>

              {/* Business Type */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Type</p>
                  <p className="text-sm text-gray-600">{business.business_type}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Location</h4>
              <BusinessMap
                businesses={[business]}
                zoom={15}
                height="h-[250px]"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
