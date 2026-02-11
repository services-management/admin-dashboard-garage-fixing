import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ComboService } from './packageTypes';
import {
  fetchComboServices,
  fetchComboServiceById,
  createComboService,
  updateComboService,
  deleteComboService,
  fetchAvailableComboServices,
  uploadComboServiceImage,
  updateComboServiceImage,
} from './packageThunk';

interface PackageState {
  list: ComboService[];
  available: ComboService[];
  currentCombo: ComboService | null;
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  list: [],
  available: [],
  currentCombo: null,
  loading: false,
  error: null,
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCombo: (state, action: PayloadAction<ComboService | null>) => {
      state.currentCombo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all combo services
      .addCase(fetchComboServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComboServices.fulfilled, (state, action: PayloadAction<ComboService[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchComboServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch combo service by ID
      .addCase(fetchComboServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComboServiceById.fulfilled, (state, action: PayloadAction<ComboService>) => {
        state.loading = false;
        state.currentCombo = action.payload;
      })
      .addCase(fetchComboServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create combo service
      .addCase(createComboService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComboService.fulfilled, (state, action: PayloadAction<ComboService>) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createComboService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update combo service
      .addCase(updateComboService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComboService.fulfilled, (state, action: PayloadAction<ComboService>) => {
        state.loading = false;
        const index = state.list.findIndex(
          (c) => c.combo_service_id === action.payload.combo_service_id,
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentCombo?.combo_service_id === action.payload.combo_service_id) {
          state.currentCombo = action.payload;
        }
      })
      .addCase(updateComboService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete combo service
      .addCase(deleteComboService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComboService.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.list = state.list.filter((c) => c.combo_service_id !== action.payload);
      })
      .addCase(deleteComboService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch available combo services
      .addCase(fetchAvailableComboServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailableComboServices.fulfilled,
        (state, action: PayloadAction<ComboService[]>) => {
          state.loading = false;
          state.available = action.payload;
        },
      )
      .addCase(fetchAvailableComboServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Upload combo service image
      .addCase(uploadComboServiceImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadComboServiceImage.fulfilled, (state, action: PayloadAction<ComboService>) => {
        state.loading = false;
        const index = state.list.findIndex(
          (c) => c.combo_service_id === action.payload.combo_service_id,
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentCombo?.combo_service_id === action.payload.combo_service_id) {
          state.currentCombo = action.payload;
        }
      })
      .addCase(uploadComboServiceImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update combo service image
      .addCase(updateComboServiceImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComboServiceImage.fulfilled, (state, action: PayloadAction<ComboService>) => {
        state.loading = false;
        const index = state.list.findIndex(
          (c) => c.combo_service_id === action.payload.combo_service_id,
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentCombo?.combo_service_id === action.payload.combo_service_id) {
          state.currentCombo = action.payload;
        }
      })
      .addCase(updateComboServiceImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentCombo } = packageSlice.actions;
export default packageSlice.reducer;
