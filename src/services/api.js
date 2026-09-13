import axios from 'axios';

// ---------------------------------------------------------------------------
// Axios instance — Vite proxy forwards /api → http://localhost:3000
// ---------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor — attach JWT Bearer ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('landguard_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 & auto-refresh ──────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('landguard_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const newToken = data.accessToken;
          localStorage.setItem('landguard_token', newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('landguard_token');
          localStorage.removeItem('landguard_refresh_token');
          localStorage.removeItem('landguard_user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        localStorage.removeItem('landguard_token');
        localStorage.removeItem('landguard_user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ===========================================================================
// AUTH SERVICE
// ===========================================================================
export const authService = {
  /** Step 1 of signup / login — send OTP to email */
  sendOTP: (email) => api.post('/auth/send-otp', { email }),

  /** Step 2 of signup — verify OTP, receive tempToken */
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),

  /** Step 3 of signup — complete registration with tempToken */
  signup: (payload) => api.post('/auth/signup', payload),

  /** Login with email + password → returns accessToken + refreshToken */
  login: (email, password) => api.post('/auth/login', { email, password }),

  /** Logout — invalidate refresh token on server */
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),

  /** Refresh access token */
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  /** Forgot password — send reset OTP */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  /** Verify password reset OTP */
  verifyResetOTP: (email, otp) => api.post('/auth/verify-reset-otp', { email, otp }),

  /** Reset password with tempToken */
  resetPassword: (tempToken, newPassword) => api.post('/auth/reset-password', { tempToken, newPassword }),
};

// ===========================================================================
// DASHBOARD SERVICE
// ===========================================================================
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRiskDistribution: () => api.get('/dashboard/risk-distribution'),
  getDelayTrend: () => api.get('/dashboard/delay-trend'),
  getStageFunnel: () => api.get('/dashboard/stage-funnel'),
  getTopDelayFactors: () => api.get('/dashboard/top-delay-factors'),
  getCompensationStatus: () => api.get('/dashboard/compensation-status'),
  getRRCompliance: () => api.get('/dashboard/rr-compliance'),
  getSection11Countdown: () => api.get('/dashboard/section11-lapse-countdown'),
  getOfficerPerformance: () => api.get('/dashboard/officer-performance'),
  getComparativeAnalytics: () => api.get('/dashboard/comparative-analytics'),
};

// ===========================================================================
// PROJECTS SERVICE
// ===========================================================================
export const projectsService = {
  list: (params = {}) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.patch(`/projects/${id}`, data),
  archive: (id) => api.delete(`/projects/${id}`),
  updateStage: (id, stage, notes) => api.patch(`/projects/${id}/stage`, { stage, notes }),
  getStageHistory: (id) => api.get(`/projects/${id}/stage-history`),
  getHighRisk: (threshold) => api.get('/projects/high-risk', { params: { threshold } }),
  getSection11Watch: () => api.get('/projects/section11-lapse-watch'),
  bulkImport: (records) => api.post('/projects/bulk-import', { records }),
};

// ===========================================================================
// PREDICTIONS SERVICE
// ===========================================================================
export const predictionsService = {
  getByProject: (projectId) => api.get(`/predictions/project/${projectId}`),
  trigger: (projectId) => api.post('/predictions/trigger', { projectId }),
  getLatest: (projectId) => api.get(`/predictions/project/${projectId}/latest`),
};

// ===========================================================================
// RECOMMENDATIONS SERVICE
// ===========================================================================
export const recommendationsService = {
  getByProject: (projectId) => api.get(`/recommendations/project/${projectId}`),
  updateStatus: (id, status) => api.put(`/recommendations/${id}/status`, { status }),
  getUrgent: (params = {}) => api.get('/recommendations/priority/urgent', { params }),
};

// ===========================================================================
// ALERTS SERVICE
// ===========================================================================
export const alertsService = {
  list: (params = {}) => api.get('/alerts', { params }),
  acknowledge: (id) => api.patch(`/alerts/${id}/acknowledge`),
  resolve: (id) => api.patch(`/alerts/${id}/resolve`),
};

// ===========================================================================
// GIS SERVICE
// ===========================================================================
export const gisService = {
  getDistrictHeatmap: () => api.get('/gis/districts/risk-heatmap'),
  getStateHeatmap: () => api.get('/gis/states/risk-heatmap'),
  getGeoJSON: () => api.get('/gis/projects/geojson'),
  getDistrictProjects: (district) => api.get(`/gis/districts/${district}/projects`),
};

// ===========================================================================
// OFFICERS SERVICE
// ===========================================================================
export const officersService = {
  list: (params = {}) => api.get('/officers', { params }),
  getById: (id) => api.get(`/officers/${id}`),
  updateProfile: (id, data) => api.patch(`/officers/${id}`, data),
};

// ===========================================================================
// AUDIT SERVICE
// ===========================================================================
export const auditService = {
  list: (params = {}) => api.get('/audit', { params }),
};

// ===========================================================================
// USERS SERVICE
// ===========================================================================
export const usersService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  changePassword: (oldPassword, newPassword) =>
    api.patch('/users/me/password', { oldPassword, newPassword }),
};
