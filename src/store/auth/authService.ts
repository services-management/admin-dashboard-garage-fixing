import axios from 'axios';
import type { LoginResponse } from './authTypes';

const API_BASE = import.meta.env.VITE_API_BASE as string;

// Create axios instance for auth requests
export const authAxios = axios.create({
  baseURL: API_BASE,
});

// Export configured axios for other services to use
export const apiClient = authAxios;

// Get tokens from localStorage
export const getAccessToken = () => localStorage.getItem('admin_token');
export const getRefreshToken = () => localStorage.getItem('admin_refresh_token');

const getAuthHeader = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers with new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Refresh token function
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  console.log('Attempting to refresh token. Refresh token exists:', !!refreshToken);

  if (!refreshToken) {
    console.log('No refresh token found, redirecting to login');
    window.location.href = '/';
    return null;
  }

  try {
    console.log('Calling /admin/refresh endpoint...');
    const response = await axios.post(`${API_BASE}/admin/refresh`, {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token } = response.data;
    console.log('Token refresh successful. New access token exists:', !!access_token);

    // Store new tokens
    localStorage.setItem('admin_token', access_token);
    if (refresh_token) {
      localStorage.setItem('admin_refresh_token', refresh_token);
    }

    return access_token;
  } catch (error: any) {
    console.error('Token refresh failed:', error.response?.status, error.response?.data);
    // Only redirect if refresh token is truly invalid (not network errors)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Refresh token is invalid/expired, clear tokens and redirect
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      window.location.href = '/';
    }
    // For other errors (network, server errors), don't redirect - let the user retry
    return null;
  }
};

// Setup axios interceptors for automatic token refresh
export const setupAuthInterceptors = () => {
  // Request interceptor - add auth header
  authAxios.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor - handle 401 and refresh token
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log('Response error:', error.response?.status, error.config?.url);

      // If error is 401 and we haven't tried to refresh yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('401 detected, attempting token refresh...');
        if (isRefreshing) {
          // Wait for token refresh and retry
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(authAxios(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            onTokenRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return authAxios(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};

export const adminLoginApi = async (
  identifier: string,
  password: string,
): Promise<LoginResponse> => {
  // support login by username or email
  const payload = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };

  const response = await axios.post(`${API_BASE}/admin/login`, payload);

  // Normalize response to include `access_token` which `authSlice` expects
  const data = response.data;
  const access_token = data?.access_token || data?.token || data?.Token || null;
  const refresh_token = data?.refresh_token || null;

  return {
    ...data,
    access_token,
    refresh_token,
  };
};

export const getCurrentAdminApi = async () => {
  const response = await axios.get(`${API_BASE}/admin/me`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateCurrentAdminApi = async (payload: {
  username?: string;
  password?: string;
  email_phone?: string;
  is_active?: boolean;
}) => {
  const response = await axios.put(`${API_BASE}/admin/me`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
};
