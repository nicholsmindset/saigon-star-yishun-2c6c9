
import React from 'react';
import { Service, ServiceCategory, Testimonial, TeamMember } from './types';

export const SERVICES: Service[] = [
  {
    id: 'm1',
    name: 'Classic Signature Gel',
    description: 'Precision shaping and cuticle care using premium Korean soft gels for a long-lasting, healthy shine.',
    duration: '60 mins',
    price: '$55',
    category: ServiceCategory.GelNails,
    popular: true
  },
  {
    id: 'a1',
    name: 'Bespoke Artisan Nail Art',
    description: 'Hand-painted intricate designs including floral, chrome, and 3D textures tailored to your vision.',
    duration: '90 mins+',
    price: 'From $25',
    category: ServiceCategory.NailArt,
    popular: true
  },
  {
    id: 'l1',
    name: 'Natural Single Lash Lift',
    description: '1:1 classic extension using feather-light strands for a natural, elegant daily look.',
    duration: '90 mins',
    price: '$88',
    category: ServiceCategory.Extensions,
    popular: true
  },
  {
    id: 'l2',
    name: 'Volume / YY Lash Set',
    description: 'The viral YY-lash technique for a fuller, cross-woven flutter that offers incredible retention.',
    duration: '105 mins',
    price: '$110',
    category: ServiceCategory.Extensions,
    popular: true
  },
  {
    id: 'l3',
    name: 'Manga / Manhua Lash',
    description: 'Specialized textured set with pointed spikes for that modern, youthful aesthetic.',
    duration: '120 mins',
    price: '$125',
    category: ServiceCategory.Extensions
  },
  {
    id: 's1',
    name: 'Organic Spa Pedicure',
    description: 'Deep exfoliation, volcanic stone scrub, and a soothing massage to revitalize tired feet.',
    duration: '75 mins',
    price: '$78',
    category: ServiceCategory.Spa
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Clarissa Low',
    text: 'Saigon Star is a hidden gem in Yishun! I always get my YY lashes and intricate nail art done here. Meticulous work and the salon is so aesthetic.',
    rating: 5,
    date: '1 week ago'
  },
  {
    id: 't2',
    name: 'Wendy Ng',
    text: 'Best lash retention I have ever had. The technicians are very gentle and professional. Highly recommend their bespoke nail designs too.',
    rating: 5,
    date: '2 weeks ago'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Linh',
    role: 'Master Artist & Founder',
    bio: 'With over a decade of experience in premium lash and nail care, Linh leads Saigon Star with a commitment to artistry and client satisfaction.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'tm2',
    name: 'Yuki',
    role: 'Senior Lash Specialist',
    bio: 'Specialist in Korean-style volume sets and the viral Manga lash look. Known for her extreme attention to detail.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
  }
];
