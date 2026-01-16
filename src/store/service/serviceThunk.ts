import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Service } from './serviceTypes';
import { ServiceService } from './serviceService';

export const fetchServices = createAsyncThunk<Service[]>(
  'service/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ServiceService.getServices();

      return data.map((s: any) => ({
        ...s,
        price: Number(s.price), // ✅ FIX
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch services');
    }
  },
);

export const createService = createAsyncThunk<Service, any>(
  'service/createService',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await ServiceService.createService(payload);
      return {
        ...res,
        price: Number(res.price), // ✅ FIX
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create service');
    }
  },
);

export const updateService = createAsyncThunk<Service, { service_id: number; payload: any }>(
  'service/updateService',
  async ({ service_id, payload }, { rejectWithValue }) => {
    try {
      const res = await ServiceService.updateService(service_id, payload);
      return {
        ...res,
        price: Number(res.price), // ✅ FIX
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update service');
    }
  },
);

export const deleteService = createAsyncThunk<number, number>(
  'service/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await ServiceService.deleteService(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete service');
    }
  },
);
