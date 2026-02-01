
import React from 'react';
import { TEAM } from '../constants';

const About: React.FC = () => {
  return (
    <div className="bg-white pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Story Section */}
        <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Our Story</span>
            <h1 className="text-5xl font-serif text-brand-dark mb-8 leading-tight">Authentic Artistry <br />at Saigon Star</h1>
            <p className="text-brand-dark/70 text-lg font-light leading-relaxed mb-8">
              Located in the heart of Yishun Street 22, Saigon Star has built a reputation for providing elite lash and nail services with a personal touch. 
            </p>
            <p className="text-brand-dark/70 text-lg font-light leading-relaxed">
              Our technicians specialize in the detailed, intricate work that defines modern Asian beauty trends. From high-retention eyelash extensions to hand-painted nail art that tells a story, we are dedicated to making every visit a transformative experience.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-blush rounded-full -z-10 opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000" 
              alt="Saigon Star Professional Studio Experience" 
              className="w-full h-[500px] object-cover rounded-sm shadow-2xl border border-brand-nude"
              loading="lazy"
            />
          </div>
        </section>

        {/* Philosophy Grid */}
        <section className="bg-brand-nude py-24 px-12 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <h3 className="text-brand-gold font-serif text-3xl mb-4 italic">Precision</h3>
              <p className="text-xs text-brand-dark/60 leading-relaxed tracking-wider uppercase">We believe beauty is in the smallest details.</p>
            </div>
            <div>
              <h3 className="text-brand-gold font-serif text-3xl mb-4 italic">Retention</h3>
              <p className="text-xs text-brand-dark/60 leading-relaxed tracking-wider uppercase">Using only premium adhesives and techniques for lasting results.</p>
            </div>
            <div>
              <h3 className="text-brand-gold font-serif text-3xl mb-4 italic">Comfort</h3>
              <p className="text-xs text-brand-dark/60 leading-relaxed tracking-wider uppercase">A relaxing studio designed for your peace of mind.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-16">
            <span className="text-brand-gold uppercase tracking-widest text-xs font-bold block mb-4">Our Team</span>
            <h2 className="text-4xl font-serif text-brand-dark">The Heart of Saigon Star</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.id} className="group">
                <div className="overflow-hidden mb-6 relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105 shadow-md"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-xl font-serif text-brand-dark mb-1">{member.name}</h4>
                <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-4">{member.role}</p>
                <p className="text-sm text-brand-dark/60 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
