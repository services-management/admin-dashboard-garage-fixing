import axios from 'axios';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ServiceService = {
  getServices: async (skip = 0, limit = 100) => {
    const response = await axios.get(`${API_BASE}/service/`, {
      params: { skip, limit },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  createService: async (payload: any) => {
    const response = await axios.post(`${API_BASE}/service/`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateService: async (id: number, payload: any) => {
    const response = await axios.put(`${API_BASE}/service/${id}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteService: async (id: number) => {
    const response = await axios.delete(`${API_BASE}/service/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
