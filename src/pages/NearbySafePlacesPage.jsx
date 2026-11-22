import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building,
  Phone,
  Navigation,
  Star,
  Clock,
  Shield,
  Search,
  Filter,
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import api from '../services/api';

const NearbySafePlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('both'); // 'list' | 'map' | 'both'
  const [userCoords, setUserCoords] = useState({ lat: 28.6139, lng: 77.2090 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  const fetchSafePlaces = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/safe-places/nearby?lat=${userCoords.lat}&lng=${userCoords.lng}&category=${category}`
      );
      if (res.data.success) {
        setPlaces(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch safe places:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafePlaces();
  }, [category, userCoords]);

  const categories = [
    { id: 'all', label: 'All Safe Havens' },
    { id: 'police', label: 'Police Stations' },
    { id: 'hospital', label: 'Hospitals & Trauma' },
    { id: 'pharmacy', label: '24/7 Pharmacies' },
    { id: 'women', label: 'Women Crisis Centers' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-700" />
            Nearby Safe Havens & Emergency Facilities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            24x7 verified shelters, pink police booths, trauma centers, and illuminated safe spots.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'both' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'list' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            List Only
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'map' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Map Only
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
              category === c.id
                ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className={`grid gap-6 ${viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Safe Places List Cards */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div className={`${viewMode === 'both' ? 'lg:col-span-6' : 'col-span-1'} space-y-4`}>
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading nearby safe facilities...</div>
            ) : places.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-100">
                No safe places matching this category found nearby.
              </div>
            ) : (
              places.map((place) => (
                <div
                  key={place.id}
                  className="p-6 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                        {place.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {place.distance} km away
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">{place.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{place.address}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {place.rating}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-emerald-600">
                        <Clock className="w-3.5 h-3.5" /> {place.openHours}
                      </span>
                    </div>

                    {place.features && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {place.features.map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <a
                      href={`tel:${place.phone}`}
                      className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Direct Call
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Get Directions
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Map Visualization */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className={`${viewMode === 'both' ? 'lg:col-span-6' : 'col-span-1'} bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between sticky top-20`}>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-700" />
                Live Safe Haven Map Markers
              </h3>
              <p className="text-[11px] text-slate-500">
                Green pins represent hospitals and shelters; Blue pins designate verified police desks.
              </p>
            </div>

            <InteractiveMap
              center={userCoords}
              userLocation={userCoords}
              safePlaces={places}
              height="520px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbySafePlacesPage;
