
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: ServiceCategory;
  image?: string;
  popular?: boolean;
}

export enum ServiceCategory {
  Manicure = 'Manicure',
  Pedicure = 'Pedicure',
  GelNails = 'Gel Nails',
  NailArt = 'Nail Art',
  Extensions = 'Extensions',
  Spa = 'Spa Treatments'
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}
