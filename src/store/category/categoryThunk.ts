import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryService } from './categoryService';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from './categoryTypes';

// GET
export const fetchCategories = createAsyncThunk<Category[]>(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CategoryService.getCategories();
      console.log('Categories API response:', data);
      // Handle both array response and nested data response
      const categories = Array.isArray(data) ? data : data.data || [];
      console.log('Parsed categories:', categories);
      return categories;
    } catch (error: any) {
      console.error('Categories API error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// CREATE
export const createCategory = createAsyncThunk<Category, CreateCategoryPayload>(
  'category/create',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await CategoryService.createCategory(payload);
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// UPDATE
export const updateCategory = createAsyncThunk<Category, UpdateCategoryPayload>(
  'category/update',
  async (payload, { rejectWithValue }) => {
    try {
      const { categoryID, ...data } = payload;
      const result = await CategoryService.updateCategory(categoryID, data);
      return result.data || result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// DELETE
export const deleteCategory = createAsyncThunk<number, number>(
  'category/delete',
  async (categoryID, { rejectWithValue }) => {
    try {
      await CategoryService.deleteCategory(categoryID);
      return categoryID;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
