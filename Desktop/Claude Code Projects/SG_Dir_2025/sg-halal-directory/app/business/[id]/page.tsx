import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import BusinessMap from "@/app/components/BusinessMap";
import { createLocalBusinessSchema, createBreadcrumbSchema, createPostalAddress, type LocalBusinessSchema, type BreadcrumbListSchema } from "@/types/schema";

interface PageProps {
  params: {
    id: string;
  };
}

// Generate static params for all businesses
export async function generateStaticParams() {
  const supabase = await createClient();
  const { data: businesses } = await supabase.from("businesses").select("id");

  return businesses?.map((business) => ({
    id: business.id.toString(),
  })) ?? [];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select(`
      name,
      business_type,
      description,
      address,
      areas (id, name, slug)
    `)
    .eq("id", params.id)
    .single();

  if (!business) {
    return {
      title: "Business Not Found - Singapore Halal Directory",
    };
  }

  // Handle areas as either single object or array (Supabase typing)
  const areaName = Array.isArray(business.areas)
    ? business.areas[0]?.name || "Singapore"
    : (business.areas as any)?.name || "Singapore";

  return {
    title: `${business.name} - Halal ${business.business_type} in ${areaName}`,
    description: business.description || `${business.name} - Certified halal ${business.business_type} located in ${areaName}. ${business.address}`,
  };
}

