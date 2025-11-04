import Link from "next/link";
import Header from "@/components/Header";
import { getUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ClaimBusinessForm from "./ClaimBusinessForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Your Business - Singapore Halal Directory",
  description: "Claim ownership of your halal business listing.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
    "max-snippet": -1,
    "max-image-preview": "none",
    "max-video-preview": -1,
  },
};

export default async function ClaimBusinessPage() {
  const user = await getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all approved businesses for the dropdown
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, business_type, address, claimed_by")
    .eq("status", "approved")
    .order("name");

  // Filter out businesses that are already claimed
  const unclaimedBusinesses = businesses?.filter((b) => !b.claimed_by) || [];

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
          <span className="text-gray-900">Claim Business</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Claim Your Business
          </h1>
          <p className="text-gray-600 mb-8">
            Submit a claim to verify your ownership of a business listing. Once approved by our admin team,
            you'll be able to edit your business information and upgrade to featured status.
          </p>

          {unclaimedBusinesses.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 mb-4">
                All businesses in our directory have been claimed. If you don't see your business,
                please contact our admin team to add it to the directory first.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">What happens after I submit?</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Our admin team will review your claim request</li>
                  <li>You'll receive an email notification once reviewed</li>
                  <li>If approved, you can edit your business details and upgrade to featured</li>
                  <li>Review typically takes 1-2 business days</li>
                </ul>
              </div>

              <ClaimBusinessForm businesses={unclaimedBusinesses} userEmail={user.email || ""} />
            </>
          )}
        </div>
      </main>

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
