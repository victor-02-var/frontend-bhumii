import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const DEMO_ROLES = [
  { role: 'district_officer', label: 'District Officer (Bhopal, MP)', state: 'Madhya Pradesh', district: 'Bhopal' },
  { role: 'collector', label: 'District Collector (Lucknow, UP)', state: 'Uttar Pradesh', district: 'Lucknow' },
  { role: 'state_admin', label: 'State Admin (Maharashtra)', state: 'Maharashtra', district: null },
  { role: 'central_admin', label: 'Central Ministry Admin (National)', state: 'National', district: null },
];

const STORAGE_KEYS = {
  token: 'landguard_token',
  refresh: 'landguard_refresh_token',
  user: 'landguard_user',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.user);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token) || null);
  const [loading, setLoading] = useState(false);

  // Persist user & token whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
    }
  }, [token]);

  // ── Send OTP ────────────────────────────────────────────────────────────
  const sendOTP = useCallback(async (email) => {
    const res = await authService.sendOTP(email);
    return res.data; // { success: true, message: '...' }
  }, []);

  // ── Verify OTP (signup flow) ─────────────────────────────────────────────
  const verifyOTP = useCallback(async (email, otp) => {
    const res = await authService.verifyOTP(email, otp);
    return res.data; // { success: true, tempToken: '...' }
  }, []);

  // ── Complete Signup ─────────────────────────────────────────────────────
  const register = useCallback(async (payload) => {
    try {
      const res = await authService.signup(payload);
      const { accessToken, refreshToken, user: userData } = res.data;
      _applySession(accessToken, refreshToken, userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message: msg };
    }
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const { accessToken, refreshToken, user: userData } = res.data;
      _applySession(accessToken, refreshToken, userData);
      return { success: true };
    } catch (err) {
      // Graceful demo fallback when backend is unreachable
      const isNetworkError = !err.response;
      if (isNetworkError) {
        const demoUser = _buildDemoUser(email);
        _applySession('demo_access_token', 'demo_refresh_token', demoUser);
        console.warn('Backend unreachable — using demo session');
        return { success: true, demo: true };
      }
      const msg = err.response?.data?.message || 'Invalid credentials';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refresh);
    try {
      if (refreshToken && refreshToken !== 'demo_refresh_token') {
        await authService.logout(refreshToken);
      }
    } catch {
      // swallow — local clear happens regardless
    } finally {
      _clearSession();
    }
  }, []);

  // ── Switch Demo Role (SIH evaluation helper) ─────────────────────────────
  const switchDemoRole = useCallback((roleConfig) => {
    const demoUser = {
      id: 'demo-user-id',
      email: `${roleConfig.role}@landguard.gov.in`,
      full_name: roleConfig.label,
      role: roleConfig.role,
      state: roleConfig.state,
      district: roleConfig.district,
    };
    setUser(demoUser);
    // Keep token as demo token so api.js interceptor works
    if (!token) {
      setToken('demo_access_token');
      localStorage.setItem(STORAGE_KEYS.refresh, 'demo_refresh_token');
    }
  }, [token]);

  // ── Internal helpers ─────────────────────────────────────────────────────
  const _applySession = (accessToken, refreshToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refresh, refreshToken);
  };

  const _clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const _buildDemoUser = (email) => ({
    id: 'demo-user-id',
    email,
    full_name: email.split('@')[0].replace(/_/g, ' ').toUpperCase() || 'Demo Officer',
    role: 'central_admin',
    state: 'National',
    district: null,
  });

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register, sendOTP, verifyOTP, switchDemoRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
