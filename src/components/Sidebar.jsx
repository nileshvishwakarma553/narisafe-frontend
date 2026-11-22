import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Radio,
  MapPin,
  Route,
  AlertTriangle,
  FileText,
  PhoneCall,
  Shield,
  BarChart3,
  UserCheck,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  if (!user) return null;

  const role = user.role || 'user';

  // Navigation Items per role
  const userNavItems = [
    { label: t.navOverview, to: '/dashboard', icon: LayoutDashboard },
    { label: t.navContacts, to: '/contacts', icon: Users },
    { label: t.navLiveLocation, to: '/live-location', icon: Radio },
    { label: t.navSaferRoutes, to: '/safer-routes', icon: Route },
    { label: t.navSafePlaces, to: '/safe-places', icon: MapPin },
    { label: t.navReportIncident, to: '/report-incident', icon: AlertTriangle },
    { label: t.navHelplines, to: '/helplines', icon: PhoneCall },
  ];

  const guardianNavItems = [
    { label: t.navGuardianDashboard, to: '/guardian/dashboard', icon: Shield },
    { label: t.navGuardianInvites, to: '/guardian/invitations', icon: UserCheck },
    { label: t.navSafePlaces, to: '/safe-places', icon: MapPin },
    { label: t.navHelplines, to: '/helplines', icon: PhoneCall },
  ];

  const adminNavItems = [
    { label: t.navAdminDashboard, to: '/admin/dashboard', icon: LayoutDashboard },
    { label: t.navIncidentPipeline, to: '/admin/incidents', icon: FileText },
    { label: t.navSafetyAnalytics, to: '/admin/analytics', icon: BarChart3 },
    { label: t.navUserDirectory, to: '/admin/users', icon: Users },
    { label: t.navManageHelplines, to: '/admin/helplines', icon: PhoneCall },
  ];

  const navItems = role === 'admin' ? adminNavItems : role === 'guardian' ? guardianNavItems : userNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Role badge */}
          <div className="px-3 py-2 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">{t.workspace}</p>
              <p className="text-xs font-bold text-purple-900 capitalize">{role} {t.console}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Support Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center gap-2 mb-1 text-slate-800">
              <LifeBuoy className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold">24x7 Emergency Aid</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
              In an immediate life-threatening crisis, always dial ERSS 112 directly.
            </p>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call 112
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
