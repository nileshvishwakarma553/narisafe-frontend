import React from 'react';
import { AlertTriangle, Phone, Navigation, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const EmergencyAlertBanner = () => {
  const { activeAlerts, dismissAlert } = useSocket();

  if (!activeAlerts || activeAlerts.length === 0) return null;

  const current = activeAlerts[0];

  return (
    <div className="bg-red-600 text-white px-4 py-3 shadow-lg border-b border-red-700 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-bold flex-shrink-0 animate-bounce">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              CRITICAL EMERGENCY SOS: {current.userName || 'Connected Ward'}
            </h4>
            <p className="text-[11px] text-red-100">
              Location: {current.locationName || 'Live GPS Coordinates Broadcasted'} • {new Date(current.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {current.mapsLink && (
            <a
              href={current.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-red-600 hover:bg-red-50 font-bold text-xs transition"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate
            </a>
          )}
          {current.userId?.phone && (
            <a
              href={`tel:${current.userId.phone}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition"
            >
              <Phone className="w-3.5 h-3.5" /> Direct Call
            </a>
          )}
          <button
            onClick={() => dismissAlert(current.emergencyId)}
            className="p-1 rounded-lg text-red-200 hover:text-white"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;
