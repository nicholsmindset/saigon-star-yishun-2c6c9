/**
 * Business Configuration
 * Centralized business information for easy updates
 *
 * TODO: Update with actual business information before launch
 */

export const BUSINESS_CONFIG = {
  name: 'Saigon Star Yishun',
  tagline: 'Premium Lash & Nail Artistry',
  description: 'Premium lash and nail artistry studio in Yishun Street 22, specializing in bespoke nail art and professional eyelash extensions.',

  // Contact Information
  contact: {
    // TODO: REPLACE WITH ACTUAL PHONE NUMBER
    phone: '+65 8292 6388',
    phoneDisplay: '+65 8292 6388',
    // TODO: VERIFY WHATSAPP NUMBER
    whatsapp: '6582926388',
    email: 'hello@saigonstar.sg', // TODO: Set up business email
  },

  // Location
  location: {
    address: 'Blk 291 Yishun Street 22',
    unit: '#01-347',
    postalCode: '760291',
    city: 'Singapore',
    fullAddress: 'Blk 291 Yishun Street 22, #01-347, Singapore 760291',

    // Google Maps Coordinates (Yishun Street 22)
    // TODO: VERIFY EXACT COORDINATES FOR YOUR UNIT
    coordinates: {
      latitude: 1.4334,
      longitude: 103.8378,
    },

    // Google Maps embed URL
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.358212624419!2d103.8378!3d1.4334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141f237f8f96799%3A0x6b4c34a2c53a290e!2s291%20Yishun%20Street%2022%2C%20Singapore%20760291!5e0!3m2!1sen!2ssg!4v1700000000000!5m2!1sen!2ssg',

    // Directions link
    directionsUrl: 'https://goo.gl/maps/[TODO-ADD-GOOGLE-MAPS-LINK]',
  },

  // Business Hours
  hours: {
    weekday: {
      open: '10:30 AM',
      close: '8:30 PM',
      days: 'Mon - Sat',
    },
    weekend: {
      open: '10:30 AM',
      close: '7:30 PM',
      days: 'Sun & PH',
    },
  },

  // Social Media
  social: {
    instagram: {
      handle: '@saigonstarss',
      url: 'https://www.instagram.com/saigonstarss/',
    },
    facebook: {
      // TODO: ADD FACEBOOK PAGE URL
      url: 'https://www.facebook.com/saigonstarss',
    },
    tiktok: {
      // TODO: ADD TIKTOK IF APPLICABLE
      url: '',
    },
  },

  // SEO & Marketing
  seo: {
    keywords: [
      'nail salon Yishun',
      'eyelash extensions Singapore',
      'nail art Yishun',
      'lash lift Singapore',
      'YY lashes',
      'manga lash',
      'gel nails Yishun',
      'volume lashes',
      'bespoke nail art',
      'premium nail salon',
    ],
    localSearchTerms: [
      'nail salon near Yishun MRT',
      'best nail salon Yishun',
      'eyelash extensions Yishun',
      'nail art Yishun Street 22',
    ],
  },

  // Booking
  booking: {
    // TODO: Choose and configure booking method
    method: 'whatsapp', // Options: 'calendly', 'whatsapp', 'phone', 'custom'
    calendlyUrl: '', // TODO: Add Calendly link if using
    allowOnlineBooking: true,
  },
};

// Helper function to generate WhatsApp booking link
export const getWhatsAppBookingLink = (serviceName?: string) => {
  const baseUrl = `https://wa.me/${BUSINESS_CONFIG.contact.whatsapp}`;

  if (serviceName) {
    const message = encodeURIComponent(
      `Hi! I'd like to book ${serviceName}. When is your next available slot?`
    );
    return `${baseUrl}?text=${message}`;
  }

  return baseUrl;
};

// Helper function to generate phone call link
export const getPhoneCallLink = () => {
  return `tel:${BUSINESS_CONFIG.contact.phone}`;
};

// Helper function to format business hours
export const getFormattedHours = () => {
  return {
    weekday: `${BUSINESS_CONFIG.hours.weekday.days}: ${BUSINESS_CONFIG.hours.weekday.open} - ${BUSINESS_CONFIG.hours.weekday.close}`,
    weekend: `${BUSINESS_CONFIG.hours.weekend.days}: ${BUSINESS_CONFIG.hours.weekend.open} - ${BUSINESS_CONFIG.hours.weekend.close}`,
  };
};

// Helper function to get full address
export const getFullAddress = () => {
  return BUSINESS_CONFIG.location.fullAddress;
};

// Helper function to get Schema.org LocalBusiness JSON-LD
export const getBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: BUSINESS_CONFIG.name,
    description: BUSINESS_CONFIG.description,
    image: 'https://saigonstar.sg/og-image.jpg', // TODO: Add actual OG image
    '@id': 'https://saigonstar.sg',
    url: 'https://saigonstar.sg',
    telephone: BUSINESS_CONFIG.contact.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${BUSINESS_CONFIG.location.address} ${BUSINESS_CONFIG.location.unit}`,
      addressLocality: BUSINESS_CONFIG.location.city,
      postalCode: BUSINESS_CONFIG.location.postalCode,
      addressCountry: 'SG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_CONFIG.location.coordinates.latitude,
      longitude: BUSINESS_CONFIG.location.coordinates.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:30',
        closes: '20:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:30',
        closes: '19:30',
      },
    ],
    sameAs: [
      BUSINESS_CONFIG.social.instagram.url,
      BUSINESS_CONFIG.social.facebook.url,
    ].filter(Boolean),
  };
};
