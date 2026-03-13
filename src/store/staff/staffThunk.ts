import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Admin, AdminInput, Technical, TechnicalInput } from './staffTypes';
import { createAdminApi, createTechnicalApi, getAdminsApi, getTechnicalsApi } from './staffService';

export const fetchAdmins = createAsyncThunk<Admin[]>(
  'staff/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch admins');
    }
  },
);

export const fetchTechnicals = createAsyncThunk<Technical[]>(
  'staff/fetchTechnicals',
  async (_, { rejectWithValue }) => {
    try {
      return await getTechnicalsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch technicals');
    }
  },
);

export const createAdmin = createAsyncThunk<Admin, AdminInput>(
  'staff/createAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      return await createAdminApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create admin');
    }
  },
);

export const createTechnical = createAsyncThunk<Technical, TechnicalInput>(
  'staff/createTechnical',
  async (payload, { rejectWithValue }) => {
    try {
      return await createTechnicalApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create technical staff');
    }
  },
);
