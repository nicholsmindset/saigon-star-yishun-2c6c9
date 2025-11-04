/**
 * Schema.org Type Definitions for SEO
 * These types ensure proper structured data implementation across the application
 */

// Base Schema Types
export interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: string | number;
  longitude: string | number;
}

export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

export interface ImageObject {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

// LocalBusiness Schema
export interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  description?: string;
  image?: string | ImageObject | ImageObject[];
  address: PostalAddress;
  geo?: GeoCoordinates;
  telephone?: string;
  url?: string;
  openingHoursSpecification?: OpeningHoursSpecification | OpeningHoursSpecification[];
  priceRange?: string;
  sameAs?: string[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
}

// BreadcrumbList Schema
export interface BreadcrumbListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbListItem[];
}

// ItemList Schema (for area pages)
export interface ItemListElementBusiness {
  "@type": "LocalBusiness";
  name: string;
  url: string;
  address: PostalAddress;
  geo?: GeoCoordinates;
  image?: string;
  description?: string;
}

export interface ItemListElement {
  "@type": "ListItem";
  position: number;
  item: ItemListElementBusiness;
}

export interface ItemListSchema {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  description?: string;
  numberOfItems: number;
  itemListElement: ItemListElement[];
}

// FAQPage Schema
export interface FAQPageAnswer {
  "@type": "Answer";
  text: string;
}

export interface FAQPageQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: FAQPageAnswer;
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FAQPageQuestion[];
}

// Organization Schema
export interface ContactPoint {
  "@type": "ContactPoint";
  contactType: string;
  telephone?: string;
  email?: string;
  areaServed?: string;
  availableLanguage?: string[];
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  description?: string;
  url: string;
  logo?: string;
  image?: string;
  geo?: GeoCoordinates;
  address?: PostalAddress;
  contactPoint?: ContactPoint;
  sameAs?: string[];
}

// Helper Functions
export function createGeoCoordinates(
  latitude: number | null,
  longitude: number | null
): GeoCoordinates | undefined {
  if (
    latitude === null ||
    longitude === null ||
    latitude === 0 ||
    longitude === 0
  ) {
    return undefined;
  }

  return {
    "@type": "GeoCoordinates",
    latitude: String(latitude),
    longitude: String(longitude),
  };
}

export function createPostalAddress(
  streetAddress: string,
  addressLocality: string,
  addressCountry: string = "SG",
  postalCode?: string,
  addressRegion?: string
): PostalAddress {
  return {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressCountry,
    ...(postalCode && { postalCode }),
    ...(addressRegion && { addressRegion }),
  };
}

export function createLocalBusinessSchema(params: {
  name: string;
  description?: string;
  address: PostalAddress;
  latitude?: number | null;
  longitude?: number | null;
  telephone?: string;
  website?: string;
  image?: string | string[];
  openingHours?: string;
  priceRange?: string;
  socialLinks?: string[];
}): LocalBusinessSchema {
  const schema: LocalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: params.name,
    address: params.address,
    priceRange: params.priceRange || "$$",
  };

  if (params.description) {
    schema.description = params.description;
  }

  if (params.telephone) {
    schema.telephone = params.telephone;
  }

  if (params.website) {
    schema.url = params.website;
  }

  if (params.image) {
    schema.image = params.image;
  }

  if (params.socialLinks && params.socialLinks.length > 0) {
    schema.sameAs = params.socialLinks;
  }

  const geo = createGeoCoordinates(params.latitude, params.longitude);
  if (geo) {
    schema.geo = geo;
  }

  return schema;
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createItemListSchema(params: {
  name: string;
  description?: string;
  items: Array<{
    name: string;
    url: string;
    address: string;
    addressLocality: string;
    latitude?: number | null;
    longitude?: number | null;
    image?: string;
    description?: string;
  }>;
}): ItemListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.name,
    ...(params.description && { description: params.description }),
    numberOfItems: params.items.length,
    itemListElement: params.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: item.name,
        url: item.url,
        address: createPostalAddress(
          item.address,
          item.addressLocality,
          "SG"
        ),
        ...(createGeoCoordinates(item.latitude, item.longitude) && {
          geo: createGeoCoordinates(item.latitude, item.longitude),
        }),
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description }),
      },
    })),
  };
}

export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
