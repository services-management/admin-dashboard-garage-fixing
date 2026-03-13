import { createSlice } from '@reduxjs/toolkit';
import type { StaffState } from './staffTypes';
import { createAdmin, createTechnical, fetchAdmins, fetchTechnicals } from './staffThunk';

const initialState: StaffState = {
  admins: [],
  technicals: [],
  loading: false,
  error: null,
  successMessage: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaffError: (state) => {
      state.error = null;
    },
    clearStaffSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTechnicals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechnicals.fulfilled, (state, action) => {
        state.loading = false;
        state.technicals = action.payload;
      })
      .addCase(fetchTechnicals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.push(action.payload);
        state.successMessage = 'អ្នកគ្រប់គ្រងបានបង្កើតដោយជោគជ័យ';
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTechnical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTechnical.fulfilled, (state, action) => {
        state.loading = false;
        state.technicals.push(action.payload);
        state.successMessage = 'បុគ្គលិកបានបង្កើតដោយជោគជ័យ';
      })
      .addCase(createTechnical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStaffError, clearStaffSuccessMessage } = staffSlice.actions;
export default staffSlice.reducer;
