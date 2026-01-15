import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryService } from './categoryService';
import type { Category } from './categoryTypes';

// GET
export const fetchCategories = createAsyncThunk<Category[]>(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await CategoryService.getCategories();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// // CREATE
// export const createCategory = createAsyncThunk<
//   Category,
//   CreateCategoryPayload
// >("category/create", async (payload, { rejectWithValue }) => {
//   try {
//     return await CategoryService.createCategory(payload);
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// // UPDATE
// export const updateCategory = createAsyncThunk<
//   Category,
//   UpdateCategoryPayload
// >("category/update", async (payload, { rejectWithValue }) => {
//   try {
//     return await CategoryService.updateCategory(payload);
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// // DELETE
// export const deleteCategory = createAsyncThunk<number, number>(
//   "category/delete",
//   async (categoryID, { rejectWithValue }) => {
//     try {
//       return await CategoryService.deleteCategory(categoryID);
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
