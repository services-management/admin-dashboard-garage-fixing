import { apiClient } from '../auth/authService';
import type {
  Make,
  MakeInput,
  Model,
  ModelInput,
  VehicleSpec,
  VehicleSpecInput,
} from './vehicleTypes';

// Make APIs
export const getMakesApi = async (): Promise<Make[]> => {
  const response = await apiClient.get('/vehicles/makes');
  return response.data;
};

export const createMakeApi = async (make: MakeInput): Promise<Make> => {
  const response = await apiClient.post('/vehicles/make', make);
  return response.data;
};

export const updateMakeApi = async (makeId: number, make: MakeInput): Promise<Make> => {
  const response = await apiClient.patch(`/vehicles/make/${makeId}`, make);
  return response.data;
};

export const deleteMakeApi = async (makeId: number): Promise<void> => {
  await apiClient.delete(`/vehicles/make/${makeId}`);
};

// Model APIs
export const getModelsApi = async (makeId?: number): Promise<Model[]> => {
  try {
    if (makeId) {
      // Get models for a specific make
      const response = await apiClient.get(`/vehicles/makes/${makeId}/models`);
      return response.data || [];
    } else {
      // Get all models by fetching from all makes
      const makesResponse = await apiClient.get('/vehicles/makes');
      const makes = makesResponse.data || [];

      // Fetch models for each make
      const allModels: Model[] = [];
      for (const make of makes) {
        try {
          const makeId = make.id || make.make_id;
          const modelsResponse = await apiClient.get(`/vehicles/makes/${makeId}/models`);
          const models = modelsResponse.data || [];
          allModels.push(...models);
        } catch (err) {
          console.error(`Failed to fetch models for make ${make.name}:`, err);
        }
      }
      return allModels;
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

export const createModelApi = async (model: ModelInput): Promise<Model> => {
  // Find the make name from make_id for the API
  const makesResponse = await apiClient.get('/vehicles/makes');
  const makes = makesResponse.data;
  const make = makes.find((m: any) => (m.id || m.make_id) === model.make_id);

  const payload = {
    name: model.name,
    make: {
      name: make?.name || '',
    },
  };
  const response = await apiClient.post('/vehicles/model', payload);
  return response.data;
};

export const updateModelApi = async (modelId: number, model: ModelInput): Promise<Model> => {
  // Find the make name from make_id for the API
  const makesResponse = await apiClient.get('/vehicles/makes');
  const makes = makesResponse.data;
  const make = makes.find((m: any) => (m.id || m.make_id) === model.make_id);

  const payload = {
    name: model.name,
    make: {
      name: make?.name || '',
    },
  };
  const response = await apiClient.put(`/vehicles/model/${modelId}`, payload);
  return response.data;
};

export const deleteModelApi = async (modelId: number): Promise<void> => {
  await apiClient.delete(`/vehicles/model/${modelId}`);
};

// Vehicle Spec APIs
export const getVehicleSpecsApi = async (): Promise<VehicleSpec[]> => {
  const response = await apiClient.get('/vehicles/all');
  return response.data;
};

export const createVehicleSpecApi = async (spec: VehicleSpecInput): Promise<VehicleSpec> => {
  const response = await apiClient.post('/vehicles/', spec);
  return response.data;
};

export const updateVehicleSpecApi = async (
  vehicleId: number,
  spec: VehicleSpecInput,
): Promise<VehicleSpec> => {
  const response = await apiClient.put(`/vehicles/${vehicleId}`, spec);
  return response.data;
};

export const deleteVehicleSpecApi = async (vehicleId: number): Promise<void> => {
  await apiClient.delete(`/vehicles/${vehicleId}`);
};

// Upload Vehicle Image
export const uploadVehicleImageApi = async (
  vehicleId: number,
  file: File,
): Promise<VehicleSpec> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(`/vehicles/${vehicleId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
