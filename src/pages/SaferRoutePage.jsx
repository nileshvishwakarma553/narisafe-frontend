import React, { useState, useEffect } from 'react';
import {
  Route,
  Navigation,
  Shield,
  Clock,
  Sparkles,
  AlertTriangle,
  Building,
  Info,
  CheckCircle2,
  LocateFixed,
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import api from '../services/api';
import { getRealLocation } from '../utils/locationHelper';

const SaferRoutePage = () => {
  const [origin, setOrigin] = useState('Detecting current location...');
  const [originCoords, setOriginCoords] = useState(null);
  const [destination, setDestination] = useState('Railway Station');
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [disclaimer, setDisclaimer] = useState('');

  // Auto-detect user current location on mount
  useEffect(() => {
    const initOrigin = async () => {
      try {
        setDetectingLocation(true);
        const loc = await getRealLocation();
        const displayAddr = loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
        setOrigin(displayAddr);
        setOriginCoords({ lat: loc.lat, lng: loc.lng });
        // Automatically fetch routes with user's detected location
        fetchSaferRoutes(displayAddr, { lat: loc.lat, lng: loc.lng }, destination);
      } catch (err) {
        console.error('Failed to resolve current location for route:', err);
        setOrigin('Connaught Place Inner Circle, New Delhi');
        setOriginCoords({ lat: 28.6315, lng: 77.2167 });
        fetchSaferRoutes('Connaught Place Inner Circle, New Delhi', { lat: 28.6315, lng: 77.2167 }, destination);
      } finally {
        setDetectingLocation(false);
      }
    };

    initOrigin();
  }, []);

  const fetchSaferRoutes = async (startAddr, startCoords, endAddr) => {
    setLoading(true);
    try {
      const res = await api.post('/routes/safer-route', {
        origin: startAddr || origin,
        destination: endAddr || destination,
        originCoords: startCoords || originCoords || { lat: 28.6315, lng: 77.2167 },
      });

      if (res.data.success) {
        setRoutes(res.data.routes || []);
        setSelectedRouteIdx(0);
        setDisclaimer(res.data.disclaimer);
      }
    } catch (err) {
      console.error('Failed to calculate safer route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRoutes = async (e) => {
    if (e) e.preventDefault();
    fetchSaferRoutes(origin, originCoords, destination);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setDetectingLocation(true);
      const loc = await getRealLocation();
      const displayAddr = loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
      setOrigin(displayAddr);
      setOriginCoords({ lat: loc.lat, lng: loc.lng });
    } finally {
      setDetectingLocation(false);
    }
  };

  const activeRoute = routes[selectedRouteIdx];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Route className="w-6 h-6 text-purple-700" />
          Safer Route Finder & Corridor Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Analyzes street illumination, police checkpoint frequency, and crowdsourced incident clusters to surface safer commuting paths.
        </p>
      </div>

      {/* Origin & Destination Search Input Bar */}
      <form onSubmit={handleSearchRoutes} className="bg-white rounded-3xl p-5 shadow-soft-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Starting Location (Origin)
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={detectingLocation}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                {detectingLocation ? 'Locating...' : 'Use Current Location'}
              </button>
            </div>
            <div className="relative">
              <Navigation className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter current location or landmark"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Destination
            </label>
            <div className="relative">
              <Route className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination address or hub"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Powered by NariSafe Spatial Hazard Engine & Google Directions API
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            {loading ? 'Evaluating Corridors...' : 'Find Safer Routes'}
          </button>
        </div>
      </form>

      {/* Route Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((r, idx) => {
          const isSelected = selectedRouteIdx === idx;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRouteIdx(idx)}
              className={`p-6 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-soft-sm flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-100 shadow-soft-md'
                  : 'border-slate-100 hover:border-purple-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      r.recommended
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {r.tag}
                  </span>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${r.badgeClass}`}>
                    {r.riskLevel} (Score: {r.safetyScore}/100)
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{r.name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-purple-600" /> {r.distanceKm} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> ~{r.durationMins} mins
                  </span>
                </div>

                <ul className="space-y-1.5 mb-4 text-xs text-slate-600">
                  {r.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                {r.cautionNote}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Display showing Selected Route */}
      <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-700" />
              Route Trajectory Visualization
            </h3>
            <p className="text-[11px] text-slate-500">
              Active: {activeRoute?.name || 'Loading Route'}
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700">
            Selected: {activeRoute?.distanceKm} km • ~{activeRoute?.durationMins} mins
          </span>
        </div>

        <InteractiveMap
          center={originCoords || { lat: 28.6000, lng: 77.2190 }}
          userLocation={originCoords}
          routes={routes}
          selectedRouteIndex={selectedRouteIdx}
          height="420px"
        />
      </div>

      {/* Important Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">Safety Disclaimer:</strong>{' '}
          {disclaimer || 'Safety scores are based on available incident reports and do not guarantee personal safety. Always trust your intuition and stay in well-lit public zones.'}
        </p>
      </div>
    </div>
  );
};

export default SaferRoutePage;
