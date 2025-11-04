import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Singapore Halal Business Directory',
  description: 'Learn how we protect your personal data and comply with Singapore PDPA regulations',
  robots: 'index, follow',
};

export default function PrivacyPage() {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p>
          Singapore Halal Business Directory ("we", "our", "us") operates the halaldirectory.sg website.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data
          in accordance with the Personal Data Protection Act (PDPA) of Singapore.
        </p>
        <p className="mt-4">
          By accessing and using our website, you acknowledge that you have read, understood, and agree
          to be bound by all the terms of this Privacy Policy. If you do not agree with our practices,
          please do not use our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Personal Data Collection</h2>
        <p>We collect the following categories of personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Business Information:</strong> Business name, address, contact details, business registration number, halal certification details submitted through our business submission form</li>
          <li><strong>Location Data:</strong> Geographic coordinates (latitude/longitude) obtained via address geocoding through our partnership with Nominatim API</li>
          <li><strong>Contact Information:</strong> Email addresses and phone numbers for business contact and notifications regarding submission status</li>
          <li><strong>User Interactions:</strong> Search queries, page views, clicks, and timestamps for analytics and service improvement</li>
          <li><strong>Payment Information:</strong> For featured listings, payment information processed securely through Stripe (we do not directly store full payment card details)</li>
          <li><strong>Ownership Verification:</strong> Name, email, and supporting documents when claiming business ownership</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Data Usage Purposes</h2>
        <p>We use your personal data for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Display business information in our directory and directory pages</li>
          <li>Send email notifications for business submission status, updates, and featured listing expiry reminders</li>
          <li>Verify business halal status and certification information</li>
          <li>Process payments for featured listing subscriptions</li>
          <li>Manage business ownership claims and verification</li>
          <li>Improve website functionality and user experience through analytics</li>
          <li>Comply with legal and regulatory obligations under Singapore law</li>
          <li>Prevent fraud and unauthorized access</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Third-Party Data Processors</h2>
        <p>
          We engage the following third-party service providers who process your personal data on our behalf
          in accordance with data processing agreements:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>Supabase (Database & Authentication):</strong> Stores business data, user submissions, and authentication
            credentials with encryption at rest using AWS KMS. Supabase complies with GDPR and maintains security certifications.
          </li>
          <li>
            <strong>Resend (Email Service):</strong> Delivers transactional emails and notifications; data processed in compliance
            with their privacy policy and GDPR standards.
          </li>
          <li>
            <strong>Nominatim (Geocoding API):</strong> Converts addresses to geographic coordinates for mapping display;
            coordinates stored locally, queries cached to minimize external requests.
          </li>
          <li>
            <strong>Cloudinary (Image Storage):</strong> Stores and serves business images with CDN optimization and
            security features including SSL/TLS encryption.
          </li>
          <li>
            <strong>Stripe (Payment Processing):</strong> PCI-DSS Level 1 compliant payment processor; we do not handle
            payment card data directly - Stripe manages all payment details securely.
          </li>
        </ul>
        <p className="mt-4">
          All third-party processors have agreed to maintain confidentiality and implement appropriate security measures
          in accordance with the PDPA and international data protection standards.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
        <p>We retain personal data for the following periods:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Active Business Listings:</strong> Retained indefinitely while business account is active</li>
          <li><strong>Inactive Listings:</strong> Archived after 6 months of inactivity; permanently deleted after 24 months</li>
          <li><strong>Database Backups:</strong> Retained for 30 days for disaster recovery purposes</li>
          <li><strong>Email Logs:</strong> Retained for 90 days for support and compliance purposes</li>
          <li><strong>Payment Records:</strong> Retained for 7 years per Singapore tax and accounting regulations</li>
          <li><strong>Analytics Data:</strong> Retained for 12 months for performance analysis; older data anonymized</li>
          <li><strong>Deletion Requests:</strong> User data deleted within 14 days of verified deletion request (except where legally required)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Your Rights Under PDPA</h2>
        <p>
          Under the Singapore Personal Data Protection Act, you have the following rights regarding your personal data:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>Right of Access:</strong> Request access to your personal data held by us. We will provide you with a copy
            of your data in a commonly used format.
          </li>
          <li>
            <strong>Right of Correction:</strong> Request correction of inaccurate, incomplete, or misleading personal data.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time (except where legally required
            to process for regulatory compliance).
          </li>
          <li>
            <strong>Right to Deletion:</strong> Request deletion of your personal data, subject to legal retention obligations
            and our legitimate business needs.
          </li>
          <li>
            <strong>Right to Opt-Out:</strong> Opt-out of marketing communications, analytics tracking, and non-essential data processing.
          </li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, contact us at privacy@halaldirectory.sg with clear details of your request.
          We will respond to your request within 14 days in accordance with PDPA requirements. You may be required to provide
          proof of identity for verification purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Security Measures</h2>
        <p>We implement the following comprehensive security measures to protect your personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Encryption in Transit:</strong> All data transmitted via HTTPS/TLS 1.3 standard encryption</li>
          <li><strong>Encryption at Rest:</strong> Database encryption using AWS KMS with automatic key rotation</li>
          <li><strong>Access Controls:</strong> Role-based access control (RBAC) limiting employee data access to business-necessary minimum</li>
          <li><strong>Authentication:</strong> Multi-factor authentication (MFA) for all admin accounts and business owner access</li>
          <li><strong>Monitoring:</strong> Continuous security monitoring, intrusion detection, and audit logging</li>
          <li><strong>Incident Response:</strong> Data breach notification to affected individuals within 30 days per PDPA requirements</li>
          <li><strong>Vendor Security:</strong> Regular security audits of third-party processors and data storage providers</li>
        </ul>
        <p className="mt-4">
          While we strive to protect your data with industry-standard security practices, no security system is completely impenetrable.
          We encourage you to use strong passwords, enable multi-factor authentication, and notify us immediately of any unauthorized
          access to your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
        <p>
          If you have questions about this Privacy Policy, your personal data, or wish to exercise any of your rights under PDPA,
          please contact us:
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p><strong>Privacy Officer</strong></p>
          <p>Singapore Halal Business Directory</p>
          <p>Email: privacy@halaldirectory.sg</p>
          <p>Response Time: Within 14 days of receipt</p>
          <p className="text-sm text-gray-600 mt-2">
            Note: This Privacy Policy may be updated periodically. We encourage you to review it regularly for any changes.
          </p>
        </div>
      </section>
    </div>
  );
}
