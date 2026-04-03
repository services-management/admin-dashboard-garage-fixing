import { createSlice } from '@reduxjs/toolkit';
import type { StaffState } from './staffTypes';
import {
  createAdmin,
  createTechnical,
  fetchAdmins,
  fetchTechnicals,
  fetchTeams,
  createTeam,
  addMemberToTeam,
  removeMemberFromTeam,
} from './staffThunk';

const initialState: StaffState = {
  admins: [],
  technicals: [],
  teams: [],
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
      })
      // Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
        state.successMessage = 'ក្រុមបច្ចេកទេសបានបង្កើតដោយជោគជ័យ';
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMemberToTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToTeam.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'បានបន្ថែមសមាជិកចូលក្រុមដោយជោគជ័យ';
      })
      .addCase(addMemberToTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeMemberFromTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMemberFromTeam.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'បានដកសមាជិកចេញពីក្រុមដោយជោគជ័យ';
      })
      .addCase(removeMemberFromTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStaffError, clearStaffSuccessMessage } = staffSlice.actions;
export default staffSlice.reducer;
