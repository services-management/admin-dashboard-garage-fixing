import axios from 'axios';
import type {
  ComboService,
  CreateComboServicePayload,
  UpdateComboServicePayload,
  UploadComboImagePayload,
} from './packageTypes';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchComboServices = async (): Promise<ComboService[]> => {
  const response = await axios.get(`${API_BASE}/service/combo/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const fetchComboServiceById = async (comboServiceId: string): Promise<ComboService> => {
  const response = await axios.get(`${API_BASE}/service/combo/${comboServiceId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createComboService = async (
  payload: CreateComboServicePayload,
): Promise<ComboService> => {
  console.log('Creating combo service with payload:', JSON.stringify(payload, null, 2));
  try {
    const response = await axios.post(`${API_BASE}/service/combo/`, payload, {
      headers: getAuthHeader(),
    });
    console.log('Combo service created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error Status:', error.response?.status);
    console.error('API Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('API Error Message:', error.message);
    throw error;
  }
};

export const updateComboService = async (
  comboServiceId: string,
  payload: UpdateComboServicePayload,
): Promise<ComboService> => {
  const response = await axios.put(`${API_BASE}/service/combo/${comboServiceId}`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteComboService = async (comboServiceId: string): Promise<string> => {
  await axios.delete(`${API_BASE}/service/combo/${comboServiceId}`, {
    headers: getAuthHeader(),
  });
  return comboServiceId;
};

export const fetchAvailableComboServices = async (): Promise<ComboService[]> => {
  const response = await axios.get(`${API_BASE}/service/combo/available/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const uploadComboServiceImage = async (
  comboServiceId: string,
  payload: UploadComboImagePayload,
): Promise<ComboService> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  const response = await axios.post(`${API_BASE}/service/combo/${comboServiceId}/image`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateComboServiceImage = async (
  comboServiceId: string,
  payload: UploadComboImagePayload,
): Promise<ComboService> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  const response = await axios.put(`${API_BASE}/service/combo/${comboServiceId}/image`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
