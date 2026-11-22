import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  Radio,
  ArrowRight,
  Phone,
  Navigation,
  Eye,
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleResolveEmergency = async (id) => {
    if (!window.confirm('Mark this emergency SOS incident as resolved?')) return;
    try {
      await api.put(`/emergency/${id}/resolve`, { notes: 'Resolved by Admin Dispatch Console.' });
      fetchDashboardStats();
    } catch (err) {
      alert('Failed to resolve emergency.');
    }
  };

  const stats = data?.stats || {
    totalUsers: 0,
    totalGuardians: 0,
    totalIncidents: 0,
    activeEmergencies: 0,
    resolvedEmergencies: 0,
    reportsUnderReview: 0,
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md mb-2">
            <Shield className="w-3.5 h-3.5 text-purple-300" /> Command & Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            NariSafe Administrative Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time incident verification, emergency SOS triage, user role controls, and safety risk intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
          >
            Analytics & Heatmap
          </Link>
          <Link
            to="/admin/incidents"
            className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition"
          >
            Review Incidents
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardians</p>
          <p className="text-2xl font-black text-indigo-900 mt-1">{stats.totalGuardians}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Incidents</p>
          <p className="text-2xl font-black text-purple-900 mt-1">{stats.totalIncidents}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active SOS</p>
          <p className="text-2xl font-black text-red-600 mt-1 flex items-center gap-1.5">
            {stats.activeEmergencies}
            {stats.activeEmergencies > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Under Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.reportsUnderReview}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.resolvedEmergencies}</p>
        </div>
      </div>

      {/* Active SOS Emergency Triage Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active SOS Emergencies Triage ({data?.activeSOSList?.length || 0})
            </h2>
            <p className="text-xs text-slate-500">
              Immediate life-safety incidents currently active in the system
            </p>
          </div>
          <button onClick={fetchDashboardStats} className="text-xs font-bold text-purple-700 hover:underline">
            Refresh
          </button>
        </div>

        {(!data?.activeSOSList || data.activeSOSList.length === 0) ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active SOS emergencies at this time. All clear.
          </div>
        ) : (
          <div className="space-y-3">
            {data.activeSOSList.map((sos) => (
              <div
                key={sos._id}
                className="p-4 rounded-2xl bg-red-50/80 border border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-sm text-red-900">
                      🚨 {sos.userId?.name || 'Citizen'}
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                      CRITICAL SOS
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">
                    Phone: {sos.userId?.phone || 'N/A'} • Coordinates: {sos.latitude.toFixed(5)}, {sos.longitude.toFixed(5)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Triggered at {new Date(sos.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${sos.userId?.phone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Victim
                  </a>
                  <a
                    href={`https://www.google.com/maps?q=${sos.latitude},${sos.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-purple-600" /> Map
                  </a>
                  <button
                    onClick={() => handleResolveEmergency(sos._id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Incident Submissions Pipeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-700" />
              Recent Incidents Pending Verification
            </h2>
            <p className="text-xs text-slate-500">
              Review crowdsourced safety submissions before public broadcast
            </p>
          </div>
          <Link to="/admin/incidents" className="text-xs font-bold text-purple-700 hover:underline">
            Manage All Incidents &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {data?.recentIncidents?.map((inc) => (
            <div key={inc._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{inc.incidentType}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                    Severity: {inc.severity}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {inc.status}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1">{inc.description}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Location: {inc.locationName} • Reporter: {inc.anonymous ? 'Anonymous' : inc.reporterId?.name || 'Registered User'}
                </p>
              </div>

              <Link
                to={`/admin/incidents?search=${encodeURIComponent(inc.locationName)}`}
                className="text-purple-700 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect & Verify
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
