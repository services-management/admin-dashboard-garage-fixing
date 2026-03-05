import axios from 'axios';
import type {
  Make,
  MakeInput,
  Model,
  ModelInput,
  VehicleSpec,
  VehicleSpecInput,
} from './vehicleTypes';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Make APIs
export const getMakesApi = async (): Promise<Make[]> => {
  const response = await axios.get(`${API_BASE}/vehicles/makes`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createMakeApi = async (make: MakeInput): Promise<Make> => {
  const response = await axios.post(`${API_BASE}/vehicles/make`, make, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateMakeApi = async (makeId: number, make: MakeInput): Promise<Make> => {
  const response = await axios.patch(`${API_BASE}/vehicles/make/${makeId}?id=${makeId}`, make, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteMakeApi = async (makeId: number): Promise<void> => {
  await axios.delete(`${API_BASE}/vehicles/make/${makeId}`, {
    headers: getAuthHeader(),
  });
};

// Model APIs
export const getModelsApi = async (makeId?: number): Promise<Model[]> => {
  if (makeId) {
    const response = await axios.get(`${API_BASE}/vehicles/makes/${makeId}/models`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
  // Fallback: get all models from all makes
  const makesResponse = await axios.get(`${API_BASE}/vehicles/makes`, {
    headers: getAuthHeader(),
  });
  const makes = makesResponse.data;
  const allModels: Model[] = [];
  for (const make of makes) {
    const makeId = (make as any).id || (make as any).make_id;
    if (!makeId) continue;
    try {
      const modelsResponse = await axios.get(`${API_BASE}/vehicles/makes/${makeId}/models`, {
        headers: getAuthHeader(),
      });
      allModels.push(...modelsResponse.data);
    } catch (err: any) {
      // Skip makes that don't have models or where endpoint returns 404
      if (err.response?.status !== 404) {
        console.warn(`Failed to fetch models for make ${makeId}:`, err.message);
      }
      continue;
    }
  }
  return allModels;
};

export const createModelApi = async (model: ModelInput): Promise<Model> => {
  // Find the make name from make_id for the API
  const makesResponse = await axios.get(`${API_BASE}/vehicles/makes`, {
    headers: getAuthHeader(),
  });
  const makes = makesResponse.data;
  const make = makes.find((m: any) => (m.id || m.make_id) === model.make_id);

  const payload = {
    name: model.name,
    make: {
      name: make?.name || '',
    },
  };
  const response = await axios.post(`${API_BASE}/vehicles/model`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateModelApi = async (modelId: number, model: ModelInput): Promise<Model> => {
  // Find the make name from make_id for the API
  const makesResponse = await axios.get(`${API_BASE}/vehicles/makes`, {
    headers: getAuthHeader(),
  });
  const makes = makesResponse.data;
  const make = makes.find((m: any) => (m.id || m.make_id) === model.make_id);

  const payload = {
    name: model.name,
    make: {
      name: make?.name || '',
    },
  };
  const response = await axios.put(`${API_BASE}/vehicles/model/${modelId}`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteModelApi = async (modelId: number): Promise<void> => {
  await axios.delete(`${API_BASE}/vehicles/model/${modelId}`, {
    headers: getAuthHeader(),
  });
};

// Vehicle Spec APIs
export const getVehicleSpecsApi = async (): Promise<VehicleSpec[]> => {
  const response = await axios.get(`${API_BASE}/vehicles/filter`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createVehicleSpecApi = async (spec: VehicleSpecInput): Promise<VehicleSpec> => {
  const response = await axios.post(`${API_BASE}/vehicles/`, spec, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateVehicleSpecApi = async (
  vehicleId: number,
  spec: VehicleSpecInput,
): Promise<VehicleSpec> => {
  const response = await axios.put(`${API_BASE}/vehicles/${vehicleId}`, spec, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteVehicleSpecApi = async (vehicleId: number): Promise<void> => {
  await axios.delete(`${API_BASE}/vehicles/${vehicleId}`, {
    headers: getAuthHeader(),
  });
};
