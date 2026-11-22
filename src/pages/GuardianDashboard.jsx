import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Radio,
  MapPin,
  Phone,
  Navigation,
  AlertTriangle,
  Clock,
  UserCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import InteractiveMap from '../components/InteractiveMap';
import api from '../services/api';

const GuardianDashboard = () => {
  const { user } = useAuth();
  const { monitoredLocations, activeAlerts } = useSocket();

  const [monitoredUsers, setMonitoredUsers] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/guardian/monitored-users');
      if (res.data.success) {
        setMonitoredUsers(res.data.data);
        if (res.data.data.length > 0 && !selectedWard) {
          setSelectedWard(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load monitored users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  // Determine current active coordinate for selected ward (from real-time socket or DB record)
  const getActiveWardLocation = (wardUser) => {
    if (!wardUser) return { lat: 28.6139, lng: 77.2090 };
    const socketLoc = monitoredLocations[wardUser._id];
    if (socketLoc) {
      return { lat: socketLoc.latitude, lng: socketLoc.longitude };
    }
    if (wardUser.lastKnownLocation && wardUser.lastKnownLocation.latitude) {
      return {
        lat: wardUser.lastKnownLocation.latitude,
        lng: wardUser.lastKnownLocation.longitude,
      };
    }
    return { lat: 28.6139, lng: 77.2090 };
  };

  const currentCoords = selectedWard ? getActiveWardLocation(selectedWard.user) : { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="space-y-6">
      {/* Guardian Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-2">
            <Shield className="w-3.5 h-3.5 text-indigo-300" /> Guardian Safety Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Guardian Monitoring Center
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            You are authorized to observe real-time safety status and emergency SOS dispatches for your connected wards.
          </p>
        </div>

        <Link
          to="/guardian/invitations"
          className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md border border-white/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <UserCheck className="w-4 h-4" /> Invitations & Permissions
        </Link>
      </div>

      {/* Real-time Alert Banner if any ward has an active SOS */}
      {activeAlerts.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-600 text-white shadow-xl border-2 border-red-400 animate-fadeIn flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-red-600 flex items-center justify-center font-bold flex-shrink-0 animate-bounce">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wider">
                🚨 CRITICAL EMERGENCY SOS DETECTED
              </h3>
              <p className="text-xs text-red-100">
                {activeAlerts[0].userName || 'Protected Ward'} has triggered emergency SOS. View location and call immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeAlerts[0].mapsLink && (
              <a
                href={activeAlerts[0].mapsLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-xs hover:bg-red-50 transition flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" /> Google Maps
              </a>
            )}
            <a
              href="tel:112"
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> Call 112 Police
            </a>
          </div>
        </div>
      )}

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wards List Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Connected Wards ({monitoredUsers.length})
            </h2>
            <button
              onClick={fetchWards}
              className="text-xs font-semibold text-purple-700 hover:underline"
            >
              Refresh
            </button>
          </div>

          {monitoredUsers.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center shadow-soft-sm">
              <Shield className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-3">
                No active wards connected to your guardian account.
              </p>
              <Link
                to="/guardian/invitations"
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                Check Pending Invitations &rarr;
              </Link>
            </div>
          ) : (
            monitoredUsers.map((item) => {
              const ward = item.user;
              const isSelected = selectedWard?.user?._id === ward._id;
              const status = ward.safetyStatus || 'safe';

              return (
                <div
                  key={item.connectionId}
                  onClick={() => setSelectedWard(item)}
                  className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-soft-sm ${
                    isSelected
                      ? 'border-purple-600 ring-2 ring-purple-100'
                      : 'border-slate-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                      {item.relationshipTag || 'Ward'}
                    </span>

                    {/* Status Badge */}
                    {status === 'emergency_active' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                        SOS ACTIVE
                      </span>
                    ) : status === 'monitoring_active' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        <Radio className="w-3 h-3 animate-spin" /> LIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SAFE
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-0.5">{ward.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mb-2">{ward.phone}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Last Sync: {ward.lastKnownLocation?.updatedAt ? new Date(ward.lastKnownLocation.updatedAt).toLocaleTimeString() : 'Recent'}
                    </span>
                    <a
                      href={`tel:${ward.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-purple-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Ward Live Map View */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-700" />
                Live Map View: {selectedWard?.user?.name || 'Protected User'}
              </h3>
              <p className="text-xs text-slate-500">
                Coordinates: {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
              </p>
            </div>

            {selectedWard?.user?.phone && (
              <a
                href={`tel:${selectedWard.user.phone}`}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Phone className="w-4 h-4" /> Call {selectedWard.user.name}
              </a>
            )}
          </div>

          <InteractiveMap
            center={currentCoords}
            userLocation={currentCoords}
            height="460px"
          />

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Address Landmark: {selectedWard?.user?.lastKnownLocation?.address || 'GPS Coordinates Synchronized'}
            </span>
            <a
              href={`https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 font-bold hover:underline flex items-center gap-1"
            >
              Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianDashboard;
