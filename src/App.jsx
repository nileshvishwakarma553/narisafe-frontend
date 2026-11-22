import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts & Public Pages
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmergencyHelplinesPage from './pages/EmergencyHelplinesPage';

// User Pages
import UserDashboard from './pages/UserDashboard';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import LiveLocationPage from './pages/LiveLocationPage';
import SaferRoutePage from './pages/SaferRoutePage';
import NearbySafePlacesPage from './pages/NearbySafePlacesPage';
import IncidentReportPage from './pages/IncidentReportPage';
import ProfilePage from './pages/ProfilePage';

// Guardian Pages
import GuardianDashboard from './pages/GuardianDashboard';
import GuardianInvitePage from './pages/GuardianInvitePage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminIncidentsPage from './pages/AdminIncidentsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminHelplinesPage from './pages/AdminHelplinesPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading NariSafe Shield...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate home
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'guardian') return <Navigate to="/guardian/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/helplines" element={<EmergencyHelplinesPage />} />

      {/* Protected Routes inside DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* User Hub */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/contacts" element={<EmergencyContactsPage />} />
        <Route path="/live-location" element={<LiveLocationPage />} />
        <Route path="/safer-routes" element={<SaferRoutePage />} />
        <Route path="/safe-places" element={<NearbySafePlacesPage />} />
        <Route path="/report-incident" element={<IncidentReportPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Guardian Suite */}
        <Route
          path="/guardian/dashboard"
          element={
            <ProtectedRoute allowedRoles={['guardian', 'admin']}>
              <GuardianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guardian/invitations"
          element={
            <ProtectedRoute allowedRoles={['guardian', 'admin', 'user']}>
              <GuardianInvitePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Console */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/incidents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminIncidentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/helplines"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHelplinesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
