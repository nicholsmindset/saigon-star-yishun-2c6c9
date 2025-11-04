import { Metadata } from 'next';
import Link from 'next/link';
import { singaporeAreas, getRegionById, Region } from '@/app/data/singapore-areas';

export async function generateMetadata({ params }: { params: { region: string } }): Promise<Metadata> {
  const region = getRegionById(params.region);

  if (!region) {
    return {
      title: 'Region Not Found - Singapore Halal Directory',
      description: 'The requested region could not be found in our directory.',
    };
  }

  const businessCount = region.districts.reduce((sum, d) => sum + d.subareas.length, 0);

  return {
    title: `${region.name} - Singapore Halal Directory`,
    description: `${region.description} Browse ${region.districts.length} districts and ${businessCount} neighborhoods with halal-certified businesses in ${region.name}.`,
    robots: 'index, follow',
  };
}

export async function generateStaticParams() {
  return singaporeAreas.map((region) => ({
    region: region.id,
  }));
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const region = getRegionById(params.region);

  if (!region) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Region Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The region you're looking for doesn't exist in our directory.
          </p>
          <Link href="/areas" className="text-blue-600 hover:text-blue-800">
            ← Back to All Areas
          </Link>
        </div>
      </div>
    );
  }

  const totalSubareas = region.districts.reduce((sum, d) => sum + d.subareas.length, 0);
  const businessCount = region.districts.reduce((sum, d) => sum + d.subareas.length, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/areas" className="hover:text-gray-900">Areas</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{region.name}</span>
        </nav>

        {/* Region Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{region.name}</h1>
          <p className="text-xl text-gray-600 mb-6">
            {region.description}
          </p>
          <div className="flex gap-8 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">{region.districts.length}</span>
              <span className="ml-2">Districts</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">{totalSubareas}</span>
              <span className="ml-2">Neighborhoods</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">{businessCount}</span>
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
              'name': region.name,
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': region.latitude,
                'longitude': region.longitude
              },
              'description': region.description,
              'areaServed': {
                '@type': 'City',
                'name': 'Singapore'
              }
            })
          }}
        />

        {/* Districts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Districts & Neighborhoods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {region.districts.map((district) => (
              <Link
                key={district.id}
                href={`/areas/${region.id}/${district.id}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition-all h-full">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {district.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {district.subareas.length} neighborhoods
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    {district.subareas.map(sa => sa.name).join(', ')}
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2>Halal Businesses in {region.name}</h2>
          <p>
            {region.name} is a vibrant region of Singapore with diverse dining options and halal-certified businesses.
            Our directory helps you discover verified halal restaurants, food establishments, and services across all
            {region.districts.length} districts and {totalSubareas} neighborhoods in this region.
          </p>
          <h3>Explore by District</h3>
          <p>
            Select a district above to browse neighborhoods and discover halal-certified businesses in your area.
            Each district contains multiple neighborhoods with restaurants, food courts, and services that serve the halal community.
          </p>
        </div>

        {/* Back Navigation */}
        <div className="pt-8 border-t">
          <Link href="/areas" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to All Areas
          </Link>
        </div>
      </div>
    </div>
  );
}
