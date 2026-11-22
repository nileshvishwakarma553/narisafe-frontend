import React, { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Radio, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SafetyStatusCard = () => {
  const { user, updateSafetyStatus } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentStatus = user?.safetyStatus || 'safe';

  const statuses = [
    {
      id: 'safe',
      label: 'Safe',
      description: 'You are in a safe, secure environment.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100',
      activeColor: 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400',
      badge: 'Normal Status',
    },
    {
      id: 'monitoring_active',
      label: 'Monitoring Active',
      description: 'Guardians receive continuous live location pings.',
      icon: Radio,
      color: 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100',
      activeColor: 'bg-purple-700 text-white border-purple-700 ring-2 ring-purple-400',
      badge: 'Live Tracking',
    },
    {
      id: 'emergency_active',
      label: 'Emergency Active',
      description: 'Immediate threat detected. High priority alert.',
      icon: ShieldAlert,
      color: 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100',
      activeColor: 'bg-red-600 text-white border-red-600 ring-2 ring-red-400 animate-pulse',
      badge: 'SOS Priority',
    },
  ];

  const handleSelectStatus = async (statusId) => {
    if (statusId === currentStatus) return;
    setUpdating(true);
    setFeedbackMessage('');
    try {
      await updateSafetyStatus(statusId);
      setFeedbackMessage(`Status updated to ${statusId.replace('_', ' ').toUpperCase()}`);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (err) {
      setFeedbackMessage('Failed to update status. Please check your connection.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-700" />
            Personal Safety Status
          </h3>
          <p className="text-xs text-slate-500">
            Explicitly set your vigilance level. Never assumed automatically.
          </p>
        </div>
        {feedbackMessage && (
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 animate-fadeIn">
            {feedbackMessage}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statuses.map((item) => {
          const Icon = item.icon;
          const isActive = currentStatus === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectStatus(item.id)}
              disabled={updating}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive ? item.activeColor : item.color
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-2 font-bold text-sm">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border'
                }`}>
                  {item.badge}
                </span>
              </div>
              <p className={`text-xs ${isActive ? 'text-white/90' : 'text-slate-600'}`}>
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <Info className="w-4 h-4 text-purple-600 flex-shrink-0" />
        <span>
          Changing your status broadcasts an instant notification to all accepted guardians on their live dashboard.
        </span>
      </div>
    </div>
  );
};

export default SafetyStatusCard;
