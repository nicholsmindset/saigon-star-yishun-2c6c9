import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { createItemListSchema, createBreadcrumbSchema, createFAQSchema, type ItemListSchema, type BreadcrumbListSchema, type FAQPageSchema } from "@/types/schema";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all areas
export async function generateStaticParams() {
  const supabase = await createClient();
  const { data: areas } = await supabase.from("areas").select("slug");

  return areas?.map((area) => ({
    slug: area.slug,
  })) ?? [];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: area } = await supabase
    .from("areas")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!area) {
    return {
      title: "Area Not Found - Singapore Halal Directory",
    };
  }

  return {
    title: `Halal Businesses in ${area.name} - Singapore Halal Directory`,
    description: area.description || `Discover certified halal businesses in ${area.name}. Browse verified listings with reviews, photos, and halal certification details.`,
  };
}

export default async function AreaPage({ params }: PageProps) {
  const supabase = await createClient();

  // Fetch area data
  const { data: area, error: areaError } = await supabase
    .from("areas")
    .select("id, name, slug, description")
    .eq("slug", params.slug)
    .single();

  if (areaError || !area) {
    notFound();
  }

  // Fetch businesses for this area with geo coordinates, featured listings first
  const { data: businesses, error: businessesError } = await supabase
    .from("businesses")
    .select("id, name, business_type, address, is_featured, latitude, longitude, description")
    .eq("area_id", area.id)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (businessesError) {
    console.error("Error fetching businesses:", businessesError);
  }

  // Get unique business types in this area for internal linking
  const businessTypes = Array.from(new Set(businesses?.map(b => b.business_type) || [])).slice(0, 6);

  // Fetch related/nearby areas for internal linking (limit to 6)
  const { data: relatedAreas } = await supabase
    .from("areas")
    .select("id, name, slug")
    .neq("id", area.id)
    .order("name")
    .limit(6);

  const businessCount = businesses?.length || 0;
  const featuredCount = businesses?.filter(b => b.is_featured).length || 0;

  // BreadcrumbList schema for SEO
  const breadcrumbSchema: BreadcrumbListSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://singaporehalaldir.com" },
    { name: "Directory", url: "https://singaporehalaldir.com/directory" },
    { name: area.name, url: `https://singaporehalaldir.com/directory/${area.slug}` }
  ]);

  // ItemList schema for businesses with geo coordinates
  const itemListSchema: ItemListSchema = createItemListSchema({
    name: `Halal Businesses in ${area.name}`,
    description: area.description || `Discover certified halal businesses in ${area.name}`,
    items: businesses?.map((business) => ({
      name: business.name,
      url: `https://singaporehalaldir.com/business/${business.id}`,
      address: business.address,
      addressLocality: area.name,
      latitude: business.latitude,
      longitude: business.longitude,
      description: business.description || undefined,
    })) || []
  });

  // Area-specific FAQs with schema markup
  const faqs = [
    {
      question: `What halal certifications do businesses in ${area.name} have?`,
      answer: `All businesses listed in ${area.name} on Singapore Halal Directory are verified to have valid halal certification from MUIS (Majlis Ugama Islam Singapura). Each listing displays the certification number and expiry date for transparency and verification.`
    },
    {
      question: `Are all businesses in ${area.name} halal-certified?`,
      answer: `Yes, 100% of businesses listed in ${area.name} on our directory are halal-certified. We verify each business's MUIS halal certification before approval. If a business's certification expires, we update or remove the listing accordingly.`
    },
    {
      question: `How can I verify a business's halal certification in ${area.name}?`,
      answer: `Each business listing in ${area.name} displays its MUIS halal certification number. You can verify this on the official MUIS website or by contacting MUIS directly. We also update our listings regularly to ensure all certifications remain valid.`
    },
    {
      question: `Can I submit a new halal business in ${area.name}?`,
      answer: `Yes! If you know of a halal-certified business in ${area.name} that's not yet listed, you can submit it through our dashboard. We'll verify the halal certification and add it to the directory after approval.`
    },
    {
      question: `How do I claim my business listing in ${area.name}?`,
      answer: `If you own a halal business in ${area.name}, you can claim your listing by visiting the business page and clicking "Claim This Business". After verification, you'll be able to edit your business details, upload photos, and upgrade to a featured listing.`
    }
  ];

  // FAQPage schema
  const faqSchema: FAQPageSchema = createFAQSchema(faqs);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/directory" className="hover:text-emerald-600">
            Directory
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{area.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Area Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Halal Businesses in {area.name}
          </h2>
          {area.description && (
            <p className="text-xl text-gray-600 mb-6">
              {area.description}
            </p>
          )}

          {/* Statistics */}
          <div className="flex gap-6 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">{businessCount}</span> {businessCount === 1 ? 'Business' : 'Businesses'}
            </div>
            {featuredCount > 0 && (
              <div>
                <span className="font-semibold text-blue-600">{featuredCount}</span> Featured
              </div>
            )}
          </div>
        </div>

        {/* Businesses Grid */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {business.name}
                </h3>
                <p className="text-sm text-emerald-600 mb-2">
                  {business.business_type}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {business.address}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No businesses found in {area.name} yet.
            </p>
            <Link
              href="/dashboard/claim-business"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Add Your Business
            </Link>
          </div>
        )}

        {/* Business Types in This Area */}
        {businessTypes.length > 0 && (
          <section className="mt-12 bg-emerald-50 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse by Business Type in {area.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {businessTypes.map((type, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(type)}&area=${area.slug}`}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all text-center"
                >
                  <p className="font-semibold text-emerald-600">{type}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    View {type} businesses
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Areas */}
        {relatedAreas && relatedAreas.length > 0 && (
          <section className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Explore Nearby Areas
            </h2>
            <p className="text-gray-600 mb-6">
              Looking for halal businesses in other Singapore neighborhoods? Check out these nearby areas:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {relatedAreas.map((relatedArea) => (
                <Link
                  key={relatedArea.id}
                  href={`/directory/${relatedArea.slug}`}
                  className="bg-emerald-50 rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all text-center"
                >
                  <p className="font-semibold text-gray-900">{relatedArea.name}</p>
                  <p className="text-sm text-emerald-600 mt-1">View businesses →</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/directory"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                View All Areas
              </Link>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 group-open:text-emerald-600">
                    {faq.question}
                  </h3>
                  <span className="transition group-open:rotate-180">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
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
