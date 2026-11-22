import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  Square,
  Shield,
  Navigation,
  Compass,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import InteractiveMap from '../components/InteractiveMap';
import { getRealLocation } from '../utils/locationHelper';
import api from '../services/api';

const LiveLocationPage = () => {
  const { user } = useAuth();
  const { broadcastLiveLocation } = useSocket();

  const [isSharing, setIsSharing] = useState(user?.safetyStatus === 'monitoring_active');
  const [coords, setCoords] = useState(
    user?.lastKnownLocation?.latitude
      ? { lat: user.lastKnownLocation.latitude, lng: user.lastKnownLocation.longitude }
      : { lat: 28.6139, lng: 77.2090 }
  );
  const [address, setAddress] = useState(user?.lastKnownLocation?.address || 'Detecting address...');
  const [source, setSource] = useState('Acquiring...');
  const [accuracy, setAccuracy] = useState(15);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);

  const watchIdRef = useRef(null);

  // Auto-detect real device location on mount and fetch nearby spatial data
  const detectLiveLocation = async () => {
    setIsLocating(true);
    setLocationError('');
    try {
      const loc = await getRealLocation();
      const currentPoint = { lat: loc.lat, lng: loc.lng };
      setCoords(currentPoint);
      setAccuracy(loc.accuracy);
      setAddress(loc.address);
      setSource(loc.source);
      setLastUpdated(new Date());

      // Fetch nearby safe places and incidents for this exact live coordinate
      try {
        const [spRes, incRes] = await Promise.allSettled([
          api.get(`/safe-places/nearby?lat=${loc.lat}&lng=${loc.lng}`),
          api.get(`/incidents?lat=${loc.lat}&lng=${loc.lng}`),
        ]);
        if (spRes.status === 'fulfilled' && spRes.value.data.success) {
          setSafePlaces(spRes.value.data.data);
        }
        if (incRes.status === 'fulfilled' && incRes.value.data.success) {
          setIncidents(incRes.value.data.data);
        }
      } catch (err) {
        console.warn('Error fetching nearby spatial markers:', err);
      }

      // Update backend location
      await api.post('/location/update', {
        latitude: loc.lat,
        longitude: loc.lng,
        accuracy: loc.accuracy,
        address: loc.address,
      });

      // Broadcast to guardians
      broadcastLiveLocation(loc.lat, loc.lng, loc.accuracy, loc.address);
    } catch (err) {
      setLocationError('Could not fetch location automatically. Please allow location permissions in your browser.');
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectLiveLocation();
  }, []);

  // Sync state if user's safety status changes
  useEffect(() => {
    setIsSharing(user?.safetyStatus === 'monitoring_active');
  }, [user?.safetyStatus]);

  const startLiveSharing = async () => {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    try {
      await api.post('/location/start-sharing');
      setIsSharing(true);

      // Start continuous watchPosition
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy: acc, heading, speed } = position.coords;
          const currentPoint = { lat: latitude, lng: longitude };
          setCoords(currentPoint);
          setAccuracy(Math.round(acc));
          setSource('Live GPS Hardware');
          setLastUpdated(new Date());

          broadcastLiveLocation(latitude, longitude, acc, address || 'Live Mobile Coordinates');

          try {
            await api.post('/location/update', {
              latitude,
              longitude,
              accuracy: acc,
              heading,
              speed,
              address,
            });
          } catch (e) {}
        },
        (err) => {
          setLocationError('GPS signal degraded: ' + err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } catch (err) {
      setLocationError('Failed to start live location sharing on server.');
    }
  };

  const stopLiveSharing = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    try {
      await api.post('/location/stop-sharing');
      setIsSharing(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-purple-700" />
            Live Location Sharing & Guardian Beacon
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time GPS tracking stream transmitted securely only to your accepted guardians.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Re-detect Location button */}
          <button
            onClick={detectLiveLocation}
            disabled={isLocating}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Detecting...' : 'Re-Detect GPS'}
          </button>

          {/* Start / Stop Toggle */}
          {isSharing ? (
            <button
              onClick={stopLiveSharing}
              className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Square className="w-4 h-4 fill-white" /> Stop Live Sharing
            </button>
          ) : (
            <button
              onClick={startLiveSharing}
              className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" /> Start Live Sharing
            </button>
          )}
        </div>
      </div>

      {/* Live Detected Address Notification Banner */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-soft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Current Detected Location:
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {source}
              </span>
            </div>
            <p className="text-sm font-extrabold text-purple-900 mt-0.5">
              {address}
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono text-slate-500">
          <div>Lat: {coords.lat.toFixed(5)}</div>
          <div>Lng: {coords.lng.toFixed(5)}</div>
        </div>
      </div>

      {locationError && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Broadcast Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isSharing ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'
              }`}
            />
            <span className="text-sm font-bold text-slate-900">
              {isSharing ? 'Live Broadcasting' : 'Standby / Local'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coordinates</p>
          <p className="text-xs font-mono font-bold text-purple-900 mt-1 truncate">
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</p>
          <p className="text-sm font-bold text-slate-900 mt-1">± {accuracy} meters</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Sync</p>
          <p className="text-xs font-medium text-slate-600 mt-1">
            {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Live Map Display */}
      <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-700" />
              Live Beacon Map
            </h3>
            <p className="text-[11px] text-slate-500">
              Guardians observe this live marker on their guardian dashboard
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
            Coordinates Locked
          </span>
        </div>

        <InteractiveMap
          center={coords}
          userLocation={coords}
          height="450px"
        />
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
        <Lock className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-purple-950">
          <strong className="font-bold">Strict Consent & Privacy Guarantee:</strong>
          <p className="mt-0.5 text-purple-900 leading-relaxed">
            NariSafe never passively tracks or sells your location. Geolocation queries operate strictly on demand. When "Start Live Sharing" is active, coordinates stream directly to your authenticated guardians via end-to-end Socket.IO channels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;
