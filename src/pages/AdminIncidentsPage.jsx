import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Filter,
} from 'lucide-react';
import api from '../services/api';

const AdminIncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [success, setSuccess] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/incidents?status=${statusFilter}&severity=${severityFilter}&search=${search}`
      );
      if (res.data.success) {
        setIncidents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, severityFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIncidents();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/incidents/${id}/status`, {
        status,
        adminNotes,
      });

      if (res.data.success) {
        setSuccess(`Incident updated to "${status}".`);
        setSelectedIncident(null);
        setAdminNotes('');
        fetchIncidents();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      alert('Failed to update incident.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-700" />
          Incident Review & Verification Pipeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Validate community reports, weed out spam, and calibrate ML safety scoring matrices.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft-sm border border-slate-100 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location, description, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-3xl shadow-soft-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Location Landmark</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No incidents matching this criteria.
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-slate-900">{inc.incidentType}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{inc.locationName}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md ${
                          inc.severity === 'critical' || inc.severity === 'high'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {inc.anonymous ? (
                        <span className="italic text-purple-600">Anonymous</span>
                      ) : (
                        inc.reporterId?.name || 'Registered'
                      )}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          inc.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inc.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {inc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedIncident(inc);
                          setAdminNotes(inc.adminNotes || '');
                        }}
                        className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verification Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                Incident Review
              </span>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {selectedIncident.incidentType} - {selectedIncident.locationName}
            </h3>
            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
              {selectedIncident.description}
            </p>

            <div className="text-xs space-y-1 mb-4 text-slate-500">
              <p>GPS: {selectedIncident.latitude}, {selectedIncident.longitude}</p>
              <p>Reported: {new Date(selectedIncident.createdAt).toLocaleString()}</p>
              <p>Reporter: {selectedIncident.anonymous ? 'Anonymous Citizen' : selectedIncident.reporterId?.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Notes</label>
              <textarea
                rows="2"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Notes on police referral, municipal notification, or verification..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleUpdateStatus(selectedIncident._id, 'rejected')}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition"
              >
                Reject Report
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedIncident._id, 'resolved')}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedIncident._id, 'verified')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
              >
                Verify & Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIncidentsPage;
