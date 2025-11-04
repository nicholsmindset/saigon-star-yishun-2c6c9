import { Metadata } from 'next';
import Link from 'next/link';
import { singaporeAreas } from '@/app/data/singapore-areas';

export const metadata: Metadata = {
  title: 'Singapore Halal Directory - Browse by Area',
  description: 'Explore halal-certified businesses across Singapore. Browse by region, district, and neighborhood to find the best halal restaurants, food establishments, and services near you.',
  robots: 'index, follow',
};

export default function AreasPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Singapore Halal Directory</h1>
        <p className="text-xl text-gray-600 mb-12">
          Explore halal-certified businesses across Singapore. Select a region to browse districts and neighborhoods.
        </p>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'Singapore Halal Business Directory',
              'url': 'https://halaldirectory.sg',
              'description': 'Comprehensive directory of halal-certified businesses across Singapore',
              'areaServed': {
                '@type': 'City',
                'name': 'Singapore'
              }
            })
          }}
        />

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {singaporeAreas.map((region) => (
            <Link
              key={region.id}
              href={`/areas/${region.id}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition-all">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {region.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {region.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{region.districts.length} districts</span>
                  <span>{region.districts.reduce((sum, d) => sum + d.subareas.length, 0)} areas</span>
                </div>
                <div className="mt-4 text-blue-600 group-hover:translate-x-1 transition-transform">
                  Browse →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 prose prose-lg max-w-none">
          <h2>Discover Halal Businesses Across Singapore</h2>
          <p>
            The Singapore Halal Business Directory helps you find verified halal-certified restaurants, food establishments, and services across all regions of Singapore. Whether you're looking for dining options in the Central Business District, exploring East Singapore's diverse neighborhoods, or discovering West Singapore's hidden gems, our comprehensive directory makes it easy to find halal-certified businesses near you.
          </p>
          <h3>Browse by Region</h3>
          <p>
            Singapore is organized into five major regions, each with unique characteristics and diverse halal dining options:
          </p>
          <ul>
            <li><strong>Central Singapore:</strong> Including Raffles Place, Marina Bay, Orchard Road, and the Civic District</li>
            <li><strong>East Singapore:</strong> Home to Bedok, Tampines, Geylang Serai, and Pasir Ris</li>
            <li><strong>North Singapore:</strong> Featuring Yishun, Bukit Timah, Woodlands, and Sembawang</li>
            <li><strong>North-East Singapore:</strong> Including Punggol, Sengkang, and Ang Mo Kio</li>
            <li><strong>West Singapore:</strong> Featuring Clementi, Jurong, Bukit Batok, and Pioneer</li>
          </ul>
          <p>
            Select a region above to explore districts and neighborhoods, or search for specific businesses in your area.
          </p>
        </div>
      </div>
    </div>
  );
}
