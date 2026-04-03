import { apiClient } from '../auth/authService';

export const ProductService = {
  getProducts: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/product/', {
      params: { skip, limit },
    });
    return response.data;
  },

  getAllProducts: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/product/all', {
      params: { skip, limit },
    });
    return response.data;
  },

  createProduct: async (payload: any) => apiClient.post('/product/', payload),

  updateProduct: async (id: number, payload: any) => apiClient.put(`/product/${id}`, payload),

  uploadProductImage: async (productId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.put(`/product/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout for image upload
    });

    return response.data;
  },

  deleteProduct: async (id: number) => apiClient.delete(`/product/${id}`),

  linkProductToVehicle: async (
    productId: number,
    vehicleId: number,
    quantityRequired?: string,
    unit?: string,
    note?: string,
  ) => {
    const response = await apiClient.post(`/product/${productId}/vehicle/${vehicleId}`, null, {
      params: { quantity_required: quantityRequired, unit, note },
    });
    return response.data;
  },

  updateProductVehicleLink: async (
    productId: number,
    vehicleId: number,
    quantityRequired?: string,
    unit?: string,
    note?: string,
  ) => {
    const response = await apiClient.patch(`/product/${productId}/vehicle/${vehicleId}`, null, {
      params: { quantity_required: quantityRequired, unit, note },
    });
    return response.data;
  },

  unlinkProductFromVehicle: async (productId: number, vehicleId: number) => {
    const response = await apiClient.delete(`/product/${productId}/vehicle/${vehicleId}`);
    return response.data;
  },

  getVehiclesByProduct: async (productId: number) => {
    const response = await apiClient.get(`/product/${productId}/vehicles`);
    return response.data;
  },

  getProductsByVehicle: async (vehicleId: number) => {
    const response = await apiClient.get(`/vehicles/${vehicleId}/products`);
    return response.data;
  },
};
