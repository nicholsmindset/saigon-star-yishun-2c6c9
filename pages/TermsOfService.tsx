import React from 'react';
import { BUSINESS_CONFIG } from '../config/business';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-brand-nude pt-24 sm:pt-32 pb-12 sm:pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <header className="text-center mb-10 sm:mb-16">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 sm:mb-4 block">
            Legal Information
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-dark mb-4 sm:mb-6">Terms of Service</h1>
          <p className="text-brand-dark/60 text-sm">
            Last Updated: February 1, 2026
          </p>
        </header>

        <div className="bg-white p-5 sm:p-12 shadow-lg space-y-6 sm:space-y-8 text-brand-dark/80">
          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using the services of {BUSINESS_CONFIG.name}, you accept and agree to be
              bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">2. Appointment Booking</h2>

            <h3 className="text-lg font-bold mb-2">Reservations</h3>
            <p className="leading-relaxed mb-4">
              Appointments can be made through our website, WhatsApp, or by phone. All bookings are
              subject to availability and confirmation.
            </p>

            <h3 className="text-lg font-bold mb-2">Deposits</h3>
            <p className="leading-relaxed mb-4">
              For certain services or first-time customers, we may require a deposit to secure your appointment.
              This deposit will be applied to your final service cost.
            </p>

            <h3 className="text-lg font-bold mb-2">Confirmation</h3>
            <p className="leading-relaxed">
              We will send you a confirmation via WhatsApp or SMS. Please ensure your contact details are accurate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">3. Cancellation & Rescheduling Policy</h2>

            <h3 className="text-lg font-bold mb-2">Cancellations</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>24 hours or more notice:</strong> Full refund or credit for future service</li>
              <li><strong>Less than 24 hours:</strong> 50% cancellation fee may apply</li>
              <li><strong>No-show:</strong> Full service charge will be applied, deposit forfeited</li>
            </ul>

            <h3 className="text-lg font-bold mb-2">Rescheduling</h3>
            <p className="leading-relaxed mb-4">
              We understand plans change. Please contact us at least 24 hours in advance to reschedule.
              Frequent last-minute changes may result in deposit requirements for future bookings.
            </p>

            <h3 className="text-lg font-bold mb-2">Late Arrivals</h3>
            <p className="leading-relaxed">
              Please arrive on time for your appointment. If you are more than 15 minutes late, we may
              need to shorten your service time or reschedule, and cancellation fees may apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">4. Payment Terms</h2>

            <h3 className="text-lg font-bold mb-2">Accepted Methods</h3>
            <p className="leading-relaxed mb-4">
              We accept cash, PayNow, credit/debit cards, and other digital payment methods.
            </p>

            <h3 className="text-lg font-bold mb-2">Pricing</h3>
            <p className="leading-relaxed mb-4">
              All prices are in Singapore Dollars (SGD) and inclusive of GST where applicable.
              Prices are subject to change without prior notice, but confirmed bookings will honor
              the quoted price.
            </p>

            <h3 className="text-lg font-bold mb-2">Additional Services</h3>
            <p className="leading-relaxed">
              Any additional services requested during your appointment will be charged accordingly.
              We will inform you of costs before proceeding.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">5. Service Policies</h2>

            <h3 className="text-lg font-bold mb-2">Health & Safety</h3>
            <p className="leading-relaxed mb-4">
              Please inform us of any allergies, sensitivities, medical conditions, or medications
              that may affect your service. We reserve the right to refuse service if we believe
              it may pose a health risk.
            </p>

            <h3 className="text-lg font-bold mb-2">Service Results</h3>
            <p className="leading-relaxed mb-4">
              While we strive for excellence, individual results may vary based on natural nail/lash
              condition, aftercare, and lifestyle. We cannot guarantee specific retention periods.
            </p>

            <h3 className="text-lg font-bold mb-2">Aftercare</h3>
            <p className="leading-relaxed mb-4">
              Proper aftercare is essential for service longevity. We will provide aftercare instructions,
              and following them is your responsibility. Services compromised by improper care are not
              eligible for free corrections.
            </p>

            <h3 className="text-lg font-bold mb-2">Touch-Ups & Corrections</h3>
            <p className="leading-relaxed">
              If you experience issues within 7 days of your service, please contact us for a complimentary
              assessment and correction (if applicable). Issues reported after 7 days may incur additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">6. Client Conduct</h2>
            <p className="leading-relaxed mb-4">
              We are committed to providing a comfortable, safe environment for all clients and staff.
              We reserve the right to refuse or discontinue service to anyone who:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Displays disrespectful, abusive, or inappropriate behavior</li>
              <li>Arrives intoxicated or under the influence</li>
              <li>Violates our policies or disrupts salon operations</li>
              <li>Has outstanding unpaid balances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">7. Photography & Social Media</h2>
            <p className="leading-relaxed mb-4">
              We may photograph your nails/lashes for our portfolio, website, and social media. If you
              do not wish to be photographed, please inform us at the start of your appointment.
            </p>
            <p className="leading-relaxed">
              By allowing photography, you grant {BUSINESS_CONFIG.name} permission to use these images
              for promotional purposes without compensation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">8. Liability</h2>

            <h3 className="text-lg font-bold mb-2">Limitation of Liability</h3>
            <p className="leading-relaxed mb-4">
              {BUSINESS_CONFIG.name} is not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Allergic reactions to products (when pre-existing conditions were not disclosed)</li>
              <li>Damage caused by improper aftercare</li>
              <li>Natural nail/lash damage from removal performed elsewhere</li>
              <li>Loss or damage to personal belongings</li>
            </ul>

            <h3 className="text-lg font-bold mb-2">Indemnification</h3>
            <p className="leading-relaxed">
              You agree to indemnify and hold {BUSINESS_CONFIG.name} harmless from any claims arising
              from your failure to disclose relevant health information or follow aftercare instructions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">9. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content on our website, including text, graphics, logos, and images, is the property
              of {BUSINESS_CONFIG.name} and protected by copyright laws. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">10. Privacy</h2>
            <p className="leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <a href="/#/privacy-policy" className="text-brand-gold hover:underline">Privacy Policy</a>{' '}
              to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">11. Modifications to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be
              posted on this page with an updated date. Continued use of our services constitutes
              acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">12. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms of Service are governed by the laws of Singapore. Any disputes shall be
              subject to the exclusive jurisdiction of Singapore courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">13. Contact Information</h2>
            <p className="leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-brand-blush/30 p-6 rounded">
              <p className="font-bold mb-2">{BUSINESS_CONFIG.name}</p>
              <p>{BUSINESS_CONFIG.location.fullAddress}</p>
              <p className="mt-2">Phone: <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="text-brand-gold hover:underline">{BUSINESS_CONFIG.contact.phoneDisplay}</a></p>
              <p>Email: <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} className="text-brand-gold hover:underline">{BUSINESS_CONFIG.contact.email}</a></p>
              <p className="mt-2">WhatsApp: <a href={`https://wa.me/${BUSINESS_CONFIG.contact.whatsapp}`} className="text-brand-gold hover:underline" target="_blank" rel="noopener noreferrer">{BUSINESS_CONFIG.contact.phoneDisplay}</a></p>
            </div>
          </section>

          <section className="border-t border-brand-accent pt-8">
            <p className="text-sm text-brand-dark/60 italic">
              By booking and receiving services at {BUSINESS_CONFIG.name}, you acknowledge that you
              have read, understood, and agree to these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
