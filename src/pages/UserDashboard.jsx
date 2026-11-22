import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Radio,
  MapPin,
  Route,
  Users,
  AlertTriangle,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SafetyStatusCard from '../components/SafetyStatusCard';
import SOSButton from '../components/SOSButton';
import InteractiveMap from '../components/InteractiveMap';
import { getRealLocation } from '../utils/locationHelper';
import api from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(user?.lastKnownLocation?.address || 'Detecting live area...');
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(
    user?.lastKnownLocation?.latitude
      ? { lat: user.lastKnownLocation.latitude, lng: user.lastKnownLocation.longitude }
      : { lat: 28.6139, lng: 77.2090 }
  );

  useEffect(() => {
    const initLocationAndData = async () => {
      let activeLat = userCoords.lat;
      let activeLng = userCoords.lng;

      try {
        const loc = await getRealLocation();
        activeLat = loc.lat;
        activeLng = loc.lng;
        setUserCoords({ lat: loc.lat, lng: loc.lng });
        setCurrentAddress(loc.address);

        // Sync with backend
        api.post('/location/update', {
          latitude: loc.lat,
          longitude: loc.lng,
          accuracy: loc.accuracy,
          address: loc.address,
        }).catch(() => {});
      } catch (e) {}

      try {
        const [contactsRes, guardRes, incRes, spRes] = await Promise.allSettled([
          api.get('/contacts'),
          api.get('/guardian/connections'),
          api.get('/incidents?limit=5'),
          api.get(`/safe-places/nearby?lat=${activeLat}&lng=${activeLng}`),
        ]);

        if (contactsRes.status === 'fulfilled' && contactsRes.value.data.success) {
          setContacts(contactsRes.value.data.data);
        }
        if (guardRes.status === 'fulfilled' && guardRes.value.data.success) {
          setGuardians(guardRes.value.data.guardians || []);
        }
        if (incRes.status === 'fulfilled' && incRes.value.data.success) {
          setRecentIncidents(incRes.value.data.data.slice(0, 4));
        }
        if (spRes.status === 'fulfilled' && spRes.value.data.success) {
          setSafePlaces(spRes.value.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    initLocationAndData();
  }, []);

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];
  const activeGuardiansCount = guardians.filter((g) => g.invitationStatus === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-purple-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md mb-2">
            <Shield className="w-3.5 h-3.5 text-purple-300" /> NariSafe Emergency Shield Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Your real-time women safety hub. One-tap emergency dispatch, connected guardians, and safer route intelligence are ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/live-location"
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md border border-white/20 transition flex items-center gap-2"
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Tracking
          </Link>
          <a
            href="tel:112"
            className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" /> Call 112
          </a>
        </div>
      </div>

      {/* Safety Status Switcher */}
      <SafetyStatusCard />

      {/* Main Grid: SOS Hero Card & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOS Emergency Center */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            Priority One-Tap SOS
          </div>

          <div className="my-8">
            <SOSButton size="large" />
          </div>

          <p className="text-xs text-slate-500 max-w-xs mb-4">
            Press and hold for 3 seconds or trigger immediately. Sends GPS coordinates to guardians and opens direct police line.
          </p>

          {/* Quick Primary Contact Call Bar */}
          {primaryContact ? (
            <div className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Contact</p>
                <p className="text-xs font-bold text-slate-900">{primaryContact.name} ({primaryContact.relationship})</p>
              </div>
              <a
                href={`tel:${primaryContact.phone}`}
                className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call
              </a>
            </div>
          ) : (
            <Link
              to="/contacts"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              + Add Primary Emergency Contact
            </Link>
          )}
        </div>

        {/* Real-Time Geographic Overview Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-700" />
                Live Spatial Safety Overview
              </h3>
              <p className="text-xs text-slate-500">
                Current location, reported verified incidents, and nearest emergency safe havens
              </p>
            </div>
            <Link
              to="/safer-routes"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              Safer Routes &rarr;
            </Link>
          </div>

          <InteractiveMap
            center={userCoords}
            userLocation={userCoords}
            incidents={recentIncidents}
            safePlaces={safePlaces}
            height="320px"
          />
        </div>
      </div>

      {/* Quick Action Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/live-location"
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-purple-200 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Live Location</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Share live GPS with guardians</p>
          </div>
        </Link>

        <Link
          to="/safer-routes"
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-purple-200 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Safer Route</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Lighting & risk-scored paths</p>
          </div>
        </Link>

        <Link
          to="/safe-places"
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-purple-200 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Nearby Safe Havens</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">24x7 police, hospitals & clinics</p>
          </div>
        </Link>

        <Link
          to="/report-incident"
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-purple-200 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Report Incident</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Crowdsource unsafe spots</p>
          </div>
        </Link>
      </div>

      {/* Guardians & Emergency Contacts Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trusted Guardian Network Card */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-700" />
                Trusted Guardians ({activeGuardiansCount})
              </h3>
              <p className="text-[11px] text-slate-500">
                Connected individuals who receive your instant SOS alerts
              </p>
            </div>
            <Link
              to="/contacts"
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              Manage &rarr;
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {guardians.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No guardians linked yet.{' '}
                <Link to="/contacts" className="text-purple-700 font-bold hover:underline">
                  Invite a guardian
                </Link>
              </div>
            ) : (
              guardians.map((conn) => (
                <div
                  key={conn._id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center">
                      {conn.guardianId?.name ? conn.guardianId.name.charAt(0) : 'G'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{conn.guardianId?.name || 'Guardian'}</p>
                      <p className="text-[10px] text-slate-500">{conn.relationshipTag || 'Guardian'}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      conn.invitationStatus === 'accepted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {conn.invitationStatus === 'accepted' ? 'Active Monitoring' : 'Pending Acceptance'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Community Safety Reports */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-700" />
                Recent Community Safety Alerts
              </h3>
              <p className="text-[11px] text-slate-500">
                Verified reports near your general vicinity
              </p>
            </div>
            <Link
              to="/report-incident"
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentIncidents.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No active incidents reported in this zone.
              </div>
            ) : (
              recentIncidents.map((inc) => (
                <div
                  key={inc._id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900">{inc.incidentType}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded">
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{inc.locationName}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
