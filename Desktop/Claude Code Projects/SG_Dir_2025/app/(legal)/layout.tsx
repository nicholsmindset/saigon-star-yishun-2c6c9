import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          {children}
        </article>
      </main>
      <footer className="mt-16 border-t pt-8 pb-8 text-sm text-gray-600">
        <div className="container mx-auto px-4 flex justify-center gap-6">
          <Link href="/legal/privacy" className="hover:text-gray-900">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/legal/terms" className="hover:text-gray-900">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
