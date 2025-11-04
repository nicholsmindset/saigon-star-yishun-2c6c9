/**
 * Featured Listing Upgrade Page
 *
 * Allows business owners to upgrade their claimed businesses to featured status
 * with one-time payment for 1, 3, or 6 month durations.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { UpgradeForm } from '@/components/upgrade-form';

export const metadata = {
  title: 'Upgrade to Featured Listing - Singapore Halal Directory',
  description:
    'Boost your business visibility with a featured listing. Get top placement, 8 photos, and a featured badge.',
};

export default async function UpgradeFeaturedPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string; businessId?: string }>;
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login?redirect=/upgrade/featured');
  }

  // Get user's claimed businesses
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('id, name, is_featured, featured_expiry, area_id, areas(name)')
    .eq('claimed_by', user.id)
    .eq('status', 'approved');

  if (businessError) {
    console.error('Error fetching businesses:', businessError);
  }

  // Cast to any to avoid TypeScript error with partial business data
  const claimedBusinesses = (businesses || []) as any;
  const params = await searchParams;
  const cancelled = params.cancelled === 'true';
  const preselectedBusinessId = params.businessId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Upgrade to Featured Listing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Stand out from the competition and get more customers
          </p>
        </div>

        {/* Cancellation notice */}
        {cancelled && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              Upgrade cancelled. You can try again when you're ready.
            </p>
          </div>
        )}

        {/* Features comparison */}
        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Standard Listing */}
            <div className="rounded-lg border-2 border-gray-200 bg-white p-8">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Standard Listing
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">Free</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-gray-600">1 business photo</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-gray-600">Basic information</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-gray-600">Regular placement</span>
                </li>
              </ul>
            </div>

            {/* Featured Listing */}
            <div className="rounded-lg border-2 border-blue-500 bg-white p-8 shadow-lg">
              <div className="mb-2">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                  Most Popular
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Featured Listing
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  From $29<span className="text-lg text-gray-600">/month</span>
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 font-semibold text-gray-900">
                    Up to 8 photos
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 font-semibold text-gray-900">
                    Top placement in search results
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 font-semibold text-gray-900">
                    Featured badge with blue border
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 font-semibold text-gray-900">
                    Priority in area pages
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 font-semibold text-gray-900">
                    Increased visibility and traffic
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upgrade form */}
        <div className="mx-auto mt-12 max-w-2xl">
          <UpgradeForm
            businesses={claimedBusinesses}
            preselectedBusinessId={preselectedBusinessId}
          />
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                How does billing work?
              </h3>
              <p className="mt-2 text-gray-600">
                Featured listings are a one-time payment for the selected
                duration (1, 3, or 6 months). There are no recurring charges. At
                the end of the period, your listing will automatically revert to
                a standard listing unless you choose to upgrade again.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I cancel my featured listing?
              </h3>
              <p className="mt-2 text-gray-600">
                Featured listings are non-refundable, but you'll continue to
                enjoy featured status for the full duration you paid for.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Do you offer discounts for longer durations?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! The 3-month plan saves you $12, and the 6-month plan saves
                you $34 compared to paying monthly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, PayNow, and GrabPay through
                our secure Stripe payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
