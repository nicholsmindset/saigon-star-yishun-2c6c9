
import React from 'react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="bg-white pt-24 sm:pt-32 pb-12 sm:pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <header className="text-center mb-12 sm:mb-20">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 sm:mb-4 block">Transparent Pricing</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-dark mb-6 sm:mb-8">Value in Every Stroke</h1>
          <p className="text-brand-dark/60 font-light leading-relaxed text-sm sm:text-base px-2">
            Premium ingredients, master technicians, and a sanctuary of calm.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Our prices reflect the artisan quality we bring to every appointment.
          </p>
        </header>

        <div className="space-y-10 sm:space-y-16">
          {/* Main List */}
          <div className="space-y-6 sm:space-y-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-brand-accent/30 pb-4 group gap-1 sm:gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h3 className="text-base sm:text-lg font-serif text-brand-dark group-hover:text-brand-gold transition-colors">{service.name}</h3>
                    {service.popular && <span className="bg-brand-blush text-brand-dark text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">Top Pick</span>}
                  </div>
                  <p className="text-xs text-brand-dark/40 italic">{service.duration}</p>
                </div>
                <div className="text-left sm:text-right mt-1 sm:mt-0">
                  <span className="text-brand-dark font-bold text-lg sm:text-xl">{service.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upsell Packages */}
          <div className="bg-brand-nude p-6 sm:p-12 text-center border-2 border-dashed border-brand-gold/30">
            <h2 className="text-xl sm:text-2xl font-serif text-brand-dark mb-3 sm:mb-4">Saigon Star VIP Packages</h2>
            <p className="text-sm text-brand-dark/60 mb-6 sm:mb-8">
              Unlock exclusive benefits and preferred pricing with our curated session packages.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-5 sm:p-6 shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Essential Duo</h4>
                <p className="text-xl sm:text-2xl font-serif text-brand-gold mb-3 sm:mb-4">$118 <span className="text-sm font-sans text-brand-dark/30">/ Value $135</span></p>
                <p className="text-[10px] text-brand-dark/60 leading-relaxed">Includes Signature Gel Manicure & Classic Pedicure.</p>
              </div>
              <div className="bg-white p-5 sm:p-6 shadow-sm border border-brand-gold/20">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Bridal Bliss</h4>
                <p className="text-xl sm:text-2xl font-serif text-brand-gold mb-3 sm:mb-4">$280 <span className="text-sm font-sans text-brand-dark/30">/ Value $330</span></p>
                <p className="text-[10px] text-brand-dark/60 leading-relaxed">The ultimate head-to-toe pampering for your big day.</p>
              </div>
            </div>
            <Link to="/contact" className="inline-block mt-6 sm:mt-8 text-[10px] uppercase tracking-widest font-bold border-b border-brand-gold pb-1">
              Enquire About Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
