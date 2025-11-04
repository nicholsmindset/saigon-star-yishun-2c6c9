import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Singapore Halal Directory | Our Mission & Values',
  description: 'Learn about Singapore\'s most comprehensive halal business directory. Discover our mission to connect the Muslim community with verified MUIS-certified businesses across all 28 districts.',
  openGraph: {
    title: 'About Singapore Halal Directory',
    description: 'Singapore\'s trusted source for verified halal businesses with 5,000+ MUIS-certified listings.',
  },
};

export default function AboutPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Singapore Halal Directory',
    url: 'https://singaporehalaldir.com',
    logo: 'https://singaporehalaldir.com/logo.png',
    description: 'Singapore\'s most comprehensive halal business directory featuring verified MUIS-certified businesses',
    foundingDate: '2025',
    areaServed: {
      '@type': 'Country',
      name: 'Singapore',
    },
    slogan: 'Your trusted guide to halal-certified businesses in Singapore',
  };

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Singapore Halal Directory',
    description: 'Learn about our mission to provide Singapore\'s most comprehensive halal business directory',
    mainEntity: {
      '@type': 'Organization',
      name: 'Singapore Halal Directory',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About Singapore Halal Directory
              </h1>
              <p className="text-xl md:text-2xl text-green-50 leading-relaxed">
                Your trusted guide to halal-certified businesses across Singapore
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Singapore Halal Directory was founded to solve a critical problem facing Singapore's Muslim community:
                <strong className="text-green-700"> the difficulty of verifying halal certification</strong> across thousands of businesses
                in our diverse food and retail landscape.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We believe every Muslim in Singapore deserves quick, reliable access to verified halal-certified businesses
                without the uncertainty and time spent searching across fragmented sources. Our platform brings together
                Singapore's entire halal business ecosystem into one comprehensive, easy-to-navigate directory.
              </p>
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                <p className="text-xl font-semibold text-green-900 italic">
                  "Making halal certification verification simple, trustworthy, and accessible to every Singaporean."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              By the Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-xl text-gray-700 font-semibold">Verified Businesses</div>
                <p className="text-gray-600 mt-2">All MUIS-certified halal establishments</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">28</div>
                <div className="text-xl text-gray-700 font-semibold">Areas Covered</div>
                <p className="text-gray-600 mt-2">Every district across Singapore</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-xl text-gray-700 font-semibold">MUIS Certified</div>
                <p className="text-gray-600 mt-2">Only verified halal certifications</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust</h3>
                <p className="text-gray-600">
                  Every listing is verified against official MUIS certification records, ensuring complete reliability.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">
                  Built by and for Singapore's Muslim community, with crowdsourced submissions to keep content current.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Fast, mobile-friendly, and easy to navigate - find what you need in seconds, anywhere in Singapore.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Team
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Singapore Halal Directory is built and maintained by a passionate team of developers, designers,
                and community advocates dedicated to serving Singapore's Muslim community.
              </p>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  We combine cutting-edge technology with deep community understanding to create the most
                  comprehensive and user-friendly halal business directory in Singapore.
                </p>
                <p className="text-gray-600">
                  Have questions or want to join our mission? <Link href="/contact" className="text-green-600 font-semibold hover:text-green-700 underline">Get in touch</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Help Us Grow the Directory
            </h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Know a halal-certified business that's not listed? Submit it to help fellow Singaporeans discover great halal options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/submit-business"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg"
              >
                Submit a Business
              </Link>
              <Link
                href="/directory"
                className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition-colors border-2 border-white"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
