import { Metadata } from 'next';
import Link from 'next/link';
import { singaporeAreas, getRegionById, getDistrictById, getSubAreaById } from '@/app/data/singapore-areas';
import { createClient } from '@/lib/supabase/server';
import { getBusinessesByAreaSlug } from '@/lib/supabase/queries';
import { createBreadcrumbSchema, createItemListSchema, createLocalBusinessSchema, createPostalAddress } from '@/types/schema';

export async function generateMetadata({ params }: { params: { region: string; district: string; subarea: string } }): Promise<Metadata> {
  const region = getRegionById(params.region);
  const district = region ? region.districts.find(d => d.id === params.district) : undefined;
  const subarea = district ? district.subareas.find(s => s.id === params.subarea) : undefined;

  if (!region || !district || !subarea) {
    return {
      title: 'Area Not Found - Singapore Halal Directory',
      description: 'The requested area could not be found in our directory.',
    };
  }

  return {
    title: `${subarea.name}, ${district.name}, ${region.name} - Singapore Halal Directory`,
    description: `${subarea.name} in ${district.name}, ${region.name}. Discover halal-certified businesses, restaurants, and services in ${subarea.name}. Browse verified halal establishments and find the best dining and shopping options in this neighborhood.`,
    robots: 'index, follow',
  };
}

export async function generateStaticParams() {
  const params: Array<{ region: string; district: string; subarea: string }> = [];

  singaporeAreas.forEach((region) => {
    region.districts.forEach((district) => {
      district.subareas.forEach((subarea) => {
        params.push({
          region: region.id,
          district: district.id,
          subarea: subarea.id,
        });
      });
    });
  });

  return params;
}

