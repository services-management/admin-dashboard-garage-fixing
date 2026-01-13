import axios from 'axios';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CategoryService = {
  // GET categories
  getCategories: async (skip = 0, limit = 100) => {
    const response = await axios.get(`${API_BASE}/category/`, {
      params: { skip, limit },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // CREATE category
  createCategory: async (payload: { name: string; description: string }) => {
    const response = await axios.post(`${API_BASE}/category/`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // UPDATE category
  updateCategory: async (
    categoryID: number,
    payload: {
      name: string;
      description: string;
    },
  ) => {
    const response = await axios.put(`${API_BASE}/category/${categoryID}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // DELETE category
  deleteCategory: async (categoryID: number) => {
    const response = await axios.delete(`${API_BASE}/category/${categoryID}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
