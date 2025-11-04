import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured areas for quick navigation
  const { data: areas } = await supabase
    .from("areas")
    .select("id, name, slug")
    .order("name")
    .limit(12);

  // Organization schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Singapore Halal Directory",
    "description": "Singapore's most comprehensive directory of halal-certified businesses, restaurants, and services",
    "url": "https://singaporehalaldir.com",
    "logo": "https://singaporehalaldir.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "SG",
      "availableLanguage": ["English", "Malay"]
    },
    "sameAs": [
      "https://facebook.com/singaporehalaldir",
      "https://instagram.com/singaporehalaldir"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Organization Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Halal-Certified Businesses
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Browse thousands of verified halal restaurants, food establishments, and services across Singapore
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form action="/search" method="GET" className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="Search for halal businesses, areas, or cuisines..."
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">5,000+</div>
            <div className="text-gray-600">Halal Businesses</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">28</div>
            <div className="text-gray-600">Singapore Areas</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
            <div className="text-gray-600">Verified Listings</div>
          </div>
        </div>
      </section>

      {/* Browse by Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Browse by Area
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {areas?.map((area) => (
            <Link
              key={area.id}
              href={`/directory/${area.slug}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {area.name}
              </h3>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/directory"
            className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            View All Areas
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Use Our Directory?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Listings
              </h3>
              <p className="text-gray-600">
                All businesses are verified for halal certification
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Location-Based
              </h3>
              <p className="text-gray-600">
                Find halal businesses in your neighborhood
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Always Updated
              </h3>
              <p className="text-gray-600">
                Regularly updated with new businesses and information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are you a business owner?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            List your business for free or claim your existing listing on Singapore's top halal directory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit-listing"
              className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold text-lg"
            >
              Submit New Listing
            </Link>
            <Link
              href="/dashboard/claim-business"
              className="inline-block px-8 py-4 bg-emerald-700 text-white border-2 border-white rounded-lg hover:bg-emerald-800 transition-colors font-semibold text-lg"
            >
              Claim Existing Business
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">
                Singapore Halal Directory
              </h3>
              <p className="text-sm">
                Your trusted source for finding halal-certified businesses across Singapore
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/directory" className="hover:text-white">
                    Browse Directory
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white">
                    Search
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/submit-listing" className="hover:text-white">
                    Submit New Listing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/claim-business" className="hover:text-white">
                    Claim Your Business
                  </Link>
                </li>
                <li>
                  <Link href="/upgrade/featured" className="hover:text-white">
                    Get Featured
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2025 Singapore Halal Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
