import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Browse All Areas - Singapore Halal Directory",
  description: "Browse halal-certified businesses across all Singapore areas. Find restaurants, food establishments, and services in your neighborhood.",
};

export default async function DirectoryPage() {
  const supabase = await createClient();

  // Fetch all areas ordered by name
  const { data: areas, error } = await supabase
    .from("areas")
    .select("id, name, slug, description")
    .order("name");

  if (error) {
    console.error("Error fetching areas:", error);
  }

  // BreadcrumbList schema for SEO
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
        "name": "Directory",
        "item": "https://singaporehalaldir.com/directory"
      }
    ]
  };

  // ItemList schema for SEO
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Singapore Areas",
    "description": "Browse halal-certified businesses across all Singapore areas",
    "numberOfItems": areas?.length || 0,
    "itemListElement": areas?.map((area, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Place",
        "name": area.name,
        "url": `https://singaporehalaldir.com/directory/${area.slug}`,
        "description": area.description || `Halal businesses in ${area.name}`
      }
    })) || []
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Directory</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Browse All Areas
          </h2>
          <p className="text-xl text-gray-600">
            Explore halal-certified businesses in all Singapore neighborhoods
          </p>
        </div>

        {/* Areas Grid */}
        {areas && areas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/directory/${area.slug}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {area.name}
                </h3>
                {area.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {area.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              No areas found. Please check back later.
            </p>
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
