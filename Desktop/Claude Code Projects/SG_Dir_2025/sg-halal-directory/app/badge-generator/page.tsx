import { Metadata } from "next";
import { getUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import BadgeGenerator from "@/components/BadgeGenerator";
import Header from "@/components/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Badge Generator - Singapore Halal Directory",
  description: "Generate embeddable badges for your business website and earn 1 free month of featured listing.",
};

export default async function BadgeGeneratorPage() {
  const user = await getUser();

  // Require authentication
  if (!user) {
    redirect("/auth/login?redirect=/badge-generator");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/dashboard" className="hover:text-emerald-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Badge Generator</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Badge Generator
            </h1>
            <p className="text-xl text-emerald-100 mb-6">
              Display your halal certification with pride and earn rewards!
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  REWARD
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Get 1 Free Month of Featured Listing ($29 Value)
                  </h3>
                  <p className="text-emerald-100">
                    Add our badge to your website and we'll verify the backlink. Once confirmed,
                    you'll receive 1 free month of featured listing status with all premium benefits!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Generator Component */}
        <BadgeGenerator userId={user.id} />

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Benefits of Adding Our Badge
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Build Trust</h3>
                <p className="text-sm text-gray-600">
                  Show your customers that your business is officially listed and verified on Singapore Halal Directory.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Boost SEO</h3>
                <p className="text-sm text-gray-600">
                  Backlinks from our high-quality directory improve your website's search engine rankings.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Featured Listing</h3>
                <p className="text-sm text-gray-600">
                  Earn 1 free month ($29 value) with priority placement, 8 images, and blue featured badge.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Drive Traffic</h3>
                <p className="text-sm text-gray-600">
                  Link directly to your business listing and attract customers searching for halal options.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How the Verification Works
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Select Your Business</h3>
                <p className="text-sm text-gray-600">
                  Choose one of your claimed businesses from the dropdown above.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Copy the Code</h3>
                <p className="text-sm text-gray-600">
                  Choose between HTML embed (with image) or branded anchor text. Copy the code to your clipboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Add to Your Website</h3>
                <p className="text-sm text-gray-600">
                  Paste the code into your website's footer, sidebar, or about page. Common locations include footer.html,
                  index.html, or your WordPress theme footer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">We Verify the Link</h3>
                <p className="text-sm text-gray-600">
                  Our system automatically checks for the backlink on your website. This usually takes 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Receive Your Reward</h3>
                <p className="text-sm text-gray-600">
                  Once verified, you'll receive 1 free month of featured listing ($29 value) automatically!
                  You'll get an email confirmation with your activation date.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does verification take?
              </h3>
              <p className="text-sm text-gray-600">
                Our automated system checks for backlinks every 24 hours. Once you add the badge to your website,
                verification typically occurs within 24-48 hours.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I use the badge for multiple businesses?
              </h3>
              <p className="text-sm text-gray-600">
                Yes! Each claimed business can generate its own badge. Each verified badge earns 1 free month
                of featured listing for that specific business.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I remove the badge?
              </h3>
              <p className="text-sm text-gray-600">
                If you remove the badge and we can no longer detect the backlink, your free featured listing
                status may be revoked. Keep the badge on your site to maintain the benefit.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Where should I place the badge on my website?
              </h3>
              <p className="text-sm text-gray-600">
                Common placements include your website footer, sidebar, about page, or contact page.
                The badge should be visible and the link should be clickable (not hidden or removed via CSS/JavaScript).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I customize the badge design?
              </h3>
              <p className="text-sm text-gray-600">
                The badge design and link must remain unchanged to qualify for verification. However, you can
                choose between the HTML embed (with image) or the branded anchor text option.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                <li>
                  <Link href="/badge-generator" className="hover:text-white">
                    Badge Generator
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
