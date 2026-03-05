import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Make,
  MakeInput,
  Model,
  ModelInput,
  VehicleSpec,
  VehicleSpecInput,
} from './vehicleTypes';
import {
  getMakesApi,
  createMakeApi,
  updateMakeApi,
  deleteMakeApi,
  getModelsApi,
  createModelApi,
  updateModelApi,
  deleteModelApi,
  getVehicleSpecsApi,
  createVehicleSpecApi,
  updateVehicleSpecApi,
  deleteVehicleSpecApi,
} from './vehicleService';

// Make Thunks
export const fetchMakes = createAsyncThunk<Make[]>(
  'vehicle/fetchMakes',
  async (_, { rejectWithValue }) => {
    try {
      return await getMakesApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch makes');
    }
  },
);

export const createMake = createAsyncThunk<Make, MakeInput>(
  'vehicle/createMake',
  async (payload, { rejectWithValue }) => {
    try {
      return await createMakeApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create make');
    }
  },
);

export const updateMake = createAsyncThunk<Make, { makeId: number; payload: MakeInput }>(
  'vehicle/updateMake',
  async ({ makeId, payload }, { rejectWithValue }) => {
    try {
      return await updateMakeApi(makeId, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update make');
    }
  },
);

export const deleteMake = createAsyncThunk<number, number>(
  'vehicle/deleteMake',
  async (makeId, { rejectWithValue }) => {
    try {
      await deleteMakeApi(makeId);
      return makeId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete make');
    }
  },
);

// Model Thunks
export const fetchModels = createAsyncThunk<Model[]>(
  'vehicle/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      return await getModelsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch models');
    }
  },
);

export const createModel = createAsyncThunk<Model, ModelInput>(
  'vehicle/createModel',
  async (payload, { rejectWithValue }) => {
    try {
      return await createModelApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create model');
    }
  },
);

export const updateModel = createAsyncThunk<Model, { modelId: number; payload: ModelInput }>(
  'vehicle/updateModel',
  async ({ modelId, payload }, { rejectWithValue }) => {
    try {
      return await updateModelApi(modelId, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update model');
    }
  },
);

export const deleteModel = createAsyncThunk<number, number>(
  'vehicle/deleteModel',
  async (modelId, { rejectWithValue }) => {
    try {
      await deleteModelApi(modelId);
      return modelId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete model');
    }
  },
);

// Vehicle Spec Thunks
export const fetchVehicleSpecs = createAsyncThunk<VehicleSpec[]>(
  'vehicle/fetchVehicleSpecs',
  async (_, { rejectWithValue }) => {
    try {
      return await getVehicleSpecsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch vehicle specs');
    }
  },
);

export const createVehicleSpec = createAsyncThunk<VehicleSpec, VehicleSpecInput>(
  'vehicle/createVehicleSpec',
  async (payload, { rejectWithValue }) => {
    try {
      return await createVehicleSpecApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create vehicle spec');
    }
  },
);

export const updateVehicleSpec = createAsyncThunk<
  VehicleSpec,
  { vehicleId: number; payload: VehicleSpecInput }
>('vehicle/updateVehicleSpec', async ({ vehicleId, payload }, { rejectWithValue }) => {
  try {
    return await updateVehicleSpecApi(vehicleId, payload);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to update vehicle spec');
  }
});

export const deleteVehicleSpec = createAsyncThunk<number, number>(
  'vehicle/deleteVehicleSpec',
  async (vehicleId, { rejectWithValue }) => {
    try {
      await deleteVehicleSpecApi(vehicleId);
      return vehicleId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete vehicle spec');
    }
  },
);
