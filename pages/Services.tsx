
import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { ServiceCategory } from '../types';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');

  const filteredServices = activeCategory === 'All' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  const categories = ['All', ...Object.values(ServiceCategory)];

  return (
    <div className="bg-brand-nude pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <header className="text-center mb-16">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Our Curated Menu</span>
          <h1 className="text-5xl font-serif text-brand-dark mb-6">Signature Artistry</h1>
          <p className="text-brand-dark/60 max-w-2xl mx-auto font-light leading-relaxed">
            From essential maintenance to elaborate artistic masterpieces, our services are designed to pamper and perfect.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 ${activeCategory === cat ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-dark/40 hover:text-brand-dark'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white p-8 border border-brand-accent/20 group hover-lift flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <span className="text-[10px] bg-brand-blush text-brand-dark px-3 py-1 uppercase tracking-widest font-bold">
                  {service.category}
                </span>
                {service.popular && (
                  <span className="text-[10px] text-brand-gold border border-brand-gold px-2 py-1 uppercase tracking-tighter font-bold">
                    Most Popular
                  </span>
                )}
              </div>
              <h3 className="text-xl font-serif text-brand-dark mb-3">{service.name}</h3>
              <p className="text-sm text-brand-dark/60 mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-brand-dark/40 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {service.duration}
                </span>
                <span className="text-brand-gold font-bold">{service.price}</span>
              </div>
              <Link 
                to="/booking" 
                className="block text-center bg-brand-dark text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-colors"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
