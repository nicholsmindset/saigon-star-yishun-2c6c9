import React from 'react';
import { BUSINESS_CONFIG } from '../config/business';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-brand-nude pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="text-center mb-16">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
            Legal Information
          </span>
          <h1 className="text-5xl font-serif text-brand-dark mb-6">Privacy Policy</h1>
          <p className="text-brand-dark/60 text-sm">
            Last Updated: February 1, 2026
          </p>
        </header>

        <div className="bg-white p-12 shadow-lg space-y-8 text-brand-dark/80">
          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              {BUSINESS_CONFIG.name} ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-bold mb-2">Personal Information</h3>
            <p className="leading-relaxed mb-4">
              When you book an appointment or contact us, we may collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and contact information (phone number, email address)</li>
              <li>Appointment preferences and service selections</li>
              <li>Special requests or health information relevant to services</li>
              <li>Payment information (if applicable)</li>
            </ul>

            <h3 className="text-lg font-bold mb-2 mt-6">Automatically Collected Information</h3>
            <p className="leading-relaxed mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website or source</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process and confirm your appointments</li>
              <li>Communicate with you about services, promotions, and updates</li>
              <li>Improve our website and customer experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and maintain security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">4. Information Sharing</h2>
            <p className="leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties.
              We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Service providers who assist in our operations (booking systems, payment processors)</li>
              <li>Legal authorities when required by law</li>
              <li>Business successors in the event of a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">6. Your Rights (PDPA Compliance)</h2>
            <p className="leading-relaxed mb-4">
              Under Singapore's Personal Data Protection Act (PDPA), you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data we hold</li>
              <li>Request correction of inaccurate data</li>
              <li>Withdraw consent for data processing (subject to legal obligations)</li>
              <li>Request deletion of your data when legally permissible</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us at {BUSINESS_CONFIG.contact.email} or
              call {BUSINESS_CONFIG.contact.phoneDisplay}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">7. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our website.
              You can control cookie preferences through your browser settings. Note that disabling cookies
              may affect website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">8. Third-Party Links</h2>
            <p className="leading-relaxed">
              Our website may contain links to third-party websites (e.g., Instagram, Facebook).
              We are not responsible for the privacy practices of these external sites. We encourage
              you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">9. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our services are not directed to individuals under 16 years of age. We do not knowingly
              collect personal information from children. If you believe we have inadvertently collected
              such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this
              page with an updated "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">11. Contact Us</h2>
            <p className="leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-brand-blush/30 p-6 rounded">
              <p className="font-bold mb-2">{BUSINESS_CONFIG.name}</p>
              <p>{BUSINESS_CONFIG.location.fullAddress}</p>
              <p className="mt-2">Phone: <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="text-brand-gold hover:underline">{BUSINESS_CONFIG.contact.phoneDisplay}</a></p>
              <p>Email: <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} className="text-brand-gold hover:underline">{BUSINESS_CONFIG.contact.email}</a></p>
            </div>
          </section>

          <section className="border-t border-brand-accent pt-8">
            <p className="text-sm text-brand-dark/60 italic">
              By using our website and services, you acknowledge that you have read and understood
              this Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
