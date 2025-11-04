import Link from "next/link";
import { getUser } from "@/app/actions/auth";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="bg-white shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">
              Singapore Halal Directory
            </h1>
            <p className="text-sm text-emerald-700 mt-1">
              Discover certified halal businesses across Singapore
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/"
              className="px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <SignOutButton />
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
