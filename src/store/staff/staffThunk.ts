import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Admin, AdminInput, Technical, TechnicalInput } from './staffTypes';
import { createAdminApi, createTechnicalApi } from './staffService';

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
