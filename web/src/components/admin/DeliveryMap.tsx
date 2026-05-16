'use client';

import { useEffect, useRef, useState } from 'react';

type LatLng = { lat: number; lng: number };
type GoogleMap = object;
type GoogleMapsApi = {
  maps: {
    Map: new (
      element: HTMLElement,
      options: {
        zoom: number;
        center: LatLng;
        mapId?: string;
        styles?: Array<{
          featureType: string;
          elementType: string;
          stylers: Array<{ visibility: string }>;
        }>;
      },
    ) => GoogleMap;
    Marker: new (options: {
      position: LatLng;
      map: GoogleMap;
      title: string;
      icon: {
        url: string;
        scaledSize: object;
      };
    }) => object;
    Size: new (width: number, height: number) => object;
  };
};

declare global {
  interface Window {
    google?: GoogleMapsApi;
  }
}

interface MapConfig {
  googleMapsApiKey: string;
  mapId: string | null;
}

export interface DeliveryLocation {
  id: string;
  customer: { name: string; lat: number; lng: number };
  restaurant: { name: string; lat: number; lng: number };
  rider: { name: string; lat: number; lng: number } | null;
  status: string;
}

function markerIcon(label: string, color: string) {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${label}</text>
    </svg>
  `);
}

export default function DeliveryMap({ deliveries = [] }: { deliveries?: DeliveryLocation[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<MapConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/maps/config')
      .then((res) => res.json())
      .then(setConfig)
      .catch((err) => {
        console.error('Failed to load map config:', err);
        setError('Failed to load map configuration');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!config?.googleMapsApiKey || !mapRef.current) return;

    const addDeliveryMarkers = (mapInstance: GoogleMap) => {
      deliveries.forEach((delivery) => {
        new window.google!.maps.Marker({
          position: delivery.customer,
          map: mapInstance,
          title: `Customer: ${delivery.customer.name}`,
          icon: {
            url: markerIcon('C', '#3b82f6'),
            scaledSize: new window.google!.maps.Size(24, 24),
          },
        });

        new window.google!.maps.Marker({
          position: delivery.restaurant,
          map: mapInstance,
          title: `Restaurant: ${delivery.restaurant.name}`,
          icon: {
            url: markerIcon('R', '#10b981'),
            scaledSize: new window.google!.maps.Size(24, 24),
          },
        });

        if (delivery.rider) {
          new window.google!.maps.Marker({
            position: delivery.rider,
            map: mapInstance,
            title: `Rider: ${delivery.rider.name}`,
            icon: {
              url: markerIcon('D', '#f59e0b'),
              scaledSize: new window.google!.maps.Size(24, 24),
            },
          });
        }
      });
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        const mwanza = { lat: -2.5164, lng: 32.9175 };
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: mwanza,
          mapId: config.mapId || undefined,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        addDeliveryMarkers(mapInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

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
  }, [config, deliveries]);

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
        <div className="text-center">
          <div className="mb-2 text-zinc-400">Map</div>
          <p className="text-sm text-zinc-400">{error}</p>
          <p className="mt-1 text-xs text-zinc-600">Map functionality unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-zinc-900">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-orange-400"></div>
            <p className="text-sm text-zinc-400">Loading map...</p>
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
