
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS_CONFIG, getWhatsAppBookingLink } from '../config/business';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-effect shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-brand-dark flex items-center gap-2">
          <span className="text-brand-gold italic">Saigon</span>
          <span className="hidden sm:inline font-light text-sm uppercase tracking-[0.2em] pt-1">Star Yishun</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors hover:text-brand-gold ${location.pathname === link.path ? 'text-brand-gold' : 'text-brand-dark'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/booking" className="bg-brand-gold text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark transition-all duration-300">
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-brand-dark p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-brand-nude z-40 transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-center px-6">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-brand-dark hover:text-brand-gold"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/booking" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full max-w-xs bg-brand-gold text-white py-4 text-sm uppercase tracking-widest font-bold"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-brand-dark text-white pt-20 pb-10">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6 tracking-widest text-brand-gold italic">Saigon Star</h2>
          <p className="text-brand-blush/70 text-sm leading-relaxed mb-6">
            Premier lash and nail artistry in Yishun. We combine meticulous technique with premium materials for results that speak for themselves.
          </p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/saigonstarss/" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Facebook</a>
            <a href="https://www.instagram.com/saigonstarss/" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Instagram</a>
          </div>
        </div>
        
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-brand-gold">Opening Hours</h3>
          <ul className="text-sm space-y-3 text-brand-blush/70">
            <li className="flex justify-between">
              <span>{BUSINESS_CONFIG.hours.weekday.days}</span>
              <span>{BUSINESS_CONFIG.hours.weekday.open} - {BUSINESS_CONFIG.hours.weekday.close}</span>
            </li>
            <li className="flex justify-between">
              <span>{BUSINESS_CONFIG.hours.weekend.days}</span>
              <span>{BUSINESS_CONFIG.hours.weekend.open} - {BUSINESS_CONFIG.hours.weekend.close}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-brand-gold">Location</h3>
          <ul className="text-sm space-y-3 text-brand-blush/70">
            <li>{BUSINESS_CONFIG.location.address}</li>
            <li>{BUSINESS_CONFIG.location.unit}, {BUSINESS_CONFIG.location.city} {BUSINESS_CONFIG.location.postalCode}</li>
            <li>
              <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="hover:text-brand-gold transition-colors">
                {BUSINESS_CONFIG.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} className="hover:text-brand-gold transition-colors">
                {BUSINESS_CONFIG.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-brand-gold">Our Ethos</h3>
          <p className="text-xs text-brand-blush/60 leading-relaxed">
            Professional. Clean. Artisan. We prioritize your comfort and lash health above all else.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-wider">
            <Link to="/privacy-policy" className="text-white/40 hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/40 hover:text-brand-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        <p className="text-center text-[9px] text-white/20 mt-4">
          Built with care for premium beauty experiences
        </p>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-0">
        {children}
      </main>
      <Footer />
      
      {/* Floating Elements */}
      <a
        href={getWhatsAppBookingLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 bg-green-500 text-white p-3 rounded-full shadow-2xl hover-lift"
        aria-label="WhatsApp Booking"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.296 0-4.289 1.583-4.834 3.955-.024.113-.147.214-.242.214H5.416c-.292 0-.528.236-.528.528v.241c0 .292.236.528.528.528h1.539c.095 0 .218.101.242.214.545 2.372 2.538 3.955 4.834 3.955 2.296 0 4.289-1.583 4.834-3.955.024-.113.147-.214.242-.214h1.539c.292 0 .528-.236.528-.528v-.241c0-.292-.236-.528-.528-.528h-1.539c-.095 0-.218-.101-.242-.214-.545-2.372-2.538-3.955-4.834-3.955z"/><path d="M12.012 2c-5.514 0-10 4.486-10 10s4.486 10 10 10c1.855 0 3.584-.509 5.062-1.402l4.926 1.402-1.402-4.926c.893-1.478 1.402-3.207 1.402-5.062 0-5.514-4.486-10-10-10zm0 18.286c-1.637 0-3.178-.457-4.499-1.25l-.323-.195-3.337.95.95-3.337-.195-.323c-.793-1.321-1.25-2.862-1.25-4.499 0-4.568 3.718-8.286 8.286-8.286s8.286 3.718 8.286 8.286-3.718 8.286-8.286 8.286z"/></svg>
      </a>

      {/* Sticky Bottom Booking for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect p-4 border-t border-brand-accent/30">
        <Link 
          to="/booking" 
          className="block w-full bg-brand-gold text-white text-center py-4 text-xs uppercase tracking-widest font-bold"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};
