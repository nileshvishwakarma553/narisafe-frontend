import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, XCircle, Clock, Shield, AlertCircle } from 'lucide-react';
import api from '../services/api';

const GuardianInvitePage = () => {
  const [connections, setConnections] = useState({ guardians: [], wards: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/guardian/connections');
      if (res.data.success) {
        setConnections({
          guardians: res.data.guardians || [],
          wards: res.data.wards || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleRespond = async (connectionId, status) => {
    setMessage('');
    setError('');
    try {
      const res = await api.post('/guardian/accept', { connectionId, status });
      if (res.data.success) {
        setMessage(`Invitation ${status} successfully.`);
        fetchConnections();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process response.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-purple-700" />
          Guardian Invitations & Monitoring Authorizations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review requests to become a safety guardian or monitor authorized wards.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Incoming Requests to Monitor Someone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Incoming Guardian Requests ({connections.wards.length})
        </h2>

        {connections.wards.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No incoming guardian invitations pending for your account.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {connections.wards.map((item) => (
              <div key={item._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.userId?.name || 'User'}</h4>
                  <p className="text-xs text-slate-500">{item.userId?.email || item.userId?.phone}</p>
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Invited as: {item.relationshipTag || 'Safety Guardian'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.invitationStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleRespond(item._id, 'accepted')}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept & Protect
                      </button>
                      <button
                        onClick={() => handleRespond(item._id, 'rejected')}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.invitationStatus === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Status: {item.invitationStatus.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardianInvitePage;
