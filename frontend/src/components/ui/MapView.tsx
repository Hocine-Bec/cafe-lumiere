import { useEffect, useRef } from 'react';

interface MapViewProps {
  lat: number;
  lng: number;
  height?: string;
  className?: string;
}

export function MapView({ lat, lng, height = '380px', className = '' }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    void (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Copper-coloured custom marker
      const icon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" fill="#B87333">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>`,
        className: '',
        iconSize: [32, 46],
        iconAnchor: [16, 46],
        popupAnchor: [0, -46],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup('<b>Café Lumière</b><br/>Le Marais, Paris')
        .openPopup();
    })();

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full rounded-2xl overflow-hidden ${className}`}
    />
  );
}
