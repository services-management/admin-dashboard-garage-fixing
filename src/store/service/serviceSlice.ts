import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Service } from './serviceTypes';
import { fetchServices, createService, updateService, deleteService } from './serviceThunk';

interface ServiceState {
  list: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  list: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createService.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.service_id === action.payload.service_id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.service_id !== action.payload);
      });
  },
});

export default serviceSlice.reducer;
