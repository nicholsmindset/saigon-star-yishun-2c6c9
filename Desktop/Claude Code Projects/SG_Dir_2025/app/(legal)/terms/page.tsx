import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Singapore Halal Business Directory',
  description: 'Review our terms of service, payment policies, and legal agreement for using the Singapore Halal Business Directory',
  robots: 'index, follow',
};

export default function TermsPage() {
  return (
    <div>
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Singapore Halal Business Directory website (halaldirectory.sg), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, you may not use this website. We reserve the right to modify these terms at any time, and your continued
          use of the website constitutes acceptance of any modifications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
        <p>
          We grant you a non-exclusive, non-transferable, revocable license to access and use this website for personal, non-commercial purposes.
          You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Reproduce, copy, or distribute any content from this website without written permission</li>
          <li>Use automated tools (bots, scrapers, crawlers) to extract data</li>
          <li>Attempt to gain unauthorized access to our systems or networks</li>
          <li>Use the website for any illegal purposes or in violation of any applicable laws</li>
          <li>Interfere with the operation of the website or its servers</li>
          <li>Upload malware, viruses, or malicious code</li>
          <li>Harass, threaten, or defame other users</li>
          <li>Use the website for commercial purposes without our prior written consent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Business Submission Requirements</h2>
        <p>
          When submitting business information to our directory, you warrant that:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>All information provided is accurate, complete, and truthful</li>
          <li>The business holds valid halal certification from a recognized certifying body</li>
          <li>You have the authority to submit information on behalf of the business</li>
          <li>The business information does not violate any third-party intellectual property rights</li>
          <li>All images and content submitted are original or properly licensed</li>
        </ul>
        <p className="mt-4">
          Submitted businesses undergo moderation within 2-3 business days. We reserve the right to reject submissions that do not meet
          our standards or contain inaccurate information. Repeated submission of false information may result in permanent listing suspension.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Featured Listings & Payment Terms</h2>
        <p>
          Featured listing upgrades are purchased on a one-time basis for durations of 1 month, 3 months, or 6 months at the following rates:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>1 Month:</strong> SGD $29</li>
          <li><strong>3 Months:</strong> SGD $75</li>
          <li><strong>6 Months:</strong> SGD $140</li>
        </ul>
        <p className="mt-4">
          <strong>Payment Processing:</strong> All payments are processed securely through Stripe, a PCI-DSS Level 1 compliant payment processor.
          We do not store full credit card details; Stripe manages all payment data securely in accordance with PCI standards.
        </p>
        <p className="mt-4">
          <strong>Refunds:</strong> We offer a 7-day money-back guarantee for featured listing purchases. Refund requests must be submitted within
          7 days of purchase. After the 7-day period, no refunds will be issued.
        </p>
        <p className="mt-4">
          <strong>Auto-Renewal Notice:</strong> Featured listings expire automatically at the end of the purchased period. You will receive an email
          notification 7 days before expiry. To prevent auto-renewal charges, you must cancel your subscription at least 48 hours before the expiry date.
          Cancellations submitted less than 48 hours before expiry may still be charged.
        </p>
        <p className="mt-4">
          <strong>Tax Responsibility:</strong> You are responsible for determining and paying any applicable taxes on your featured listing purchase.
          We recommend consulting with a tax professional regarding your tax obligations in Singapore.
        </p>
        <p className="mt-4">
          <strong>Price Changes:</strong> We reserve the right to change pricing for featured listings. Price changes will be announced at least
          30 days in advance. Continued use of the website constitutes acceptance of new pricing.
        </p>
        <p className="mt-4">
          <strong>Coupon Codes:</strong> Promotional coupon codes may be applied at checkout for discounts on featured listing purchases.
          Coupon terms are specified at the time of use.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. User-Generated Content</h2>
        <p>
          You retain ownership of all content you submit to the Singapore Halal Business Directory (business information, images, descriptions).
          By submitting content, you grant us a worldwide, royalty-free, non-exclusive license to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Display your content on the website</li>
          <li>Reproduce and distribute your content in connection with our services</li>
          <li>Create derivative works based on your content for improved functionality</li>
          <li>Archive and preserve your content for legal and historical purposes</li>
        </ul>
        <p className="mt-4">
          You warrant that you own or have the right to license all content you submit, and that your content does not infringe on any
          third-party intellectual property rights, including copyrights, trademarks, or patents.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Disclaimer of Warranties</h2>
        <p>
          THE SINGAPORE HALAL BUSINESS DIRECTORY IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
          WE SPECIFICALLY DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>MERCHANTABILITY - fitness for a particular purpose</li>
          <li>FITNESS FOR A PARTICULAR PURPOSE - suitability for your specific needs</li>
          <li>TITLE - accuracy or completeness of business information</li>
          <li>NON-INFRINGEMENT - third-party IP compliance</li>
          <li>UNINTERRUPTED SERVICE - continuous, error-free operation</li>
        </ul>
        <p className="mt-4">
          We do not warrant that:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Business information is accurate, complete, or up-to-date</li>
          <li>Halal certification information is verified or current</li>
          <li>The website will meet your specific requirements</li>
          <li>Service will be uninterrupted or error-free</li>
          <li>Defects will be corrected</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
        <p>
          IN NO EVENT SHALL SINGAPORE HALAL BUSINESS DIRECTORY, ITS OWNERS, OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>INDIRECT DAMAGES - lost profits, lost data, business interruption</li>
          <li>CONSEQUENTIAL DAMAGES - damages arising from use or inability to use the website</li>
          <li>SPECIAL DAMAGES - including but not limited to damages from inaccurate business information</li>
          <li>PUNITIVE DAMAGES - regardless of the form of action or basis of claim</li>
        </ul>
        <p className="mt-4">
          NOTWITHSTANDING ANY OTHER PROVISION OF THESE TERMS, THE TOTAL LIABILITY OF SINGAPORE HALAL BUSINESS DIRECTORY SHALL NOT EXCEED
          THE GREATER OF (A) THE AMOUNT YOU PAID FOR FEATURED LISTINGS IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) SGD $100.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites, including business websites and external resources. We do not endorse, warrant,
          or assume responsibility for the content, accuracy, or practices of these external sites. Your use of third-party websites is governed
          by their own terms and privacy policies. We are not responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Availability or reliability of third-party websites</li>
          <li>Content or services provided by third parties</li>
          <li>Business practices or policies of linked businesses</li>
          <li>Any disputes between you and third-party businesses</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Modifications will be effective immediately upon posting to
          the website. We will provide notice of significant changes by email or through prominent notices on the website. Your continued
          use of the website following notice of changes constitutes your acceptance of the modified terms. If you do not agree with
          modifications, you must discontinue use of the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws of Singapore, without regard to its conflict
          of laws principles. Any disputes arising from or relating to these terms or your use of the website shall be resolved through the
          following process:
        </p>
        <p className="mt-4">
          <strong>Step 1: Negotiation</strong> - If a dispute arises, you agree to notify us in writing with details of the dispute.
          We will attempt to resolve the dispute through good-faith negotiation within 30 days.
        </p>
        <p className="mt-4">
          <strong>Step 2: Mediation</strong> - If negotiation fails, either party may request mediation. Both parties agree to participate
          in mediation conducted by a mutually agreed-upon mediator or through the Singapore Mediation Centre. Mediation costs will be shared equally.
        </p>
        <p className="mt-4">
          <strong>Step 3: Arbitration</strong> - If mediation fails to resolve the dispute, either party may initiate binding arbitration
          through the Singapore International Arbitration Centre (SIAC). The arbitration shall be conducted in Singapore under SIAC rules.
          The arbitrator's decision shall be final and binding on both parties. Arbitration costs will be borne by the losing party.
        </p>
        <p className="mt-4">
          <strong>Jurisdiction:</strong> Both parties irrevocably submit to the exclusive jurisdiction of the Singapore courts for matters
          that cannot be resolved through arbitration.
        </p>
        <p className="mt-4">
          <strong>No Class Actions:</strong> You agree to bring disputes only in your individual capacity, not as a class member. Class action
          litigation is not permitted under these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
        <p>
          If you have questions about these Terms of Service or need to report a dispute, please contact us:
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p><strong>Legal Contact</strong></p>
          <p>Singapore Halal Business Directory</p>
          <p>Email: legal@halaldirectory.sg</p>
          <p>Response Time: Within 7 business days of receipt</p>
          <p className="text-sm text-gray-600 mt-2">
            Note: These Terms of Service may be updated periodically. We encourage you to review them regularly for any changes.
          </p>
        </div>
      </section>
    </div>
  );
}
