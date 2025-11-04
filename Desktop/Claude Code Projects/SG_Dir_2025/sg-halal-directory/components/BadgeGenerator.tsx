'use client';

import { useState, useEffect } from 'react';
import { getClaimedBusinesses, type ClaimedBusiness } from '@/app/actions/badge';

interface BadgeGeneratorProps {
  userId: string;
}

export default function BadgeGenerator({ userId }: BadgeGeneratorProps) {
  const [businesses, setBusinesses] = useState<ClaimedBusiness[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedAnchor, setCopiedAnchor] = useState(false);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const data = await getClaimedBusinesses(userId);
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedBusinessId(data[0].id);
        }
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, [userId]);

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sghalaldirectory.com';
  const businessUrl = selectedBusiness ? `${siteUrl}/business/${selectedBusiness.id}` : '';

  const htmlEmbed = selectedBusiness
    ? `<a href="${businessUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${siteUrl}/badge.svg" alt="Singapore Halal Directory - ${selectedBusiness.name}" width="200" height="80" />
</a>`
    : '';

  const anchorText = selectedBusiness
    ? `<a href="${businessUrl}" target="_blank" rel="noopener noreferrer" style="color: #059669; font-weight: 600; text-decoration: none;">
  Halal Certified - Listed on Singapore Halal Directory
</a>`
    : '';

  const copyToClipboard = async (text: string, type: 'html' | 'anchor') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'html') {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else {
        setCopiedAnchor(true);
        setTimeout(() => setCopiedAnchor(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Claimed Businesses
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You need to claim a business first before you can generate a badge.
            Visit your dashboard to claim your business listing.
          </p>
          <a
            href="/dashboard/claim-business"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            Claim a Business
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Your Badge
      </h2>

      {/* Business Selection */}
      <div className="mb-8">
        <label htmlFor="business-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Business
        </label>
        <select
          id="business-select"
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name} - {business.address}
            </option>
          ))}
        </select>
      </div>

      {selectedBusiness && (
        <>
          {/* Preview Section */}
          <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Preview
            </h3>
            <div className="bg-white rounded-lg p-6 border border-gray-300">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">HTML Badge Preview:</p>
                  <div className="inline-block">
                    <a
                      href={businessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block hover:opacity-80 transition-opacity"
                    >
                      <img
                        src="/badge.svg"
                        alt="Singapore Halal Directory Certified"
                        width="200"
                        height="80"
                        className="shadow-md rounded-lg"
                      />
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Anchor Text Preview:</p>
                  <a
                    href={businessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 underline"
                  >
                    Halal Certified - Listed on Singapore Halal Directory
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Option 1: HTML Embed */}
          <div className="mb-8 border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Option 1: HTML Badge Embed
                </h3>
                <p className="text-sm text-gray-600">
                  Display our badge image with a link to your business listing
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                RECOMMENDED
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-800 overflow-x-auto">
                <code>{htmlEmbed}</code>
              </pre>
            </div>

            <button
              onClick={() => copyToClipboard(htmlEmbed, 'html')}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                copiedHtml
                  ? 'bg-green-600 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {copiedHtml ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to Clipboard!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy HTML Code
                </span>
              )}
            </button>
          </div>

          {/* Option 2: Branded Anchor Text */}
          <div className="mb-8 border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Option 2: Branded Anchor Text
              </h3>
              <p className="text-sm text-gray-600">
                Simple text link without image (ideal for footer or minimal designs)
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                <code>{anchorText}</code>
              </pre>
            </div>

            <button
              onClick={() => copyToClipboard(anchorText, 'anchor')}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                copiedAnchor
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copiedAnchor ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to Clipboard!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Anchor Text Code
                </span>
              )}
            </button>
          </div>

          {/* Implementation Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Implementation Instructions
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Copy the code above (HTML Badge or Anchor Text)</li>
                  <li>• Paste it into your website's footer or sidebar</li>
                  <li>• Common file locations: footer.html, index.html, or theme footer.php</li>
                  <li>• Make sure the link is visible and clickable (not hidden)</li>
                  <li>• Our system will verify the backlink within 24-48 hours</li>
                  <li>• Once verified, you'll receive 1 free month of featured listing!</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
