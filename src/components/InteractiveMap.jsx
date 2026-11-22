import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Shield,
  Plus,
  Minus,
  Navigation,
  Layers,
  Crosshair,
  Building,
  Info,
  PhoneCall,
} from 'lucide-react';

/**
 * High-Performance Interactive Map Component
 * - Supports Google Maps JavaScript API if `VITE_GOOGLE_MAPS_API_KEY` is present.
 * - Provides an interactive, vector canvas/SVG map fallback with drag, zoom, pins, tooltips, and route waypoints if key is absent.
 */
const InteractiveMap = ({
  center = { lat: 28.6139, lng: 77.2090 },
  zoom = 14,
  userLocation = null,
  incidents = [],
  safePlaces = [],
  routes = [],
  selectedRouteIndex = 0,
  height = '500px',
  onMarkerClick = null,
}) => {
  const mapContainerRef = useRef(null);
  const [googleMapLoaded, setGoogleMapLoaded] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const activeLat = userLocation?.lat || center.lat;
  const activeLng = userLocation?.lng || center.lng;

  // Google Maps JS API script loader
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setGoogleMapLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => setGoogleMapLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Native Google Map if API is loaded
  useEffect(() => {
    if (googleMapLoaded && mapContainerRef.current && window.google) {
      try {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: activeLat, lng: activeLng },
          zoom: currentZoom,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
            { featureType: 'water', stylers: [{ color: '#e0f2fe' }] },
          ],
        });

        // Add user marker
        new window.google.maps.Marker({
          position: { lat: activeLat, lng: activeLng },
          map,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#7C3AED',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
          },
        });

        // Add incidents
        incidents.forEach((inc) => {
          if (inc.latitude && inc.longitude) {
            new window.google.maps.Marker({
              position: { lat: inc.latitude, lng: inc.longitude },
              map,
              title: inc.incidentType,
              icon: {
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: inc.severity === 'high' || inc.severity === 'critical' ? '#EF4444' : '#F59E0B',
                fillOpacity: 0.9,
                strokeWeight: 1,
              },
            });
          }
        });

        // Add safe places
        safePlaces.forEach((sp) => {
          if (sp.lat && sp.lng) {
            new window.google.maps.Marker({
              position: { lat: sp.lat, lng: sp.lng },
              map,
              title: sp.name,
            });
          }
        });
      } catch (err) {
        console.warn('Google Maps initialization failed:', err);
      }
    }
  }, [googleMapLoaded, activeLat, activeLng, incidents, safePlaces]);

  // Coordinate projection helper for the interactive SVG Map fallback
  const projectCoordsToSVG = (lat, lng, svgWidth = 800, svgHeight = 500) => {
    const latSpan = 0.05 / (currentZoom / 14);
    const lngSpan = 0.07 / (currentZoom / 14);

    const x = ((lng - activeLng) / lngSpan + 0.5) * svgWidth + panOffset.x;
    const y = (-(lat - activeLat) / latSpan + 0.5) * svgHeight + panOffset.y;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleRecenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setCurrentZoom(zoom);
  };

  const selectedRoute = routes && routes[selectedRouteIndex];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft-sm bg-slate-50 select-none"
      style={{ height }}
    >
      {/* If Google Maps is loaded and running */}
      {googleMapLoaded ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        /* Fallback: High-Fidelity Interactive Vector & Topographic SVG Map */
        <div
          className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#F1F5F9]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg className="w-full h-full" viewBox="0 0 800 500">
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="safeRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated Geographic Road Network Arteries */}
            <g opacity="0.6">
              <path
                d="M 50 120 Q 250 180 400 250 T 750 380"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 50 120 Q 250 180 400 250 T 750 380"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 180 40 L 400 250 L 620 460"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="10"
              />
              <path
                d="M 180 40 L 400 250 L 620 460"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="6"
              />
              <path
                d="M 300 460 C 350 350 450 300 700 150"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="6"
              />
            </g>

            {/* Display Route Polyline if present */}
            {selectedRoute && selectedRoute.waypoints && selectedRoute.waypoints.length > 1 && (
              <g>
                {/* Outer Glow */}
                <polyline
                  points={selectedRoute.waypoints
                    .map((wp) => {
                      const pt = projectCoordsToSVG(wp.lat, wp.lng);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke={selectedRoute.recommended ? '#10B981' : '#F59E0B'}
                  strokeWidth="10"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Core Route Line */}
                <polyline
                  points={selectedRoute.waypoints
                    .map((wp) => {
                      const pt = projectCoordsToSVG(wp.lat, wp.lng);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke={selectedRoute.recommended ? '#059669' : '#D97706'}
                  strokeWidth="5"
                  strokeDasharray={selectedRoute.recommended ? 'none' : '6,4'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Incidents Markers */}
            {incidents.map((inc, i) => {
              if (!inc.latitude || !inc.longitude) return null;
              const pt = projectCoordsToSVG(inc.latitude, inc.longitude);
              const isHigh = inc.severity === 'high' || inc.severity === 'critical';

              return (
                <g
                  key={inc._id || i}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer"
                  onClick={() => setActiveTooltip({ type: 'incident', data: inc, x: pt.x, y: pt.y })}
                >
                  <circle
                    r="14"
                    fill={isHigh ? '#FEE2E2' : '#FEF3C7'}
                    stroke={isHigh ? '#EF4444' : '#F59E0B'}
                    strokeWidth="1.5"
                  />
                  <circle r="5" fill={isHigh ? '#DC2626' : '#D97706'} />
                </g>
              );
            })}

            {/* Safe Places Markers */}
            {safePlaces.map((sp, i) => {
              if (!sp.lat || !sp.lng) return null;
              const pt = projectCoordsToSVG(sp.lat, sp.lng);
              const isPolice = sp.category.includes('Police');

              return (
                <g
                  key={sp.id || i}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer"
                  onClick={() => setActiveTooltip({ type: 'safePlace', data: sp, x: pt.x, y: pt.y })}
                >
                  <circle
                    r="16"
                    fill={isPolice ? '#EFF6FF' : '#F0FDF4'}
                    stroke={isPolice ? '#3B82F6' : '#10B981'}
                    strokeWidth="2"
                  />
                  <circle r="6" fill={isPolice ? '#2563EB' : '#059669'} />
                </g>
              );
            })}

            {/* Current User Pulsing Marker */}
            {(() => {
              const pt = projectCoordsToSVG(activeLat, activeLng);
              return (
                <g transform={`translate(${pt.x}, ${pt.y})`}>
                  {/* Wave effect */}
                  <circle r="28" fill="#7C3AED" fillOpacity="0.15" className="animate-ping" />
                  <circle r="18" fill="#7C3AED" fillOpacity="0.3" />
                  <circle r="8" fill="#581C87" stroke="#FFFFFF" strokeWidth="2.5" />
                </g>
              );
            })()}
          </svg>

          {/* Interactive Tooltip Card Overlay */}
          {activeTooltip && (
            <div
              className="absolute z-30 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 max-w-xs animate-fadeIn text-left"
              style={{
                left: Math.min(Math.max(activeTooltip.x - 100, 16), 550),
                top: Math.max(activeTooltip.y - 120, 16),
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  {activeTooltip.type === 'incident' ? 'Reported Incident' : activeTooltip.data.category}
                </span>
                <button
                  onClick={() => setActiveTooltip(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mb-1">
                {activeTooltip.type === 'incident' ? activeTooltip.data.incidentType : activeTooltip.data.name}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                {activeTooltip.type === 'incident' ? activeTooltip.data.description : activeTooltip.data.address}
              </p>

              {activeTooltip.data.phone && (
                <a
                  href={`tel:${activeTooltip.data.phone}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call: {activeTooltip.data.phone}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Map Controls & Legends */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setCurrentZoom((z) => Math.min(z + 1, 18))}
          className="p-2.5 rounded-2xl bg-white/95 text-slate-700 hover:text-purple-700 shadow-md border border-slate-100 transition"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentZoom((z) => Math.max(z - 1, 10))}
          className="p-2.5 rounded-2xl bg-white/95 text-slate-700 hover:text-purple-700 shadow-md border border-slate-100 transition"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-2xl bg-white/95 text-slate-700 hover:text-purple-700 shadow-md border border-slate-100 transition"
          title="Recenter Location"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-100 shadow-md text-[11px] font-medium text-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-700" /> You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Police
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe Haven
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Incident
        </span>
      </div>

      {/* Google Maps Configuration Notification Pill */}
      {!googleMapLoaded && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/80 text-white backdrop-blur-md text-[10px] font-medium px-3 py-1.5 rounded-full shadow-sm">
          <Navigation className="w-3 h-3 text-emerald-400" />
          <span>Interactive Vector Map Active</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
