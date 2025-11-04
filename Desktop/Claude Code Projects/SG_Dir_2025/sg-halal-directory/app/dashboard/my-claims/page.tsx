import Link from "next/link";
import Header from "@/components/Header";
import { getUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Claims - Singapore Halal Directory",
  description: "View and manage your business claim requests.",
  robots: {
    index: false,
    follow: false,
  },
};

interface BusinessClaim {
  id: string;
  business_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  owner_name: string;
  owner_email: string;
  owner_phone: string | null;
  verification_documents: string[] | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  businesses: {
    id: string;
    name: string;
    address: string;
    business_type: string;
    slug: string;
  } | null;
}

async function getBusinessClaims(userId: string): Promise<BusinessClaim[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_claims")
    .select(
      `
      *,
      businesses (
        id,
        name,
        address,
        business_type,
        slug
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching business claims:", error);
    return [];
  }

  return (data as BusinessClaim[]) || [];
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };

  const labels = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ClaimCard({ claim }: { claim: BusinessClaim }) {
  if (!claim.businesses) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {claim.businesses.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Type:</span> {claim.businesses.business_type}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Address:</span> {claim.businesses.address}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Submitted:</span> {formatDate(claim.created_at)}
          </p>
        </div>
        <div>
          <StatusBadge status={claim.status} />
        </div>
      </div>

      {claim.status === "rejected" && claim.admin_notes && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-red-900 mb-2">Admin Notes:</p>
          <p className="text-sm text-red-800">{claim.admin_notes}</p>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <Link
          href={`/business/${claim.businesses.slug}`}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          View Business
        </Link>
        {claim.status === "approved" && (
          <Link
            href={`/dashboard/business/${claim.business_id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Edit Business
          </Link>
        )}
      </div>
    </div>
  );
}

function EmptyState({ status }: { status: string }) {
  const messages = {
    pending: "You have no pending claims at the moment.",
    approved: "You have no approved claims yet.",
    rejected: "You have no rejected claims.",
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
      <div className="max-w-md mx-auto">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No {status} claims</h3>
        <p className="text-gray-600">
          {messages[status as keyof typeof messages] || "No claims to display."}
        </p>
      </div>
    </div>
  );
}

export default async function MyClaimsPage() {
  const user = await getUser();

  // Authentication check
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's business claims
  const claims = await getBusinessClaims(user.id);

  // Calculate stats
  const pendingClaims = claims.filter((c) => c.status === "pending");
  const approvedClaims = claims.filter((c) => c.status === "approved");
  const rejectedClaims = claims.filter((c) => c.status === "rejected");

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
          <span className="text-gray-900">My Claims</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">My Business Claims</h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="text-gray-600">
            View and manage your business claim requests. Claims are typically reviewed within 2-3 business days.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingClaims.length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedClaims.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedClaims.length}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Total Claims Check */}
        {claims.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Claims Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted any business claims. Claim a business to get started.
            </p>
            <Link
              href="/dashboard/claim-business"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Claim a Business
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            {/* Tabs - Simple Client-Side Approach using Radio Buttons */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    name="claim-tab"
                    value="pending"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <span className="block px-6 py-4 text-sm font-medium text-gray-600 border-b-2 border-transparent peer-checked:text-yellow-600 peer-checked:border-yellow-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                    Pending ({pendingClaims.length})
                  </span>
                </label>
                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    name="claim-tab"
                    value="approved"
                    className="sr-only peer"
                  />
                  <span className="block px-6 py-4 text-sm font-medium text-gray-600 border-b-2 border-transparent peer-checked:text-green-600 peer-checked:border-green-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                    Approved ({approvedClaims.length})
                  </span>
                </label>
                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    name="claim-tab"
                    value="rejected"
                    className="sr-only peer"
                  />
                  <span className="block px-6 py-4 text-sm font-medium text-gray-600 border-b-2 border-transparent peer-checked:text-red-600 peer-checked:border-red-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                    Rejected ({rejectedClaims.length})
                  </span>
                </label>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Pending Tab */}
              <div className="tab-content" data-tab="pending">
                {pendingClaims.length === 0 ? (
                  <EmptyState status="pending" />
                ) : (
                  <div className="space-y-4">
                    {pendingClaims.map((claim) => (
                      <ClaimCard key={claim.id} claim={claim} />
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Tab */}
              <div className="tab-content hidden" data-tab="approved">
                {approvedClaims.length === 0 ? (
                  <EmptyState status="approved" />
                ) : (
                  <div className="space-y-4">
                    {approvedClaims.map((claim) => (
                      <ClaimCard key={claim.id} claim={claim} />
                    ))}
                  </div>
                )}
              </div>

              {/* Rejected Tab */}
              <div className="tab-content hidden" data-tab="rejected">
                {rejectedClaims.length === 0 ? (
                  <EmptyState status="rejected" />
                ) : (
                  <div className="space-y-4">
                    {rejectedClaims.map((claim) => (
                      <ClaimCard key={claim.id} claim={claim} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-4">
            If you have questions about your claim status or need assistance, please contact our
            support team.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard/claim-business"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Submit New Claim
            </Link>
            <a
              href="mailto:support@sghalaldirectory.com"
              className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      {/* Add simple tab switching script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const radios = document.querySelectorAll('input[name="claim-tab"]');
              const tabContents = document.querySelectorAll('.tab-content');

              radios.forEach(radio => {
                radio.addEventListener('change', function() {
                  const selectedTab = this.value;

                  tabContents.forEach(content => {
                    if (content.dataset.tab === selectedTab) {
                      content.classList.remove('hidden');
                    } else {
                      content.classList.add('hidden');
                    }
                  });
                });
              });
            });
          `,
        }}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Singapore Halal Directory</h3>
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
