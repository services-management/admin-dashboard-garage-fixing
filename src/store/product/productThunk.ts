import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from './productService';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductService.getProducts(0, 100);
      return response.data || response.items || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  },
);
