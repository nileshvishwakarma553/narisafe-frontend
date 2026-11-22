import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [tokenReceived, setTokenReceived] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (res.data.resetToken) {
        setTokenReceived(res.data.resetToken);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100/60 via-slate-50 to-purple-50/40 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-soft-lg border border-slate-100 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <img
            src="/narisafe-logo.png"
            alt="NariSafe Logo"
            className="w-12 h-12 rounded-2xl object-contain shadow-soft-sm bg-white"
          />
          <span className="text-2xl font-black text-slate-900">NariSafe</span>
        </Link>

        <h2 className="text-xl font-bold text-slate-900 mb-1">Reset Password</h2>
        <p className="text-xs text-slate-500 mb-6">
          Enter your registered email to receive a secure recovery link
        </p>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-left animate-fadeIn">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Reset Link Dispatched
            </div>
            <p className="text-emerald-700">
              If an account is associated with <strong>{email}</strong>, a password reset token has been issued.
            </p>

            {tokenReceived && (
              <div className="mt-3 p-2.5 bg-white rounded-xl border border-emerald-200">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Demo Environment Token:</p>
                <code className="text-[11px] font-mono text-purple-700 block truncate">{tokenReceived}</code>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-emerald-200/60 text-center">
              <Link to="/login" className="font-bold text-emerald-900 hover:underline">
                &larr; Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@narisafe.org"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-purple-700">
                Cancel and return to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
