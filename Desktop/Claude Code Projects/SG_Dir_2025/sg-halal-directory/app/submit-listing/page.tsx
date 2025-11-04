import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import SubmitListingForm from './SubmitListingForm'

export const metadata: Metadata = {
  title: 'Submit Your Halal Business - Singapore Halal Directory',
  description: 'List your halal-certified business for free. Reach more customers across Singapore. Quick verification process within 1-2 business days.',
  keywords: 'submit halal business, list halal restaurant, Singapore halal directory, free business listing',
}

// FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does verification take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our admin team typically reviews and verifies submissions within 1-2 business days. You'll receive an email notification once your listing is approved and live."
      }
    },
    {
      "@type": "Question",
      "name": "Can I edit my listing later?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Once your listing is approved, you can claim it by creating an account. As the verified owner, you'll be able to edit business details, add photos, and manage your listing from your dashboard."
      }
    },
    {
      "@type": "Question",
      "name": "What if I don't have halal certification yet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A valid MUIS halal certification is required for listing on our directory. If your certification is in progress, please submit your business once you receive it. This ensures all listings are verified halal-certified."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a fee to list my business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, basic listings are completely free and remain free forever. You can upgrade to a featured listing later for premium placement and additional photos."
      }
    },
    {
      "@type": "Question",
      "name": "Can I add more photos after submission?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! After claiming your listing, you can add additional photos. Standard listings include 1 photo, while featured listings can have up to 8 photos with carousel display."
      }
    }
  ]
}

// SubmitAction Schema for SEO
const submitActionSchema = {
  "@context": "https://schema.org",
  "@type": "Action",
  "name": "Submit Halal Business Listing",
  "description": "Submit your halal-certified business to Singapore's leading halal directory",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://singaporehalaldir.com/submit-listing",
    "actionPlatform": [
      "http://schema.org/DesktopWebPlatform",
      "http://schema.org/MobileWebPlatform"
    ]
  }
}

export default async function SubmitListingPage() {
  const supabase = await createClient()

  // Fetch areas for dropdown
  const { data: areas } = await supabase
    .from('areas')
    .select('id, name, slug')
    .order('name')

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(submitActionSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Submit Your Halal Business
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Help grow Singapore's halal directory. Free listing forever!
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Reach Customers</h3>
              <p className="text-sm text-emerald-100">
                Get discovered by thousands searching for halal options
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold mb-2">Build Trust</h3>
              <p className="text-sm text-emerald-100">
                Display your MUIS certification to build credibility
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">💚</div>
              <h3 className="font-semibold mb-2">Free Forever</h3>
              <p className="text-sm text-emerald-100">
                No hidden fees, no subscriptions, no catch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Business Information
            </h2>
            <p className="text-gray-600">
              Fill in the details below. All fields marked with <span className="text-red-500">*</span> are required.
            </p>
          </div>

          <SubmitListingForm areas={areas || []} />
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Submit Form</h3>
            <p className="text-sm text-gray-600">
              Provide your business details and halal certification
            </p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Admin Verification</h3>
            <p className="text-sm text-gray-600">
              We verify your certification (1-2 business days)
            </p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Listing Goes Live</h3>
            <p className="text-sm text-gray-600">
              Your business appears in search results
            </p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Claim & Manage</h3>
            <p className="text-sm text-gray-600">
              Create account to edit and manage your listing
            </p>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Submission Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Valid MUIS Halal Certification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Must have current, valid halal certification from MUIS (Majlis Ugama Islam Singapura)
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Accurate Business Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Provide complete and accurate details including operating address and contact info
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Operating in Singapore
                  </h3>
                  <p className="text-sm text-gray-600">
                    Business must be physically located and operating within Singapore
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Photo Requirements
                  </h3>
                  <p className="text-sm text-gray-600">
                    JPEG or PNG format, maximum 5MB per image, clear and high quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How long does verification take?
            </h3>
            <p className="text-gray-600">
              Our admin team typically reviews and verifies submissions within 1-2 business days.
              You'll receive an email notification once your listing is approved and live.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I edit my listing later?
            </h3>
            <p className="text-gray-600">
              Yes! Once your listing is approved, you can claim it by creating an account.
              As the verified owner, you'll be able to edit business details, add photos, and
              manage your listing from your dashboard.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What if I don't have halal certification yet?
            </h3>
            <p className="text-gray-600">
              A valid MUIS halal certification is required for listing on our directory.
              If your certification is in progress, please submit your business once you receive it.
              This ensures all listings are verified halal-certified.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is there a fee to list my business?
            </h3>
            <p className="text-gray-600">
              No, basic listings are completely free and remain free forever. You can upgrade to a
              featured listing later for premium placement and additional photos.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I add more photos after submission?
            </h3>
            <p className="text-gray-600">
              Yes! After claiming your listing, you can add additional photos. Standard listings
              include 1 photo, while featured listings can have up to 8 photos with carousel display.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-emerald-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-emerald-100 mb-6">
            Scroll up to fill out the form and submit your business today!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-block px-8 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
          >
            Go to Form
          </button>
        </div>
      </section>
    </div>
  )
}
