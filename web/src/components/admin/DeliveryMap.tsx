'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface MapConfig {
  googleMapsApiKey: string;
  mapId: string | null;
}

interface DeliveryLocation {
  id: string;
  customer: {
    name: string;
    lat: number;
    lng: number;
  };
  restaurant: {
    name: string;
    lat: number;
    lng: number;
  };
  rider: {
    name: string;
    lat: number;
    lng: number;
  } | null;
  status: string;
}

// Mock data for demonstration - in real app, this would come from API
const mockDeliveries: DeliveryLocation[] = [
  {
    id: '#HF2040',
    customer: { name: 'Juma M.', lat: -2.5164, lng: 32.9175 },
    restaurant: { name: 'Burger House', lat: -2.5184, lng: 32.9155 },
    rider: { name: 'Sarah M.', lat: -2.5174, lng: 32.9165 },
    status: 'On the way'
  },
  {
    id: '#HF2039',
    customer: { name: 'Neema R.', lat: -2.5144, lng: 32.9195 },
    restaurant: { name: 'Spice Route', lat: -2.5164, lng: 32.9175 },
    rider: { name: 'Mike T.', lat: -2.5154, lng: 32.9185 },
    status: 'Preparing'
  }
];

export default function DeliveryMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [config, setConfig] = useState<MapConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Maps config
    fetch('/api/maps/config')
      .then(res => res.json())
      .then(setConfig)
      .catch(err => {
        console.error('Failed to load map config:', err);
        setError('Failed to load map configuration');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!config?.googleMapsApiKey || !mapRef.current) return;

    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [config]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Center on Mwanza, Tanzania
      const mwanza = { lat: -2.5164, lng: 32.9175 };

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: mwanza,
        mapId: config?.mapId || undefined,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);
      addDeliveryMarkers(mapInstance);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  };

  const addDeliveryMarkers = (mapInstance: any) => {
    mockDeliveries.forEach(delivery => {
      // Customer marker
      new window.google.maps.Marker({
        position: delivery.customer,
        map: mapInstance,
        title: `Customer: ${delivery.customer.name}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">C</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });

      // Restaurant marker
      new window.google.maps.Marker({
        position: delivery.restaurant,
        map: mapInstance,
        title: `Restaurant: ${delivery.restaurant.name}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">R</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });

      // Rider marker (if assigned)
      if (delivery.rider) {
        new window.google.maps.Marker({
          position: delivery.rider,
          map: mapInstance,
          title: `Rider: ${delivery.rider.name}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="white" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🚴</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24)
          }
        });
      }
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-zinc-900 rounded-lg border border-zinc-700">
        <div className="text-center">
          <div className="text-zinc-400 mb-2">🗺️</div>
          <p className="text-zinc-400 text-sm">{error}</p>
          <p className="text-zinc-600 text-xs mt-1">Map functionality unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-2"></div>
            <p className="text-zinc-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="h-96 w-full rounded-lg border border-zinc-700 bg-zinc-900"
        style={{ minHeight: '384px' }}
      />
    </div>
  );
}