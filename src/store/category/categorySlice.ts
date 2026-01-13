import { createSlice } from '@reduxjs/toolkit';
import type { Category } from './categoryTypes';
import { fetchCategories } from './categoryThunk';

interface CategoryState {
  list: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  list: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //   // CREATE
    //   .addCase(createCategory.fulfilled, (state, action) => {
    //     state.list.push(action.payload);
    //   })

    //   // UPDATE
    //   .addCase(updateCategory.fulfilled, (state, action) => {
    //     const index = state.list.findIndex(
    //       (c) => c.categoryID === action.payload.categoryID
    //     );
    //     if (index !== -1) {
    //       state.list[index] = action.payload;
    //     }
    //   })

    //   // DELETE
    //   .addCase(deleteCategory.fulfilled, (state, action) => {
    //     state.list = state.list.filter(
    //       (c) => c.categoryID !== action.payload
    //     );
    //   });
  },
});

export default categorySlice.reducer;
