'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import Link from 'next/link';

// Note: Metadata export must be in a separate server component wrapper or removed in client components
// For now, using client component for form functionality

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // TODO: Implement actual form submission (Supabase, email service, etc.)
    // For now, simulate submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', category: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Singapore Halal Directory',
    description: 'Get in touch with us for business inquiries, partnerships, or general questions',
    mainEntity: {
      '@type': 'Organization',
      name: 'Singapore Halal Directory',
      email: 'support@singaporehalaldir.com',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I add my business to the directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can submit your business through our Submit Business form. After verification of your MUIS halal certification, your listing will be approved and published.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take to get a response?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We typically respond to all inquiries within 24 hours during business days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I update my business information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Business owners can claim their listing and update information through their dashboard after verification.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I report incorrect information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our contact form and select "Report Issue" as the category. Provide details about the incorrect listing and we\'ll investigate immediately.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer advertising or partnership opportunities?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Contact us using the "Partnership" category or visit our Advertise page to learn about featured listing opportunities.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl text-green-50 leading-relaxed">
                Questions, feedback, or partnership inquiries? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="business_owner">Business Owner</option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="report">Report Issue</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                      Thank you! We've received your message and will respond within 24 hours.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                      Something went wrong. Please try again or email us directly at support@singaporehalaldir.com.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <a href="mailto:support@singaporehalaldir.com" className="text-green-600 hover:text-green-700">
                          support@singaporehalaldir.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                        <p className="text-gray-600">Within 24 hours during business days</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/submit-business" className="text-green-600 hover:text-green-700 font-medium">
                          → Submit Your Business
                        </Link>
                      </li>
                      <li>
                        <Link href="/dashboard/claim-business" className="text-green-600 hover:text-green-700 font-medium">
                          → Claim Your Listing
                        </Link>
                      </li>
                      <li>
                        <Link href="/advertise" className="text-green-600 hover:text-green-700 font-medium">
                          → Advertise with Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="text-green-600 hover:text-green-700 font-medium">
                          → About Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    How do I add my business to the directory?
                  </h3>
                  <p className="text-gray-600">
                    You can submit your business through our <Link href="/submit-business" className="text-green-600 hover:text-green-700 underline">Submit Business form</Link>. After verification of your MUIS halal certification, your listing will be approved and published.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    How long does it take to get a response?
                  </h3>
                  <p className="text-gray-600">
                    We typically respond to all inquiries within 24 hours during business days. Urgent issues are prioritized.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Can I update my business information?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Business owners can <Link href="/dashboard/claim-business" className="text-green-600 hover:text-green-700 underline">claim their listing</Link> and update information through their dashboard after verification.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    How do I report incorrect information?
                  </h3>
                  <p className="text-gray-600">
                    Use our contact form above and select "Report Issue" as the category. Provide details about the incorrect listing and we'll investigate immediately.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Do you offer advertising or partnership opportunities?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Contact us using the "Partnership" category or visit our <Link href="/advertise" className="text-green-600 hover:text-green-700 underline">Advertise page</Link> to learn about featured listing opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prefer to Browse First?
            </h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive directory of halal-certified businesses across Singapore.
            </p>
            <Link
              href="/directory"
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              Browse Directory
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
