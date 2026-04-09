import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './authTypes';
import { adminLogin } from './authThunk';

const initialState: AuthState = {
  token: localStorage.getItem('admin_token'),
  refreshToken: localStorage.getItem('admin_refresh_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
    },
    setTokens: (state, action) => {
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      localStorage.setItem('admin_token', action.payload.access_token);
      if (action.payload.refresh_token) {
        localStorage.setItem('admin_refresh_token', action.payload.refresh_token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token || null;
        state.isAuthenticated = true;
        localStorage.setItem('admin_token', action.payload.access_token);
        if (action.payload.refresh_token) {
          localStorage.setItem('admin_refresh_token', action.payload.refresh_token);
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setTokens } = authSlice.actions;
export default authSlice.reducer;