export default async function SubareaPage({ params }: { params: { region: string; district: string; subarea: string } }) {
  const region = getRegionById(params.region);
  const district = region ? region.districts.find(d => d.id === params.district) : undefined;
  const subarea = district ? district.subareas.find(s => s.id === params.subarea) : undefined;

  // Fetch businesses from Supabase
  const supabase = await createClient();
  const businesses = subarea ? await getBusinessesByAreaSlug(supabase, subarea.id) : [];

  if (!region || !district || !subarea) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Area Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The area you're looking for doesn't exist in our directory.
          </p>
          <Link href="/areas" className="text-blue-600 hover:text-blue-800">
            ← Back to All Areas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-600 flex-wrap">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/areas" className="hover:text-gray-900">Areas</Link>
          <span>/</span>
          <Link href={`/areas/${region.id}`} className="hover:text-gray-900">{region.name}</Link>
          <span>/</span>
          <Link href={`/areas/${region.id}/${district.id}`} className="hover:text-gray-900">{district.name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{subarea.name}</span>
        </nav>

        {/* Subarea Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{subarea.name}</h1>
          <p className="text-xl text-gray-600 mb-6">
            {subarea.description}
          </p>
          <div className="flex gap-8 text-sm text-gray-600 flex-wrap">
            <div>
              <span className="font-semibold text-gray-900">Location:</span>
              <span className="ml-2">{subarea.name}, {district.name}, {region.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Coordinates:</span>
              <span className="ml-2">{subarea.latitude.toFixed(4)}, {subarea.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Schema Markup */}
        {/* Area Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              'name': subarea.name,
              'description': subarea.description,
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': subarea.latitude,
                'longitude': subarea.longitude
              },
              'areaServed': [
                {
                  '@type': 'AdministrativeArea',
                  'name': district.name
                },
                {
                  '@type': 'AdministrativeArea',
                  'name': region.name
                }
              ]
            })
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              createBreadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Areas', url: '/areas' },
                { name: region.name, url: `/areas/${region.id}` },
                { name: district.name, url: `/areas/${region.id}/${district.id}` },
                { name: subarea.name, url: `/areas/${region.id}/${district.id}/${subarea.id}` }
              ])
            )
          }}
        />

        {/* Business ItemList Schema */}
        {businesses.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                createItemListSchema({
                  name: `Halal Businesses in ${subarea.name}`,
                  description: `List of verified halal-certified businesses in ${subarea.name}, ${district.name}, ${region.name}`,
                  items: businesses.map((business) => ({
                    name: business.name,
                    url: `/business/${business.slug}`,
                    address: business.address,
                    addressLocality: subarea.name,
                    latitude: business.latitude,
                    longitude: business.longitude,
                    image: undefined, // Will be added when image support is implemented
                    description: business.description
                  }))
                })
              )
            }}
          />
        )}

        {/* Businesses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Halal Businesses in {subarea.name}</h2>

          {businesses.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                <span className="font-semibold">No businesses yet:</span> We're working to add verified halal-certified businesses for {subarea.name}.
              </p>
              <p className="text-gray-600 text-sm mt-3">
                Know a great halal establishment here? <Link href="/submit-business" className="text-blue-600 hover:text-blue-800 font-semibold">Submit a business</Link> for our directory.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600 mb-6">
                  Found <span className="font-semibold text-gray-900">{businesses.length}</span> halal-certified {businesses.length === 1 ? 'business' : 'businesses'} in {subarea.name}
                </p>

                {/* Business Listings */}
                <div className="space-y-4">
                  {businesses.map((business) => (
                    <div
                      key={business.id}
                      className={`border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                        business.is_featured
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {business.is_featured && (
                        <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          Featured
                        </div>
                      )}

                      <h3 className="text-xl font-bold mb-2 text-gray-900">{business.name}</h3>

                      {business.business_type && (
                        <p className="text-sm text-gray-500 mb-3">
                          <span className="font-semibold">{business.business_type}</span>
                        </p>
                      )}

                      {business.address && (
                        <p className="text-gray-600 mb-2">
                          <span className="font-semibold">Address:</span> {business.address}
                          {business.postal_code && ` ${business.postal_code}`}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                        {business.phone && (
                          <div>
                            <span className="font-semibold">Phone:</span>
                            <a href={`tel:${business.phone}`} className="text-blue-600 hover:text-blue-800 ml-2">
                              {business.phone}
                            </a>
                          </div>
                        )}
                        {business.website && (
                          <div>
                            <span className="font-semibold">Website:</span>
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 ml-2"
                            >
                              Visit →
                            </a>
                          </div>
                        )}
                      </div>

                      {business.halal_certification && (
                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-semibold text-green-700">✓ Halal Certified:</span> {business.halal_certification}
                          {business.certification_number && ` (${business.certification_number})`}
                        </p>
                      )}

                      {business.description && (
                        <p className="text-gray-700 mb-4">
                          {business.description}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <Link
                          href={`/business/${business.slug}`}
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 text-sm">
                  Know another halal establishment in {subarea.name}? <Link href="/submit-business" className="text-blue-600 hover:text-blue-800 font-semibold">Submit a business</Link> for our directory.
                </p>
              </div>
            </>
          )}
        </div>

        {/* SEO Content Section */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2>Discover Halal Businesses in {subarea.name}</h2>
          <p>
            {subarea.name} is a vibrant neighborhood in {district.name}, {region.name}, offering diverse halal dining and business options for the local community. Our directory helps you discover verified halal-certified restaurants, food establishments, and services throughout {subarea.name}.
          </p>
          <h3>What to Expect in {subarea.name}</h3>
          <p>
            From traditional halal food courts to modern halal restaurants, {subarea.name} provides a variety of dining experiences for the halal-conscious community. Whether you're looking for quick meals, sit-down dining, or specialty halal food shops, you'll find verified, certified establishments that meet strict halal standards.
          </p>
          <h3>Verified Halal Certifications</h3>
          <p>
            All businesses listed in our directory for {subarea.name} are verified to meet halal certification requirements. We work with local halal certification bodies to ensure that every business listed has the proper credentials and maintains halal standards in their food preparation and sourcing.
          </p>
          <h3>Browse Nearby Neighborhoods</h3>
          <p>
            Interested in exploring other neighborhoods in {district.name}? Check out nearby areas to discover more halal-certified businesses in the wider {district.name} district.
          </p>
        </div>

        {/* Related Neighborhoods */}
        {district.subareas.length > 1 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Other Neighborhoods in {district.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {district.subareas
                .filter(s => s.id !== subarea.id)
                .map((neighborSubarea) => (
                  <Link
                    key={neighborSubarea.id}
                    href={`/areas/${region.id}/${district.id}/${neighborSubarea.id}`}
                    className="group"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition-all h-full">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {neighborSubarea.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {neighborSubarea.description}
                      </p>
                      <div className="text-blue-600 group-hover:translate-x-1 transition-transform text-sm">
                        Explore →
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Back Navigation */}
        <div className="pt-8 border-t flex flex-col gap-3">
          <Link href={`/areas/${region.id}/${district.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to {district.name}
          </Link>
          <Link href={`/areas/${region.id}`} className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to {region.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
