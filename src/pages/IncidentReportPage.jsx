import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Send,
  MapPin,
  Clock,
  Shield,
  FileText,
  CheckCircle2,
  Lock,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

const IncidentReportPage = () => {
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'my-reports'
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [incidentType, setIncidentType] = useState('Harassment');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [severity, setSeverity] = useState('medium');
  const [anonymous, setAnonymous] = useState(false);
  const [incidentTime, setIncidentTime] = useState(new Date().toISOString().slice(0, 16));

  const incidentTypes = [
    'Harassment',
    'Stalking',
    'Unsafe Public Area',
    'Poor Lighting',
    'Eve Teasing',
    'Theft',
    'Assault',
    'Suspicious Activity',
    'Other',
  ];

  // Auto-detect browser coordinates on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(6)));
          setLongitude(Number(pos.coords.longitude.toFixed(6)));
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await api.get('/incidents/my-reports');
      if (res.data.success) {
        setMyReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-reports') {
      fetchMyReports();
    }
  }, [activeTab]);

  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(6)));
          setLongitude(Number(pos.coords.longitude.toFixed(6)));
          setSuccess('Updated coordinates from device GPS.');
          setTimeout(() => setSuccess(''), 3000);
        },
        (err) => setError('Could not fetch GPS: ' + err.message)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/incidents', {
        incidentType,
        description,
        locationName,
        latitude,
        longitude,
        severity,
        anonymous,
        incidentTime: new Date(incidentTime),
      });

      if (res.data.success) {
        setSuccess('Incident reported successfully. Thank you for making our streets safer!');
        setDescription('');
        setLocationName('');
        setAnonymous(false);
        setActiveTab('my-reports');
        fetchMyReports();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-purple-700" />
          Community Incident & Hazard Reporting
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Crowdsource unsafe spots, broken streetlights, or harassment incidents. Help calibrate route safety scores and alert nearby citizens.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('report')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'report'
              ? 'border-purple-700 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Submit Safety Report
        </button>
        <button
          onClick={() => setActiveTab('my-reports')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'my-reports'
              ? 'border-purple-700 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Submitted Reports ({myReports.length})
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Submit Form */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Incident Category
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  {incidentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  <option value="low">Low (Minor nuisance / dark corner)</option>
                  <option value="medium">Medium (Verbal catcalling / unlit road)</option>
                  <option value="high">High (Active stalking / aggressive conduct)</option>
                  <option value="critical">Critical (Physical threat / weapon visible)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Location Landmark / Address
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Near Metro Station Gate 3, Outer Ring Road"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            {/* GPS Coordinates Inputs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Exact GPS Coordinates
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentGPS}
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> Use Current Device GPS
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  placeholder="Latitude"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono outline-none"
                />
                <input
                  type="number"
                  step="any"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  placeholder="Longitude"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Detailed Description
              </label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide factual details: what happened, description of individuals, lighting conditions, nearby shops, etc."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approximate Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 text-purple-700 rounded border-slate-300 focus:ring-purple-600"
                />
                <label htmlFor="anonCheck" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-purple-600" />
                  Submit Anonymously (Hide identity on public map)
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                All incident reports are queued for administrative verification.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> {loading ? 'Submitting...' : 'Submit Incident Report'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: My Reports */}
      {activeTab === 'my-reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            My Submitted Reports
          </h2>

          {myReports.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              You haven't submitted any incident reports yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myReports.map((report) => (
                <div key={report._id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{report.incidentType}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        report.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : report.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" /> {report.locationName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    {report.anonymous && (
                      <span className="text-purple-600 font-semibold">Submitted Anonymously</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IncidentReportPage;
