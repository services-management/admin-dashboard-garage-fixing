import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VehicleState, Make, Model, VehicleSpec } from './vehicleTypes';
import {
  fetchMakes,
  createMake,
  updateMake,
  deleteMake,
  fetchModels,
  createModel,
  updateModel,
  deleteModel,
  fetchVehicleSpecs,
  createVehicleSpec,
  updateVehicleSpec,
  deleteVehicleSpec,
} from './vehicleThunk';

const initialState: VehicleState = {
  makes: [],
  models: [],
  vehicleSpecs: [],
  loading: false,
  error: null,
  successMessage: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Makes
      .addCase(fetchMakes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMakes.fulfilled, (state, action: PayloadAction<Make[]>) => {
        state.loading = false;
        state.makes = action.payload;
      })
      .addCase(fetchMakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Make
      .addCase(createMake.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMake.fulfilled, (state, action: PayloadAction<Make>) => {
        state.loading = false;
        state.makes.push(action.payload);
        state.successMessage = 'Make created successfully';
      })
      .addCase(createMake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Make
      .addCase(updateMake.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMake.fulfilled, (state, action: PayloadAction<Make>) => {
        state.loading = false;
        const index = state.makes.findIndex((m) => m.make_id === action.payload.make_id);
        if (index !== -1) {
          state.makes[index] = action.payload;
        }
        state.successMessage = 'Make updated successfully';
      })
      .addCase(updateMake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Make
      .addCase(deleteMake.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMake.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.makes = state.makes.filter((m) => m.make_id !== action.payload);
        state.successMessage = 'Make deleted successfully';
      })
      .addCase(deleteMake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Models
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action: PayloadAction<Model[]>) => {
        state.loading = false;
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Model
      .addCase(createModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        state.models.push(action.payload);
        state.successMessage = 'Model created successfully';
      })
      .addCase(createModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Model
      .addCase(updateModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        const index = state.models.findIndex((m) => m.model_id === action.payload.model_id);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
        state.successMessage = 'Model updated successfully';
      })
      .addCase(updateModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Model
      .addCase(deleteModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteModel.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.models = state.models.filter((m) => m.model_id !== action.payload);
        state.successMessage = 'Model deleted successfully';
      })
      .addCase(deleteModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Vehicle Specs
      .addCase(fetchVehicleSpecs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleSpecs.fulfilled, (state, action: PayloadAction<VehicleSpec[]>) => {
        state.loading = false;
        state.vehicleSpecs = action.payload;
      })
      .addCase(fetchVehicleSpecs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Vehicle Spec
      .addCase(createVehicleSpec.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicleSpec.fulfilled, (state, action: PayloadAction<VehicleSpec>) => {
        state.loading = false;
        state.vehicleSpecs.push(action.payload);
        state.successMessage = 'Vehicle specification created successfully';
      })
      .addCase(createVehicleSpec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Vehicle Spec
      .addCase(updateVehicleSpec.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicleSpec.fulfilled, (state, action: PayloadAction<VehicleSpec>) => {
        state.loading = false;
        const index = state.vehicleSpecs.findIndex(
          (v) => v.vehicle_id === action.payload.vehicle_id,
        );
        if (index !== -1) {
          state.vehicleSpecs[index] = action.payload;
        }
        state.successMessage = 'Vehicle specification updated successfully';
      })
      .addCase(updateVehicleSpec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Vehicle Spec
      .addCase(deleteVehicleSpec.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicleSpec.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.vehicleSpecs = state.vehicleSpecs.filter((v) => v.vehicle_id !== action.payload);
        state.successMessage = 'Vehicle specification deleted successfully';
      })
      .addCase(deleteVehicleSpec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage } = vehicleSlice.actions;
export default vehicleSlice.reducer;
