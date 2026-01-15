import axios from 'axios';

// IMPORTANT: same pattern as authService
const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ProductService = {
  getProducts: async (skip = 0, limit = 100) => {
    const response = await axios.get(`${API_BASE}/product/`, {
      params: { skip, limit },
    });
    return response.data;
  },

  createProduct: async (payload: any) =>
    axios.post(`${API_BASE}/product`, payload, {
      headers: getAuthHeader(),
    }),

  updateProduct: async (id: number, payload: any) =>
    axios.put(`${API_BASE}/product/${id}`, payload, {
      headers: getAuthHeader(),
    }),

  deleteProduct: async (id: number) =>
    axios.delete(`${API_BASE}/product/${id}`, {
      headers: getAuthHeader(),
    }),
};
