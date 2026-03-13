import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryService } from './categoryService';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from './categoryTypes';

// GET
export const fetchCategories = createAsyncThunk<Category[]>(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategories();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// CREATE
export const createCategory = createAsyncThunk<Category, CreateCategoryPayload>(
  'category/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CategoryService.createCategory(payload);
      return response.data || response;
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
      const response = await CategoryService.updateCategory(categoryID, data);
      return response.data || response;
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
