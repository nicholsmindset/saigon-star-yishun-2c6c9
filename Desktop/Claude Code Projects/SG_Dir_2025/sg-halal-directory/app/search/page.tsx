import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import Header from "@/components/Header";

interface SearchPageProps {
  searchParams: {
    q?: string;
    area?: string;
    type?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || "";
  const areaFilter = searchParams.area || "";
  const typeFilter = searchParams.type || "";

  let title = "Search Halal Businesses - Singapore Halal Directory";
  let description = "Search for halal-certified businesses across Singapore. Find restaurants, food establishments, and services by name, location, or cuisine type.";

  if (query) {
    title = `Search Results for "${query}" - Singapore Halal Directory`;
    description = `Find halal-certified businesses matching "${query}" in Singapore. Browse verified listings with reviews, photos, and certification details.`;
  } else if (areaFilter) {
    title = `Halal Businesses in ${areaFilter} - Singapore Halal Directory`;
    description = `Search halal-certified businesses in ${areaFilter}, Singapore. Find restaurants, cafes, and more with verified halal certification.`;
  } else if (typeFilter) {
    title = `Halal ${typeFilter} in Singapore - Singapore Halal Directory`;
    description = `Find halal-certified ${typeFilter} businesses across Singapore. Browse verified listings with photos and certification details.`;
  }

  const searchUrl = new URL("https://singaporehalaldir.com/search");
  if (query) searchUrl.searchParams.set("q", query);
  if (areaFilter) searchUrl.searchParams.set("area", areaFilter);
  if (typeFilter) searchUrl.searchParams.set("type", typeFilter);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: searchUrl.toString(),
      siteName: "Singapore Halal Directory",
      type: "website",
    },
    alternates: {
      canonical: searchUrl.toString(),
    },
    robots: {
      index: false, // Avoid duplicate content issues with search results
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient();
  const query = searchParams.q || "";
  const areaFilter = searchParams.area || "";
  const typeFilter = searchParams.type || "";

  // Fetch all areas for filter dropdown
  const { data: areas } = await supabase
    .from("areas")
    .select("id, name, slug")
    .order("name");

  // Build search query
  let businessQuery = supabase
    .from("businesses")
    .select(`
      id,
      name,
      business_type,
      address,
      description,
      is_featured,
      areas (id, name, slug)
    `)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  // Apply search filters
  if (query) {
    businessQuery = businessQuery.or(
      `name.ilike.%${query}%,business_type.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`
    );
  }

  if (areaFilter) {
    businessQuery = businessQuery.eq("areas.slug", areaFilter);
  }

  if (typeFilter) {
    businessQuery = businessQuery.ilike("business_type", `%${typeFilter}%`);
  }

  const { data: businesses, error } = await businessQuery;

  if (error) {
    console.error("Error fetching search results:", error);
  }

  const resultCount = businesses?.length || 0;
  const featuredCount = businesses?.filter(b => b.is_featured).length || 0;

  // Get unique business types for filter
  const { data: allBusinesses } = await supabase
    .from("businesses")
    .select("business_type")
    .order("business_type");

  const uniqueTypes = Array.from(
    new Set(allBusinesses?.map(b => b.business_type).filter(Boolean))
  ).sort();

  // Generate BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://singaporehalaldir.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Search",
        "item": "https://singaporehalaldir.com/search"
      }
    ]
  };

  // Generate SearchResultsPage Schema with SearchAction
  const searchResultsSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "url": "https://singaporehalaldir.com/search",
    "name": query ? `Search Results for "${query}"` : "Search Halal Businesses",
    "description": "Search for halal-certified businesses across Singapore",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://singaporehalaldir.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Generate ItemList Schema for search results
  const itemListSchema = businesses && businesses.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": query ? `Halal Businesses Search Results for "${query}"` : "Halal Businesses Search Results",
    "description": query
      ? `Search results for "${query}" - ${resultCount} halal-certified businesses found`
      : `Search results - ${resultCount} halal-certified businesses found`,
    "numberOfItems": resultCount,
    "itemListElement": businesses.map((business, index) => {
      const areaData = Array.isArray(business.areas) ? business.areas[0] : business.areas;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "@id": `https://singaporehalaldir.com/business/${business.id}`,
          "name": business.name,
          "url": `https://singaporehalaldir.com/business/${business.id}`,
          "description": business.description || `Halal ${business.business_type} in Singapore`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address,
            "addressLocality": areaData?.name || "Singapore",
            "addressCountry": "SG"
          },
          ...(business.business_type && {
            "servesCuisine": business.business_type
          }),
          "additionalType": business.is_featured ? "FeaturedListing" : "StandardListing"
        }
      };
    })
  } : {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": query ? `Halal Businesses Search Results for "${query}"` : "Halal Businesses Search Results",
    "description": query
      ? `No results found for "${query}"`
      : "No search results",
    "numberOfItems": 0,
    "itemListElement": []
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      {/* Schema Markup - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Schema Markup - SearchResultsPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchResultsSchema) }}
      />

      {/* Schema Markup - ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Search</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Halal Businesses
          </h1>
          {query && (
            <p className="text-xl text-gray-600">
              Showing results for: <span className="font-semibold text-emerald-600">&quot;{query}&quot;</span>
            </p>
          )}
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form method="GET" action="/search" className="space-y-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by name, type, or keyword
              </label>
              <input
                type="text"
                id="search"
                name="q"
                defaultValue={query}
                placeholder="e.g., Restaurant, Nasi Lemak, Bugis..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Area Filter */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Area
                </label>
                <select
                  id="area"
                  name="area"
                  defaultValue={areaFilter}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">All Areas</option>
                  {areas?.map((area) => (
                    <option key={area.id} value={area.slug}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Type Filter */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Type
                </label>
                <select
                  id="type"
                  name="type"
                  defaultValue={typeFilter}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Search
              </button>
              <Link
                href="/search"
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Clear Filters
              </Link>
            </div>
          </form>
        </div>

        {/* Search Statistics */}
        {(query || areaFilter || typeFilter) && (
          <div className="mb-6">
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{resultCount}</span> {resultCount === 1 ? 'Result' : 'Results'}
              </div>
              {featuredCount > 0 && (
                <div>
                  <span className="font-semibold text-blue-600">{featuredCount}</span> Featured
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/business/${business.id}`}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all ${
                  business.is_featured ? 'border-2 border-blue-500 relative' : ''
                }`}
              >
                {business.is_featured && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {business.name}
                </h2>
                <p className="text-sm text-emerald-600 mb-2">
                  {business.business_type}
                </p>
                {business.areas && (
                  <p className="text-xs text-gray-500 mb-2">
                    📍 {Array.isArray(business.areas) ? business.areas[0]?.name : (business.areas as any)?.name}
                  </p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {business.description || business.address}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h2>
            <p className="text-gray-600 mb-6">
              {query
                ? `We couldn't find any businesses matching "${query}". Try different keywords or filters.`
                : "Start searching to discover halal-certified businesses across Singapore."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/directory"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Browse All Areas
              </Link>
              <Link
                href="/search"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Clear Search
              </Link>
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!query && !areaFilter && !typeFilter && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Searches
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/search?q=restaurant"
                className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-center font-medium"
              >
                Restaurants
              </Link>
              <Link
                href="/search?q=cafe"
                className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-center font-medium"
              >
                Cafes
              </Link>
              <Link
                href="/search?q=bakery"
                className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-center font-medium"
              >
                Bakeries
              </Link>
              <Link
                href="/search?q=catering"
                className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-center font-medium"
              >
                Catering
              </Link>
              <Link
                href="/search?area=bugis"
                className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
              >
                Bugis
              </Link>
              <Link
                href="/search?area=orchard"
                className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
              >
                Orchard
              </Link>
              <Link
                href="/search?area=marina-bay"
                className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
              >
                Marina Bay
              </Link>
              <Link
                href="/search?area=chinatown"
                className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
              >
                Chinatown
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
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
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
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
