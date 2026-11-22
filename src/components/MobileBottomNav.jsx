import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Route, MapPin, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = ({ onOpenSOS }) => {
  const { user } = useAuth();
  if (!user) return null;

  const isGuardian = user.role === 'guardian';
  const isAdmin = user.role === 'admin';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-lg pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <NavLink
          to={isAdmin ? '/admin/dashboard' : isGuardian ? '/guardian/dashboard' : '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-semibold transition ${
              isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/safer-routes"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-semibold transition ${
              isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Route className="w-5 h-5 mb-0.5" />
          <span>Routes</span>
        </NavLink>

        {/* Central SOS Pulse Action */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenSOS}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-sos-glow animate-sos-pulse border-4 border-white"
            aria-label="Trigger SOS"
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="text-[9px] font-extrabold tracking-wider">SOS</span>
          </button>
        </div>

        <NavLink
          to="/safe-places"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-semibold transition ${
              isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Safe Havens</span>
        </NavLink>

        <NavLink
          to={isGuardian ? '/guardian/invitations' : '/contacts'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-semibold transition ${
              isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>{isGuardian ? 'Wards' : 'Guardians'}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
