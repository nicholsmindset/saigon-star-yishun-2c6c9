'use client';

import { useEffect, useRef, memo } from 'react';
import type { Map as LeafletMap, LatLngBounds } from 'leaflet';

// Business location data structure
export interface BusinessLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  business_type?: string;
  is_featured?: boolean;
}

interface BusinessMapProps {
  businesses: BusinessLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  onMarkerClick?: (businessId: string) => void;
  enableClustering?: boolean;
  clusterThreshold?: number;
}

/**
 * BusinessMap Component
 *
 * Displays business locations on an interactive OpenStreetMap using Leaflet.
 * Supports both single and multiple markers with optional clustering.
 *
 * @param businesses - Array of business locations to display
 * @param center - Map center coordinates [lat, lng] (auto-calculated if not provided)
 * @param zoom - Initial zoom level (default: 13 for single, 11 for multiple)
 * @param className - Additional CSS classes
 * @param height - Map container height (default: 300px mobile, 400px desktop)
 * @param onMarkerClick - Callback when marker is clicked with business ID
 * @param enableClustering - Enable marker clustering (default: true for >10 markers)
 * @param clusterThreshold - Minimum markers to enable clustering (default: 10)
 */
const BusinessMap = memo(({
  businesses,
  center,
  zoom,
  className = '',
  height = 'h-[300px] md:h-[400px]',
  onMarkerClick,
  enableClustering = true,
  clusterThreshold = 10,
}: BusinessMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !mapRef.current || businesses.length === 0) return;

    // Dynamically import Leaflet and CSS
    const initializeMap = async () => {
      try {
        // Import Leaflet library
        const L = (await import('leaflet')).default;

        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css');

        // Fix for default marker icon issue in Next.js
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Calculate map center and bounds
        const validBusinesses = businesses.filter(
          b => b.latitude && b.longitude &&
          !isNaN(b.latitude) && !isNaN(b.longitude)
        );

        if (validBusinesses.length === 0) {
          console.warn('No valid business coordinates found');
          return;
        }

        let mapCenter: [number, number];
        let mapZoom: number;

        if (center) {
          mapCenter = center;
          mapZoom = zoom || 13;
        } else if (validBusinesses.length === 1) {
          mapCenter = [validBusinesses[0].latitude, validBusinesses[0].longitude];
          mapZoom = zoom || 15;
        } else {
          // Calculate center from all businesses
          const avgLat = validBusinesses.reduce((sum, b) => sum + b.latitude, 0) / validBusinesses.length;
          const avgLng = validBusinesses.reduce((sum, b) => sum + b.longitude, 0) / validBusinesses.length;
          mapCenter = [avgLat, avgLng];
          mapZoom = zoom || 12;
        }

        // Initialize map if not already initialized
        if (!leafletMapRef.current && mapRef.current) {
          const map = L.map(mapRef.current, {
            center: mapCenter,
            zoom: mapZoom,
            scrollWheelZoom: true,
            zoomControl: true,
            keyboard: true, // Enable keyboard navigation
            attributionControl: true,
          });

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Create custom icon factory
          const createCustomIcon = (isFeatured: boolean = false) => {
            const color = isFeatured ? '#3b82f6' : '#10b981'; // Blue for featured, green for standard

            return L.divIcon({
              className: 'custom-map-marker',
              html: `
                <div
                  class="marker-pin"
                  style="
                    background-color: ${color};
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                  "
                  aria-label="Business location marker"
                >
                  <div style="
                    width: 12px;
                    height: 12px;
                    background-color: white;
                    border-radius: 50%;
                    transform: rotate(45deg);
                  "></div>
                </div>
                ${isFeatured ? `
                  <div style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #3b82f6;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    padding: 2px 4px;
                    border-radius: 3px;
                    white-space: nowrap;
                    transform: rotate(45deg);
                  ">★</div>
                ` : ''}
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });
          };

          // Clear existing markers
          markersRef.current.forEach(marker => marker.remove());
          markersRef.current = [];

          // Determine if we should use clustering
          const shouldCluster = enableClustering && validBusinesses.length >= clusterThreshold;

          if (shouldCluster) {
            // Note: For production, install leaflet.markercluster
            // For now, we'll use standard markers with a note
            console.info(`${validBusinesses.length} markers detected. Consider installing leaflet.markercluster for better performance.`);
          }

          // Add markers for each business
          validBusinesses.forEach((business) => {
            const icon = createCustomIcon(business.is_featured);
            const marker = L.marker([business.latitude, business.longitude], {
              icon,
              title: business.name, // For accessibility
              alt: `Location of ${business.name}`, // For screen readers
            }).addTo(map);

            // Create popup content
            const popupContent = `
              <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; max-width: 300px;">
                <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
                  <strong style="font-size: 16px; color: ${business.is_featured ? '#3b82f6' : '#059669'}; flex: 1;">
                    ${business.name}
                  </strong>
                  ${business.is_featured ? `
                    <span style="
                      background: #3b82f6;
                      color: white;
                      font-size: 10px;
                      font-weight: bold;
                      padding: 2px 6px;
                      border-radius: 4px;
                    ">FEATURED</span>
                  ` : ''}
                </div>
                ${business.business_type ? `
                  <p style="font-size: 13px; color: #6b7280; margin: 4px 0;">
                    ${business.business_type}
                  </p>
                ` : ''}
                <p style="font-size: 14px; color: #4b5563; margin: 4px 0 8px 0;">
                  ${business.address}
                </p>
                <a
                  href="/business/${business.id}"
                  style="
                    display: inline-block;
                    color: #3b82f6;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    padding: 4px 0;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                  "
                  onmouseover="this.style.borderColor='#3b82f6'"
                  onmouseout="this.style.borderColor='transparent'"
                >
                  View Details →
                </a>
              </div>
            `;

            marker.bindPopup(popupContent, {
              maxWidth: 300,
              className: 'custom-popup',
            });

            // Handle marker click
            marker.on('click', () => {
              if (onMarkerClick) {
                onMarkerClick(business.id);
              }
            });

            markersRef.current.push(marker);
          });

          // Fit map to show all markers if multiple businesses
          if (validBusinesses.length > 1 && !center) {
            const bounds: LatLngBounds = L.latLngBounds(
              validBusinesses.map(b => [b.latitude, b.longitude] as [number, number])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
          }

          leafletMapRef.current = map;

          // Ensure map renders correctly
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          // Marker already removed
        }
      });
      markersRef.current = [];

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [businesses, center, zoom, onMarkerClick, enableClustering, clusterThreshold]);

  // Loading state
  if (businesses.length === 0) {
    return (
      <div className={`relative w-full ${height} ${className} rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">No location data available</p>
        </div>
      </div>
    );
  }

  // Error state for invalid coordinates
  const hasValidCoordinates = businesses.some(
    b => b.latitude && b.longitude && !isNaN(b.latitude) && !isNaN(b.longitude)
  );

  if (!hasValidCoordinates) {
    return (
      <div className={`relative w-full ${height} ${className} rounded-xl overflow-hidden bg-yellow-50 flex items-center justify-center border-2 border-yellow-200`}>
        <div className="text-center text-yellow-700 px-4">
          <svg className="w-12 h-12 mx-auto mb-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium">Invalid location coordinates</p>
          <p className="text-xs mt-1">Please contact support to update business location</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${height} ${className} rounded-xl overflow-hidden shadow-md`}>
      <div ref={mapRef} className="w-full h-full" role="region" aria-label="Interactive business location map" />

      {/* Map controls info for screen readers */}
      <div className="sr-only">
        <p>Use arrow keys to pan the map, plus and minus keys to zoom in and out.</p>
        <p>Displaying {businesses.length} business {businesses.length === 1 ? 'location' : 'locations'}.</p>
      </div>

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center pointer-events-none opacity-0 transition-opacity" id="map-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    </div>
  );
});

BusinessMap.displayName = 'BusinessMap';

export default BusinessMap;
