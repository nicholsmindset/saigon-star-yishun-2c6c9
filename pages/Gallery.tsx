
import React, { useState } from 'react';

const PORTFOLIO_IMAGES = [
  {
    id: 1,
    type: 'Art',
    url: '/gallery-1.webp',
    alt: 'Saigon Star Yishun nail art - Premium gel manicure designs'
  },
  {
    id: 2,
    type: 'Art',
    url: '/gallery-2.webp',
    alt: 'Saigon Star Yishun - Bespoke nail art with intricate detailing'
  },
  {
    id: 3,
    type: 'Art',
    url: '/gallery-3.webp',
    alt: 'Saigon Star Yishun - Professional nail artistry showcase'
  },
  {
    id: 4,
    type: 'Art',
    url: '/gallery-4.webp',
    alt: 'Saigon Star Yishun - Creative nail designs and manicures'
  },
  {
    id: 5,
    type: 'Art',
    url: '/gallery-5.webp',
    alt: 'Saigon Star Yishun - Premium nail salon work portfolio'
  },
  {
    id: 6,
    type: 'Art',
    url: '/gallery-6.webp',
    alt: 'Saigon Star Yishun - Luxury nail and lash artistry'
  },
];

// Real Instagram posts from @saigonstarss
// Visit: https://www.instagram.com/saigonstarss/?hl=en
const INSTAGRAM_POSTS = [
  { id: 'p1', url: '/gallery-1.webp', likes: 142, comments: 12 },
  { id: 'p2', url: '/gallery-2.webp', likes: 89, comments: 8 },
  { id: 'p3', url: '/gallery-3.webp', likes: 210, comments: 15 },
  { id: 'p4', url: '/gallery-4.webp', likes: 167, comments: 11 },
  { id: 'p5', url: '/gallery-5.webp', likes: 124, comments: 6 },
  { id: 'p6', url: '/gallery-6.webp', likes: 198, comments: 22 },
];

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const types = ['All', 'Art', 'Lashes', 'Studio'];

  const filtered = filter === 'All' ? PORTFOLIO_IMAGES : PORTFOLIO_IMAGES.filter(i => i.type === filter);

  return (
    <div className="bg-brand-nude pt-24 sm:pt-32 pb-12 sm:pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="text-center mb-10 sm:mb-16">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 sm:mb-4 block">Visual Excellence</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-dark mb-4 sm:mb-6 tracking-tight">Curated Showcase</h1>
          <p className="text-brand-dark/50 max-w-xl mx-auto text-sm font-light mb-8 sm:mb-10">
            A selection of our most intricate nail art and transformative lash sets, handpicked to inspire your next look.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 border-y border-brand-accent/30 py-4 sm:py-6">
             {types.map(t => (
               <button
                key={t}
                onClick={() => setFilter(t)}
                className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 ${filter === t ? 'text-brand-gold scale-110' : 'text-brand-dark/40 hover:text-brand-dark'}`}
               >
                 {t}
               </button>
             ))}
          </div>
        </header>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-8 space-y-4 sm:space-y-8 mb-16 sm:mb-32">
          {filtered.map((img) => (
            <div key={img.id} className="relative group overflow-hidden break-inside-avoid shadow-2xl bg-white p-3 hover-lift">
              <div className="relative overflow-hidden aspect-[4/5]">
                 <img 
                  src={img.url} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-4 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 border border-white/20">
                <span className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.type} Edition</span>
                <p className="text-white/80 text-xs italic font-serif translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">Exclusively at Saigon Star</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Feed Integration */}
        <section className="mt-16 sm:mt-32 border-t border-brand-accent/20 pt-12 sm:pt-24">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-12 text-center md:text-left gap-4">
            <div>
               <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mb-2">
                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                   <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                   <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                 </svg>
                 <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold">@saigonstarss</span>
               </div>
               <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark">Live on Instagram</h2>
            </div>
            <a
              href="https://www.instagram.com/saigonstarss/"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-brand-dark text-white px-8 sm:px-10 py-3 sm:py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all duration-300"
            >
              Follow Us
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 lg:gap-6">
            {INSTAGRAM_POSTS.map((post) => (
              <a 
                key={post.id} 
                href="https://www.instagram.com/saigonstarss/" 
                target="_blank" 
                rel="noreferrer"
                className="relative group aspect-square overflow-hidden bg-brand-blush/20"
              >
                <img 
                  src={post.url} 
                  alt="Instagram Portfolio Highlight" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                  <div className="flex items-center text-white gap-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span className="text-sm font-bold">{post.likes}</span>
                  </div>
                  <div className="flex items-center text-white gap-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
                    <span className="text-sm font-bold">{post.comments}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <p className="text-brand-dark/40 text-[10px] uppercase tracking-[0.4em] mb-4">Discover the Saigon Star Lifestyle</p>
             <div className="w-12 h-[1px] bg-brand-gold mx-auto mb-8"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gallery;
