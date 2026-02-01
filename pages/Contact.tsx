
import React from 'react';
import { SERVICES } from '../constants';
import { BUSINESS_CONFIG, getWhatsAppBookingLink, getPhoneCallLink, getFormattedHours } from '../config/business';

const Contact: React.FC = () => {
  return (
    <div className="bg-brand-nude pt-24 sm:pt-32 pb-12 sm:pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="text-center mb-12 sm:mb-20">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 sm:mb-4 block">Connect with Saigon Star</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-dark mb-6 sm:mb-8">Visit Our Studio</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-start">
          {/* Info Side */}
          <div className="space-y-8 sm:space-y-12">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-3 sm:mb-4">Location</h3>
              <p className="text-lg sm:text-xl font-serif text-brand-dark mb-2">{BUSINESS_CONFIG.location.address}</p>
              <p className="text-brand-dark/60 text-sm">{BUSINESS_CONFIG.location.unit}<br />{BUSINESS_CONFIG.location.city} {BUSINESS_CONFIG.location.postalCode}</p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-3 sm:mb-4">Contact</h3>
              <a href={getPhoneCallLink()} className="text-lg sm:text-xl font-serif text-brand-dark mb-2 block hover:text-brand-gold transition-colors">
                {BUSINESS_CONFIG.contact.phoneDisplay}
              </a>
              <p className="text-brand-dark/60 text-sm">Direct message us on Facebook or WhatsApp for immediate bookings.</p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-3 sm:mb-4">Studio Hours</h3>
              <div className="space-y-2 text-sm text-brand-dark/70">
                <div className="flex justify-between w-full max-w-xs border-b border-brand-accent pb-2">
                  <span>{BUSINESS_CONFIG.hours.weekday.days}</span>
                  <span className="font-bold">{BUSINESS_CONFIG.hours.weekday.open} - {BUSINESS_CONFIG.hours.weekday.close}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs border-b border-brand-accent pb-2">
                  <span>{BUSINESS_CONFIG.hours.weekend.days}</span>
                  <span className="font-bold">{BUSINESS_CONFIG.hours.weekend.open} - {BUSINESS_CONFIG.hours.weekend.close}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-8">
               <a
                href={getWhatsAppBookingLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-dark text-white px-8 sm:px-10 py-4 sm:py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors block text-center lg:inline-block shadow-lg"
              >
                WhatsApp Booking
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-6 sm:p-12 shadow-2xl border border-brand-accent/20 rounded-sm">
            <h3 className="text-xl sm:text-2xl font-serif text-brand-dark mb-6 sm:mb-8">Quick Enquiry</h3>
            <form className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 block">Name</label>
                  <input type="text" className="w-full border-b border-brand-accent/40 py-2 outline-none focus:border-brand-gold text-sm bg-transparent transition-colors" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 block">Mobile Number</label>
                  <input type="tel" className="w-full border-b border-brand-accent/40 py-2 outline-none focus:border-brand-gold text-sm bg-transparent transition-colors" placeholder="+65" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 block">Service of Interest</label>
                <select className="w-full border-b border-brand-accent/40 py-2 outline-none focus:border-brand-gold text-sm bg-transparent appearance-none transition-colors">
                  <option value="">Select a service...</option>
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - {s.price}</option>
                  ))}
                  <option value="Bridal">Bridal Package Enquiry</option>
                  <option value="Custom">Custom Art Design</option>
                  <option value="Other">Other Enquiries</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 block">Your Message</label>
                <textarea rows={3} className="w-full border-b border-brand-accent/40 py-2 outline-none focus:border-brand-gold text-sm resize-none bg-transparent transition-colors" placeholder="Tell us more about your request..."></textarea>
              </div>
              <button
                type="button"
                onClick={() => alert("Enquiry submitted! Our concierge will reach out via WhatsApp/Phone soon.")}
                className="w-full bg-brand-gold text-white py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-dark transition-all duration-300 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
