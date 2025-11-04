"use client";

import { signOut } from "@/app/actions/auth";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
    >
      Sign Out
    </button>
  );
}
