import { createAsyncThunk } from '@reduxjs/toolkit';
import * as packageService from './packageService';
import type {
  ComboService,
  CreateComboServicePayload,
  UpdateComboServicePayload,
  UploadComboImagePayload,
} from './packageTypes';

export const fetchComboServices = createAsyncThunk<ComboService[], void, { rejectValue: string }>(
  'package/fetchComboServices',
  async (_, { rejectWithValue }) => {
    try {
      return await packageService.fetchComboServices();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch combo services');
    }
  },
);

export const fetchComboServiceById = createAsyncThunk<
  ComboService,
  string,
  { rejectValue: string }
>('package/fetchComboServiceById', async (comboServiceId, { rejectWithValue }) => {
  try {
    return await packageService.fetchComboServiceById(comboServiceId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch combo service');
  }
});

export const createComboService = createAsyncThunk<
  ComboService,
  CreateComboServicePayload,
  { rejectValue: string }
>('package/createComboService', async (payload, { rejectWithValue }) => {
  try {
    return await packageService.createComboService(payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create combo service');
  }
});

export const updateComboService = createAsyncThunk<
  ComboService,
  { id: string; payload: UpdateComboServicePayload },
  { rejectValue: string }
>('package/updateComboService', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await packageService.updateComboService(id, payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update combo service');
  }
});

export const deleteComboService = createAsyncThunk<string, string, { rejectValue: string }>(
  'package/deleteComboService',
  async (comboServiceId, { rejectWithValue }) => {
    try {
      return await packageService.deleteComboService(comboServiceId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete combo service');
    }
  },
);

export const fetchAvailableComboServices = createAsyncThunk<
  ComboService[],
  void,
  { rejectValue: string }
>('package/fetchAvailableComboServices', async (_, { rejectWithValue }) => {
  try {
    return await packageService.fetchAvailableComboServices();
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch available combo services',
    );
  }
});

export const uploadComboServiceImage = createAsyncThunk<
  ComboService,
  { id: string; payload: UploadComboImagePayload },
  { rejectValue: string }
>('package/uploadComboServiceImage', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await packageService.uploadComboServiceImage(id, payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to upload combo service image');
  }
});

export const updateComboServiceImage = createAsyncThunk<
  ComboService,
  { id: string; payload: UploadComboImagePayload },
  { rejectValue: string }
>('package/updateComboServiceImage', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await packageService.updateComboServiceImage(id, payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update combo service image');
  }
});
