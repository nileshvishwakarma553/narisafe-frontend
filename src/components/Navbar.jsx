import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Radio,
  AlertTriangle,
  PhoneCall,
  Languages,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { activeAlerts } = useSocket();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = () => {
    const status = user?.safetyStatus || 'safe';
    if (status === 'emergency_active') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          {t.statusEmergency}
        </span>
      );
    }
    if (status === 'monitoring_active') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
          <Radio className="w-3.5 h-3.5 text-purple-600 animate-spin" />
          {t.statusMonitoring}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        {t.statusSafe}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 lg:hidden transition"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : user.role === 'guardian' ? '/guardian/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5">
              <img
                src="/narisafe-logo.png"
                alt="NariSafe Logo"
                className="w-9 h-9 rounded-2xl object-contain shadow-soft-sm bg-white"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-900 via-purple-800 to-violet-700 bg-clip-text text-transparent">
                  NariSafe
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  SHIELD 2.0
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Live Safety Status Pill (for authenticated users) */}
          {user && (
            <div className="hidden md:flex items-center">
              {getStatusBadge()}
            </div>
          )}

          {/* Right: Emergency dial, Notifications, Profile Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher Pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition shadow-sm"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-purple-700" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Quick Helpline Hotline button */}
            <a
              href="tel:112"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition"
              title="Direct Police Emergency Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>112 SOS</span>
            </a>

            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-slate-600 hover:text-purple-700 hover:bg-purple-50 relative transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {activeAlerts.length > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-fadeIn">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Live Alerts ({activeAlerts.length})
                        </span>
                        <span className="text-[10px] text-purple-600 font-semibold">Real-Time</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                        {activeAlerts.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No critical active emergency alerts.
                          </div>
                        ) : (
                          activeAlerts.map((alert, idx) => (
                            <div key={idx} className="p-3 bg-red-50/50 hover:bg-red-50 transition">
                              <p className="text-xs font-bold text-red-700">
                                🚨 SOS: {alert.userName || 'Protected User'}
                              </p>
                              <p className="text-[11px] text-slate-600 mt-0.5">
                                {alert.locationName || 'Live GPS Coordinates Shared'}
                              </p>
                              <a
                                href={alert.mapsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-1 text-[11px] font-bold text-purple-700 hover:underline"
                              >
                                View on Map &rarr;
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden lg:block text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          Role: {user.role}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <UserIcon className="w-4 h-4" /> Profile & Medical Info
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
