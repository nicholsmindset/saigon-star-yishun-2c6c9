
import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TESTIMONIALS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/gallery-1.webp"
            alt="Saigon Star Yishun - Premium Nail Art Masterpiece"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-brand-dark/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-nude via-transparent to-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <span className="block text-white uppercase tracking-[0.5em] text-xs font-bold mb-6 drop-shadow-md">
            Premium Artistry • Yishun Street 22
          </span>
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-8 tracking-tight drop-shadow-lg">
            Saigon <span className="italic text-brand-gold">Star</span>
          </h1>
          <p className="text-white/95 max-w-xl mx-auto mb-10 text-lg font-light leading-relaxed drop-shadow-sm">
            Where your nails become a canvas and your lashes find their perfect lift. <br />
            Elevating beauty standards in the heart of Yishun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/booking" className="bg-brand-gold text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-dark shadow-xl transition-all duration-300">
              Book Appointment
            </Link>
            <Link to="/services" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-white hover:text-brand-dark transition-all duration-300">
              Our Services
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-[1px] h-12 bg-white/40"></div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-brand-nude">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-4 block">Signature Look</span>
              <h2 className="text-4xl font-serif text-brand-dark">Client Favorites</h2>
            </div>
            <Link to="/services" className="text-brand-dark text-xs uppercase tracking-widest font-bold border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors">
              Full Menu
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.filter(s => s.popular).slice(0, 3).map((service, idx) => (
              <div key={service.id} className="group relative bg-white p-10 shadow-sm border border-brand-accent/10 hover-lift overflow-hidden">
                <div className="absolute -right-4 -top-4 text-brand-nude font-serif text-9xl opacity-50 z-0">
                  0{idx + 1}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-serif mb-4 text-brand-dark">{service.name}</h3>
                  <p className="text-sm text-brand-dark/60 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center border-t border-brand-accent pt-6">
                    <span className="text-brand-gold font-bold">{service.price}</span>
                    <Link to="/booking" className="text-[10px] uppercase tracking-widest font-bold text-brand-dark hover:text-brand-gold">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Value Section - High Quality Images */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/gallery-2.webp"
              alt="Saigon Star Yishun - Bespoke Intricate Nail Art"
              className="w-full h-80 object-cover mt-12 rounded-t-full shadow-lg border-2 border-brand-nude"
              loading="lazy"
            />
            <img
              src="/gallery-3.webp"
              alt="Saigon Star Yishun - Professional Nail Artistry"
              className="w-full h-80 object-cover rounded-b-full shadow-lg border-2 border-brand-nude"
              loading="lazy"
            />
          </div>
          <div>
            <span className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-4 block">The Saigon Star Standard</span>
            <h2 className="text-4xl font-serif text-brand-dark mb-8 leading-tight">Elite Artistry <br />for Every Occasion</h2>
            <p className="text-brand-dark/70 mb-10 leading-relaxed text-lg font-light">
              Our studio is more than just a beauty salon; it's a dedicated creative space. We specialize in complex, high-retention services that survive the hustle and bustle of Singapore life while looking absolutely flawless.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Intricate Hand-Painting', desc: 'Inspired by your vision. Every detail is painted by hand for a unique finish.' },
                { title: 'Japanese & Korean Gels', desc: 'Only the best, non-damaging soft gel systems for your natural nails.' },
                { title: 'Weightless Extensions', desc: 'Lashes so light you\'ll forget they are there, with retention up to 6 weeks.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-brand-gold flex items-center justify-center text-brand-gold text-[10px] shrink-0 mt-1">✓</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                    <p className="text-xs text-brand-dark/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="h-96 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.358212624419!2d103.8378!3d1.4334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141f237f8f96799%3A0x6b4c34a2c53a290e!2s291%20Yishun%20Street%2022%2C%20Singapore%20760291!5e0!3m2!1sen!2ssg!4v1700000000000!5m2!1sen!2ssg" 
          title="Saigon Star Yishun Location"
          className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 border-none"
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default Home;
