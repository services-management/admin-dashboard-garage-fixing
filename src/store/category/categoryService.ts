import { apiClient } from '../auth/authService';

export const CategoryService = {
  // GET categories
  getCategories: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/category/', {
      params: { skip, limit },
    });
    return response.data;
  },

  // CREATE category
  createCategory: async (payload: { name: string; description: string }) => {
    const response = await apiClient.post('/category/', payload);
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
    const response = await apiClient.patch(`/category/${categoryID}`, payload);
    return response.data;
  },

  // DELETE category
  deleteCategory: async (categoryID: number) => {
    const response = await apiClient.delete(`/category/${categoryID}`);
    return response.data;
  },
};
