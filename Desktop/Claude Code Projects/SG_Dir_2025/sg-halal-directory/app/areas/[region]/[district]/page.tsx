import { Metadata } from 'next';
import Link from 'next/link';
import { singaporeAreas, getRegionById, getDistrictById, Region, District } from '@/app/data/singapore-areas';

export async function generateMetadata({ params }: { params: { region: string; district: string } }): Promise<Metadata> {
  const region = getRegionById(params.region);
  const district = region ? region.districts.find(d => d.id === params.district) : undefined;

  if (!region || !district) {
    return {
      title: 'District Not Found - Singapore Halal Directory',
      description: 'The requested district could not be found in our directory.',
    };
  }

  return {
    title: `${district.name}, ${region.name} - Singapore Halal Directory`,
    description: `${district.name} in ${region.name} with ${district.subareas.length} neighborhoods. Discover halal-certified businesses, restaurants, and services in ${district.name}.`,
    robots: 'index, follow',
  };
}

export async function generateStaticParams() {
  const params: Array<{ region: string; district: string }> = [];

  singaporeAreas.forEach((region) => {
    region.districts.forEach((district) => {
      params.push({
        region: region.id,
        district: district.id,
      });
    });
  });

  return params;
}

export default function DistrictPage({ params }: { params: { region: string; district: string } }) {
  const region = getRegionById(params.region);
  const district = region ? region.districts.find(d => d.id === params.district) : undefined;

  if (!region || !district) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">District Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The district you're looking for doesn't exist in our directory.
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
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/areas" className="hover:text-gray-900">Areas</Link>
          <span>/</span>
          <Link href={`/areas/${region.id}`} className="hover:text-gray-900">{region.name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{district.name}</span>
        </nav>

        {/* District Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{district.name}</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover halal-certified businesses, restaurants, and services in {district.name}, {region.name}.
          </p>
          <div className="flex gap-8 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">{district.subareas.length}</span>
              <span className="ml-2">Neighborhoods</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">{district.subareas.length}</span>
              <span className="ml-2">Areas with Businesses</span>
            </div>
          </div>
        </div>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'City',
              'name': district.name,
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': district.latitude,
                'longitude': district.longitude
              },
              'areaServed': {
                '@type': 'AdministrativeArea',
                'name': region.name
              }
            })
          }}
        />

        {/* Subareas Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Neighborhoods in {district.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {district.subareas.map((subarea) => (
              <Link
                key={subarea.id}
                href={`/areas/${region.id}/${district.id}/${subarea.id}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition-all h-full">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {subarea.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {subarea.description}
                  </p>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    View Businesses →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2>Halal Businesses in {district.name}</h2>
          <p>
            {district.name} is a key district in {region.name} with {district.subareas.length} neighborhoods offering
            diverse halal dining and business options. Our directory helps you discover verified halal-certified restaurants,
            food establishments, and services throughout {district.name}.
          </p>
          <h3>Explore by Neighborhood</h3>
          <p>
            Select a neighborhood above to browse halal-certified businesses in that area. Each neighborhood contains
            restaurants, food courts, and services serving the halal community with verified certifications.
          </p>
        </div>

        {/* Back Navigation */}
        <div className="pt-8 border-t">
          <Link href={`/areas/${region.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to {region.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
