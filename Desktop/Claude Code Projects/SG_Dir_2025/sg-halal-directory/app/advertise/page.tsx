import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise Your Business - Featured Listings | Singapore Halal Directory',
  description: 'Boost your halal business visibility with featured listings. Get top placement, 8 images, and a blue verified badge for just $29/month. Stand out from 5,000+ businesses across Singapore.',
  openGraph: {
    title: 'Advertise Your Halal Business in Singapore',
    description: 'Featured listings with premium placement starting at $29/month. Reach thousands of halal-conscious customers.',
  },
};

export default function AdvertisePage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Featured Business Listing',
    provider: {
      '@type': 'Organization',
      name: 'Singapore Halal Directory',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Singapore',
    },
    description: 'Premium featured listings for halal-certified businesses with enhanced visibility and top placement',
  };

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Featured Business Listing',
    description: 'Premium placement with 8 images and enhanced visibility',
    price: '29.00',
    priceCurrency: 'SGD',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Singapore Halal Directory',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Boost Your Business Visibility
              </h1>
              <p className="text-xl md:text-2xl text-blue-50 leading-relaxed mb-8">
                Stand out from thousands of listings with a featured placement
              </p>
              <Link
                href="/upgrade/featured"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Standard vs Featured Listings
            </h2>
            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Standard (Free)</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700 bg-blue-50">Featured (Paid)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">Number of Images</td>
                    <td className="px-6 py-4 text-center text-gray-600">1</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-semibold bg-blue-50">8</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">Placement Priority</td>
                    <td className="px-6 py-4 text-center text-gray-600">Regular</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-semibold bg-blue-50">Top of Results</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">Featured Badge</td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <svg className="w-6 h-6 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">Blue Border Highlight</td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <svg className="w-6 h-6 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">Image Gallery/Carousel</td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <svg className="w-6 h-6 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">Visibility Boost</td>
                    <td className="px-6 py-4 text-center text-gray-600">Standard</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-semibold bg-blue-50">5-10x Higher</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 font-medium">Cost</td>
                    <td className="px-6 py-4 text-center text-gray-600 font-bold">FREE</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-bold text-lg bg-blue-50">From $29/month</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              One-time payment. No subscriptions. Cancel anytime.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* 1 Month */}
              <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">1 Month</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-4">$29</div>
                  <p className="text-gray-600 mb-6">Best for testing featured placement</p>
                  <Link
                    href="/upgrade/featured?plan=1month"
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* 3 Months - Popular */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-blue-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">3 Months</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$75</div>
                  <div className="text-sm text-green-600 font-semibold mb-4">Save $12 (14%)</div>
                  <p className="text-gray-600 mb-6">Best value for consistent visibility</p>
                  <Link
                    href="/upgrade/featured?plan=3months"
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* 6 Months */}
              <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">6 Months</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$140</div>
                  <div className="text-sm text-green-600 font-semibold mb-4">Save $34 (20%)</div>
                  <p className="text-gray-600 mb-6">Maximum savings and exposure</p>
                  <Link
                    href="/upgrade/featured?plan=6months"
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Choose Featured Listings?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Top Placement</h3>
                  <p className="text-gray-600">Appear first in area searches, above all standard listings</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Showcase Your Best</h3>
                  <p className="text-gray-600">8 high-quality images vs 1 for standard listings</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Stand Out Visually</h3>
                  <p className="text-gray-600">Blue border and "Featured" badge for instant recognition</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">5-10x More Visibility</h3>
                  <p className="text-gray-600">Featured listings receive significantly more views and clicks</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Affordable Investment</h3>
                  <p className="text-gray-600">Starting at less than $1/day with no long-term contracts</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Targeted Audience</h3>
                  <p className="text-gray-600">Reach halal-conscious customers actively searching in your area</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Full Control</h3>
                  <p className="text-gray-600">Update images and info anytime through your dashboard</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Instant Activation</h3>
                  <p className="text-gray-600">Your featured listing goes live immediately after payment</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Program Section */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50 border-y-4 border-amber-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-amber-500 text-white px-4 py-2 rounded-full font-semibold mb-6">
                FREE FEATURED MONTH
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Badge Program: Get 1 Free Featured Month
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Add our badge to your website and earn a free month of featured listing (a $29 value!)
              </p>
              <div className="bg-white p-8 rounded-lg shadow-md text-left mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works:</h3>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <span>Generate your unique badge code from our <Link href="/badge-generator" className="text-blue-600 hover:text-blue-700 underline">Badge Generator</Link></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <span>Add the HTML badge or anchor text link to your website</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <span>We verify the backlink is live on your site</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <span>Receive 1 free month of featured listing automatically</span>
                  </li>
                </ol>
              </div>
              <Link
                href="/badge-generator"
                className="inline-block bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-colors shadow-lg"
              >
                Generate Your Badge Now
              </Link>
            </div>
          </div>
        </section>

        {/* Success Metrics Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Real Results from Featured Businesses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">8.5x</div>
                <div className="text-xl text-gray-700 font-semibold mb-2">More Profile Views</div>
                <p className="text-gray-600">Featured listings receive significantly more visibility</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">12x</div>
                <div className="text-xl text-gray-700 font-semibold mb-2">Higher Click-Through Rate</div>
                <p className="text-gray-600">Top placement drives more engagement</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">6x</div>
                <div className="text-xl text-gray-700 font-semibold mb-2">More Customer Inquiries</div>
                <p className="text-gray-600">Featured businesses get more phone calls and visits</p>
              </div>
            </div>
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700 italic text-lg mb-4">
                  "Since upgrading to a featured listing, our foot traffic has increased by 40%. The 8 images let us showcase our menu and ambiance properly. Best $75 we've spent on marketing."
                </p>
                <p className="text-gray-900 font-semibold">— Halal Restaurant Owner, Bugis</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Boost Your Visibility?
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Join hundreds of featured businesses across Singapore. Upgrade today and start attracting more customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upgrade/featured"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Upgrade to Featured
              </Link>
              <Link
                href="/contact"
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-900 transition-colors border-2 border-white"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
