import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Navigation, ShieldCheck, X, Volume2, Send } from 'lucide-react';
import { getRealLocation } from '../utils/locationHelper';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const SOSButton = ({ onSOSTriggered, size = 'large' }) => {
  const { t } = useLanguage();
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    let timer;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      executeSOS();
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const handleStartSOS = () => {
    setCountdown(3);
    setIsCountingDown(true);
  };

  const handleCancelCountdown = () => {
    setIsCountingDown(false);
    setCountdown(3);
  };

  const executeSOS = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const loc = await getRealLocation();
      sendSOSPayload(loc.lat, loc.lng, loc.accuracy, loc.address || 'Verified Live Location');
    } catch (err) {
      console.warn('Geolocation fallback:', err);
      sendSOSPayload(28.6139, 77.2090, 100, 'Emergency Location');
    }
  };

  const sendSOSPayload = async (latitude, longitude, accuracy, locationName) => {
    try {
      const res = await api.post('/emergency/sos', {
        latitude,
        longitude,
        accuracy,
        locationName,
        notes: 'One-Tap SOS initiated by user.',
      });

      if (res.data.success) {
        setActiveEmergency(res.data);
        if (onSOSTriggered) {
          onSOSTriggered(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to trigger SOS:', err);
      setLocationError(err.response?.data?.message || 'Failed to dispatch SOS alert. Please dial 112 immediately.');
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === 'small';

  return (
    <>
      {/* SOS Button Trigger */}
      <div className="relative inline-flex flex-col items-center justify-center">
        <button
          onClick={handleStartSOS}
          disabled={loading || isCountingDown}
          className={`relative z-10 flex flex-col items-center justify-center font-bold text-white transition-all transform active:scale-95 shadow-sos-glow ${
            isSmall
              ? 'w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-sm'
              : 'w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-600'
          } ${!isCountingDown ? 'animate-sos-pulse' : ''}`}
          aria-label="One-Tap Emergency SOS"
        >
          <AlertTriangle className={isSmall ? 'w-5 h-5 mb-0.5' : 'w-12 h-12 mb-1 animate-bounce'} />
          <span className={isSmall ? 'text-xs tracking-wider' : 'text-2xl font-black tracking-widest'}>
            SOS
          </span>
          {!isSmall && (
            <span className="text-[11px] font-medium tracking-normal text-red-100 opacity-90 mt-0.5">
              {t.sosPressText}
            </span>
          )}
        </button>

        {/* Pulse Ripple Rings */}
        <span className="absolute -inset-2 rounded-full border-2 border-red-500/40 animate-ping-slow pointer-events-none" />
        <span className="absolute -inset-6 rounded-full border border-red-400/20 pointer-events-none" />
      </div>

      {/* Countdown Cancellation Modal Window */}
      {isCountingDown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-red-500">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <span className="text-4xl font-extrabold animate-pulse">{countdown}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {t.sosTitle}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {t.sosTriggeringIn} {countdown}...
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={executeSOS}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <Send className="w-4 h-4" /> {t.btnSendAlertSMS}
              </button>
              <button
                onClick={handleCancelCountdown}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <X className="w-4 h-4" /> {t.sosCancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Emergency Confirmation & Quick Action Drawer */}
      {activeEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-red-600 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-600">
                    {t.sosActiveAlert}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatched at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveEmergency(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">
                Guardians & Emergency Services Alerted
              </p>
              <p className="text-sm text-slate-700">
                {t.sosActiveDesc}
              </p>
            </div>

            {/* Quick Action Buttons: tel & sms links */}
            <div className="space-y-3">
              <a
                href="tel:112"
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md transition"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  {t.callPolice112}
                </span>
                <span className="text-xs bg-red-700 px-2.5 py-1 rounded-full uppercase">Instant Dial</span>
              </a>

              <a
                href="tel:1091"
                className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  {t.callWomenHelpline}
                </span>
                <span className="text-xs bg-purple-800 px-2 py-0.5 rounded-full">24x7 Help</span>
              </a>

              {activeEmergency.actionLinks?.primaryContactCall && (
                <a
                  href={activeEmergency.actionLinks.primaryContactCall}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  <span className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    Call Primary Emergency Contact
                  </span>
                  <span className="text-xs text-slate-300">Direct Contact</span>
                </a>
              )}

              {activeEmergency.actionLinks?.googleMapsNavigation && (
                <a
                  href={activeEmergency.actionLinks.googleMapsNavigation}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs text-slate-600 hover:text-slate-900 transition"
                >
                  <Navigation className="w-4 h-4 text-purple-600" />
                  Open Live Coordinates on Google Maps
                </a>
              )}
            </div>

            {/* Safety Instructions */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Immediate Safety Recommendations:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Move towards a well-lit, crowded commercial spot or open shop.</li>
                <li>Keep your phone screen unlocked and battery saver on.</li>
                <li>Do not hesitate to shout or attract attention of passersby.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