export default async function BusinessPage({ params }: PageProps) {
  const supabase = await createClient();

  // Fetch business data with area information
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select(`
      id,
      name,
      business_type,
      description,
      address,
      phone,
      website,
      halal_cert_number,
      halal_cert_expiry,
      operating_hours,
      is_featured,
      area_id,
      latitude,
      longitude,
      areas (id, name, slug)
    `)
    .eq("id", params.id)
    .single();

  if (businessError || !business) {
    notFound();
  }

  // Helper to safely access area data (handles Supabase typing as array or object)
  const getArea = () => {
    if (Array.isArray(business.areas)) {
      return business.areas[0] || { id: "", name: "Singapore", slug: "" };
    }
    return (business.areas as any) || { id: "", name: "Singapore", slug: "" };
  };
  const area = getArea();

  // Fetch images for this business
  const { data: images } = await supabase
    .from("images")
    .select("id, image_url, alt_text")
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  const imageCount = images?.length || 0;

  // Fetch related businesses (same business type in same area, limit to 3)
  const { data: relatedBusinesses } = await supabase
    .from("businesses")
    .select("id, name, business_type, address, is_featured")
    .eq("area_id", business.area_id)
    .eq("business_type", business.business_type)
    .neq("id", business.id)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true })
    .limit(3);

  // Fetch other businesses in same area (different types, limit to 3)
  const { data: otherBusinesses } = await supabase
    .from("businesses")
    .select("id, name, business_type, address, is_featured, areas(name, slug)")
    .eq("area_id", business.area_id)
    .neq("business_type", business.business_type)
    .neq("id", business.id)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true })
    .limit(3);

  // Check if business has valid coordinates
  const hasValidCoordinates =
    business.latitude !== null &&
    business.longitude !== null &&
    business.latitude !== 0 &&
    business.longitude !== 0;

  // Generate Google Maps directions link
  const directionsLink = hasValidCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;

  // Generate Schema.org LocalBusiness structured data with geo coordinates
  const localBusinessSchema: LocalBusinessSchema = createLocalBusinessSchema({
    name: business.name,
    description: business.description || `Halal ${business.business_type} in ${area.name}`,
    address: createPostalAddress(
      business.address,
      area.name,
      "SG"
    ),
    latitude: business.latitude,
    longitude: business.longitude,
    telephone: business.phone || undefined,
    website: business.website || undefined,
    image: images && images.length > 0 ? images.map(img => img.image_url) : undefined,
    priceRange: "$$",
  });

  // BreadcrumbList schema for SEO
  const breadcrumbSchema: BreadcrumbListSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://singaporehalaldir.com" },
    { name: "Directory", url: "https://singaporehalaldir.com/directory" },
    { name: area.name || "Area", url: `https://singaporehalaldir.com/directory/${area.slug}` },
    { name: business.name, url: `https://singaporehalaldir.com/business/${business.id}` }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
          <Link
            href={`/directory/${area.slug}`}
            className="hover:text-emerald-600"
          >
            {area.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{business.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h2>
                  <p className="text-xl text-emerald-600 mb-2">
                    {business.business_type}
                  </p>
                </div>
                {business.is_featured && (
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Description */}
              {business.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {business.description}
                  </p>
                </div>
              )}

              {/* Halal Certification */}
              {business.halal_cert_number && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-semibold text-emerald-900">
                      Halal Certified
                    </h3>
                  </div>
                  <p className="text-sm text-emerald-800">
                    Cert #: {business.halal_cert_number}
                  </p>
                  {business.halal_cert_expiry && (
                    <p className="text-sm text-emerald-800">
                      Valid until: {new Date(business.halal_cert_expiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Image Gallery */}
              {images && images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Photos ({imageCount})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || business.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover hover:scale-105 transition-transform"
                          loading={index < 3 ? "eager" : "lazy"}
                          quality={85}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operating Hours */}
              {business.operating_hours && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Operating Hours
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {business.operating_hours}
                  </p>
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Location
              </h3>

              {/* Address */}
              <div className="mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900 mb-1">Address</p>
                    <p className="text-base text-gray-700">{business.address}</p>
                  </div>
                </div>
              </div>

              {/* Map - Updated to use new array-based API */}
              {hasValidCoordinates ? (
                <div className="mb-6">
                  <BusinessMap
                    businesses={[
                      {
                        id: business.id,
                        name: business.name,
                        latitude: business.latitude || 0,
                        longitude: business.longitude || 0,
                        address: business.address,
                        business_type: business.business_type,
                        is_featured: business.is_featured,
                      }
                    ]}
                    zoom={15}
                    height="h-[300px] md:h-[400px]"
                  />
                </div>
              ) : (
                <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-600 text-sm">
                    Map location not available for this business
                  </p>
                </div>
              )}

              {/* Get Directions Button */}
              <div>
                <a
                  href={directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              {/* Phone */}
              {business.phone && (
                <div className="mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-sm text-emerald-600 hover:text-emerald-700">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Website */}
              {business.website && (
                <div className="mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Website</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-700 break-all"
                      >
                        {business.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">
                Own this business?
              </h3>
              <p className="text-sm text-emerald-50 mb-4">
                Claim your listing to update information and get featured
              </p>
              <Link
                href="/dashboard/claim-business"
                className="block w-full px-4 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold text-center"
              >
                Claim This Business
              </Link>
            </div>

            {/* Upgrade to Featured (if not already featured) */}
            {!business.is_featured && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Get Featured
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Stand out with a featured listing - appear at the top of search results
                </p>
                <Link
                  href="/upgrade/featured"
                  className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Businesses */}
        {relatedBusinesses && relatedBusinesses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More {business.business_type} in {area.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBusinesses.map((relatedBusiness) => (
                <Link
                  key={relatedBusiness.id}
                  href={`/business/${relatedBusiness.id}`}
                  className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all ${
                    relatedBusiness.is_featured ? 'border-2 border-blue-500 relative' : ''
                  }`}
                >
                  {relatedBusiness.is_featured && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {relatedBusiness.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedBusiness.address}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Businesses in Area */}
        {otherBusinesses && otherBusinesses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Other Halal Businesses in {area.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherBusinesses.map((otherBusiness) => (
                <Link
                  key={otherBusiness.id}
                  href={`/business/${otherBusiness.id}`}
                  className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all ${
                    otherBusiness.is_featured ? 'border-2 border-blue-500 relative' : ''
                  }`}
                >
                  {otherBusiness.is_featured && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {otherBusiness.name}
                  </h3>
                  <p className="text-sm text-emerald-600 mb-2">
                    {otherBusiness.business_type}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {otherBusiness.address}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Area Link */}
        <div className="mt-8">
          <Link
            href={`/directory/${area.slug}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {area.name}
          </Link>
        </div>
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
