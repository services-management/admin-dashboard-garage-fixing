import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from './productService';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await ProductService.getProducts(0, 100);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  },
);
