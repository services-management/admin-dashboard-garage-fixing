import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminLoginApi, getCurrentAdminApi } from './authService';

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (
    { identifier, password }: { identifier: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      return await adminLoginApi(identifier, password);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const fetchCurrentAdmin = createAsyncThunk(
  'auth/fetchCurrentAdmin',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentAdminApi();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch admin';
      return rejectWithValue(message);
    }
  },
);
