import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';
import EmergencyAlertBanner from '../components/EmergencyAlertBanner';
import SOSButton from '../components/SOSButton';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      {/* Real-time Emergency SOS Alert Banner if triggered */}
      <EmergencyAlertBanner />

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Collapsible Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-20 lg:pb-10">
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav onOpenSOS={() => setSosModalOpen(true)} />

      {/* Modal SOS if triggered from bottom nav */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl border-2 border-red-500">
            <button
              onClick={() => setSosModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency Dispatch</h3>
            <p className="text-xs text-slate-600 mb-6">
              Tap the SOS button to instantly alert your registered guardians and local police.
            </p>
            <div className="py-4">
              <SOSButton size="large" onSOSTriggered={() => setSosModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
