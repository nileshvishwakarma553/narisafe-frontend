import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('narisafe_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if token is stored
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      localStorage.setItem('narisafe_token', newToken);
      localStorage.setItem('narisafe_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      localStorage.setItem('narisafe_token', newToken);
      localStorage.setItem('narisafe_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('narisafe_token');
    localStorage.removeItem('narisafe_user');
    setToken(null);
    setUser(null);
  };

  const updateSafetyStatus = async (status) => {
    try {
      const res = await api.put('/auth/safety-status', { status });
      if (res.data.success) {
        setUser((prev) => (prev ? { ...prev, safetyStatus: status } : null));
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update safety status:', err);
      throw err;
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('narisafe_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateSafetyStatus,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
