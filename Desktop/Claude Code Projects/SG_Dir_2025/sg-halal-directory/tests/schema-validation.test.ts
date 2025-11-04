/**
 * Schema.org Structured Data Validation Tests
 * Tests that all schema markup includes proper GeoCoordinates
 */

import { describe, it, expect } from '@jest/globals';
import {
  createLocalBusinessSchema,
  createItemListSchema,
  createBreadcrumbSchema,
  createPostalAddress,
  createGeoCoordinates,
  type LocalBusinessSchema,
  type ItemListSchema,
} from '../types/schema';

describe('LocalBusiness Schema with GeoCoordinates', () => {
  it('should include geo property when coordinates are provided', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      description: 'A test halal restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: 1.2806,
      longitude: 103.8514,
      telephone: '+65 1234 5678',
      website: 'https://test.com',
    });

    expect(schema.geo).toBeDefined();
    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: '1.2806',
      longitude: '103.8514',
    });
  });

  it('should NOT include geo property when coordinates are null', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      description: 'A test halal restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: null,
      longitude: null,
    });

    expect(schema.geo).toBeUndefined();
  });

  it('should NOT include geo property when coordinates are zero', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      description: 'A test halal restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: 0,
      longitude: 0,
    });

    expect(schema.geo).toBeUndefined();
  });

  it('should have all required LocalBusiness properties', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      description: 'A test halal restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: 1.2806,
      longitude: 103.8514,
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe('Test Restaurant');
    expect(schema.description).toBe('A test halal restaurant');
    expect(schema.address).toBeDefined();
    expect(schema.address['@type']).toBe('PostalAddress');
  });

  it('should convert coordinates to strings in schema', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: 1.2806,
      longitude: 103.8514,
    });

    // Coordinates should be strings in schema markup
    expect(typeof schema.geo?.latitude).toBe('string');
    expect(typeof schema.geo?.longitude).toBe('string');
  });
});

describe('ItemList Schema with GeoCoordinates', () => {
  it('should include geo property in ItemList items when coordinates are provided', () => {
    const schema = createItemListSchema({
      name: 'Halal Businesses in Marina Bay',
      description: 'List of halal-certified businesses',
      items: [
        {
          name: 'Restaurant 1',
          url: 'https://example.com/business/1',
          address: '123 Test Street',
          addressLocality: 'Marina Bay',
          latitude: 1.2806,
          longitude: 103.8514,
        },
        {
          name: 'Restaurant 2',
          url: 'https://example.com/business/2',
          address: '456 Test Avenue',
          addressLocality: 'Marina Bay',
          latitude: 1.2825,
          longitude: 103.8532,
        },
      ],
    });

    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].item.geo).toBeDefined();
    expect(schema.itemListElement[0].item.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: '1.2806',
      longitude: '103.8514',
    });
    expect(schema.itemListElement[1].item.geo).toBeDefined();
  });

  it('should NOT include geo property in ItemList items when coordinates are null', () => {
    const schema = createItemListSchema({
      name: 'Halal Businesses in Marina Bay',
      items: [
        {
          name: 'Restaurant 1',
          url: 'https://example.com/business/1',
          address: '123 Test Street',
          addressLocality: 'Marina Bay',
          latitude: null,
          longitude: null,
        },
      ],
    });

    expect(schema.itemListElement[0].item.geo).toBeUndefined();
  });

  it('should handle mixed items with and without coordinates', () => {
    const schema = createItemListSchema({
      name: 'Halal Businesses in Marina Bay',
      items: [
        {
          name: 'Restaurant 1',
          url: 'https://example.com/business/1',
          address: '123 Test Street',
          addressLocality: 'Marina Bay',
          latitude: 1.2806,
          longitude: 103.8514,
        },
        {
          name: 'Restaurant 2',
          url: 'https://example.com/business/2',
          address: '456 Test Avenue',
          addressLocality: 'Marina Bay',
          latitude: null,
          longitude: null,
        },
      ],
    });

    // First item should have geo, second should not
    expect(schema.itemListElement[0].item.geo).toBeDefined();
    expect(schema.itemListElement[1].item.geo).toBeUndefined();
  });
});

describe('GeoCoordinates Helper Function', () => {
  it('should create valid GeoCoordinates when latitude and longitude are provided', () => {
    const geo = createGeoCoordinates(1.2806, 103.8514);

    expect(geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: '1.2806',
      longitude: '103.8514',
    });
  });

  it('should return undefined when coordinates are null', () => {
    const geo = createGeoCoordinates(null, null);
    expect(geo).toBeUndefined();
  });

  it('should return undefined when coordinates are zero', () => {
    const geo = createGeoCoordinates(0, 0);
    expect(geo).toBeUndefined();
  });

  it('should return undefined when only one coordinate is provided', () => {
    expect(createGeoCoordinates(1.2806, null)).toBeUndefined();
    expect(createGeoCoordinates(null, 103.8514)).toBeUndefined();
  });
});

describe('Schema JSON-LD Output', () => {
  it('should produce valid JSON-LD that can be stringified', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: 1.2806,
      longitude: 103.8514,
    });

    const jsonLD = JSON.stringify(schema);
    expect(jsonLD).toContain('"@context":"https://schema.org"');
    expect(jsonLD).toContain('"@type":"LocalBusiness"');
    expect(jsonLD).toContain('"geo"');
    expect(jsonLD).toContain('"latitude":"1.2806"');
    expect(jsonLD).toContain('"longitude":"103.8514"');
  });

  it('should not include undefined properties in stringified output', () => {
    const schema = createLocalBusinessSchema({
      name: 'Test Restaurant',
      address: createPostalAddress('123 Test Street', 'Marina Bay', 'SG'),
      latitude: null,
      longitude: null,
    });

    const jsonLD = JSON.stringify(schema);
    expect(jsonLD).not.toContain('"geo"');
    expect(jsonLD).not.toContain('"latitude"');
    expect(jsonLD).not.toContain('"longitude"');
  });
});

describe('Schema Validation for Google Rich Results', () => {
  it('should have structure compatible with Google Rich Results Test', () => {
    const schema: LocalBusinessSchema = createLocalBusinessSchema({
      name: 'Marina Bay Restaurant',
      description: 'Premium halal dining in Singapore',
      address: createPostalAddress(
        '1 Marina Boulevard',
        'Marina Bay',
        'SG',
        '018989'
      ),
      latitude: 1.2806,
      longitude: 103.8514,
      telephone: '+65 6234 5678',
      website: 'https://marinabayrestaurant.com',
      priceRange: '$$$',
    });

    // Check all required properties for LocalBusiness
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBeDefined();
    expect(schema.address).toBeDefined();
    expect(schema.address['@type']).toBe('PostalAddress');
    expect(schema.address.streetAddress).toBeDefined();
    expect(schema.address.addressLocality).toBeDefined();
    expect(schema.address.addressCountry).toBe('SG');

    // Check geo coordinates
    expect(schema.geo).toBeDefined();
    expect(schema.geo?.['@type']).toBe('GeoCoordinates');
    expect(schema.geo?.latitude).toBeDefined();
    expect(schema.geo?.longitude).toBeDefined();

    // Check optional but recommended properties
    expect(schema.telephone).toBeDefined();
    expect(schema.url).toBeDefined();
    expect(schema.priceRange).toBeDefined();
  });
});
