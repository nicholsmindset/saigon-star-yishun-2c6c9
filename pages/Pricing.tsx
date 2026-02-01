
import React from 'react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="bg-white pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="text-center mb-20">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Transparent Pricing</span>
          <h1 className="text-5xl font-serif text-brand-dark mb-8">Value in Every Stroke</h1>
          <p className="text-brand-dark/60 font-light leading-relaxed">
            Premium ingredients, master technicians, and a sanctuary of calm. <br />
            Our prices reflect the artisan quality we bring to every appointment.
          </p>
        </header>

        <div className="space-y-16">
          {/* Main List */}
          <div className="space-y-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="flex justify-between items-end border-b border-brand-accent/30 pb-4 group">
                <div className="flex-grow">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-serif text-brand-dark group-hover:text-brand-gold transition-colors">{service.name}</h3>
                    {service.popular && <span className="bg-brand-blush text-brand-dark text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">Top Pick</span>}
                  </div>
                  <p className="text-xs text-brand-dark/40 italic">{service.duration}</p>
                </div>
                <div className="text-right">
                  <span className="text-brand-dark font-bold text-xl">{service.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upsell Packages */}
          <div className="bg-brand-nude p-12 text-center border-2 border-dashed border-brand-gold/30">
            <h2 className="text-2xl font-serif text-brand-dark mb-4">Saigon Star VIP Packages</h2>
            <p className="text-sm text-brand-dark/60 mb-8">
              Unlock exclusive benefits and preferred pricing with our curated session packages.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Essential Duo</h4>
                <p className="text-2xl font-serif text-brand-gold mb-4">$118 <span className="text-sm font-sans text-brand-dark/30">/ Value $135</span></p>
                <p className="text-[10px] text-brand-dark/60 leading-relaxed">Includes Signature Gel Manicure & Classic Pedicure.</p>
              </div>
              <div className="bg-white p-6 shadow-sm border border-brand-gold/20">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Bridal Bliss</h4>
                <p className="text-2xl font-serif text-brand-gold mb-4">$280 <span className="text-sm font-sans text-brand-dark/30">/ Value $330</span></p>
                <p className="text-[10px] text-brand-dark/60 leading-relaxed">The ultimate head-to-toe pampering for your big day.</p>
              </div>
            </div>
            <Link to="/contact" className="inline-block mt-8 text-[10px] uppercase tracking-widest font-bold border-b border-brand-gold pb-1">
              Enquire About Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
