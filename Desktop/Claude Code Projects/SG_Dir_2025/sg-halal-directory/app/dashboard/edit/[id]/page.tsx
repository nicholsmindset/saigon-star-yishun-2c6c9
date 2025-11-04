import Link from "next/link";
import Header from "@/components/Header";
import { getUser } from "@/app/actions/auth";
import { getBusinessForEdit } from "@/app/actions/business";
import { redirect } from "next/navigation";
import EditBusinessForm from "./EditBusinessForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Business - Singapore Halal Directory",
  description: "Update your business information.",
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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBusinessPage({ params }: PageProps) {
  const user = await getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const business = await getBusinessForEdit(id);

  // Redirect if business not found or user doesn't own it
  if (!business) {
    redirect("/dashboard");
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
          <span className="text-gray-900">Edit Business</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Business Information
              </h1>
              <p className="text-gray-600">
                Update your business details below. Changes will be visible on your public listing.
              </p>
            </div>
            {business.is_featured && (
              <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Important Notes</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>All changes are saved immediately and reflected on your public listing</li>
              <li>Business name and address are required fields</li>
              <li>Ensure all information is accurate and up-to-date</li>
              <li>Contact information helps customers reach you</li>
            </ul>
          </div>

          <EditBusinessForm business={business} />
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
