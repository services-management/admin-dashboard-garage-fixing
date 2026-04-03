import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Admin,
  AdminInput,
  Technical,
  TechnicalInput,
  TechnicalTeam,
  CreateTeamInput,
} from './staffTypes';
import {
  createAdminApi,
  createTechnicalApi,
  getAdminsApi,
  getTechnicalsApi,
  getTechnicalTeamsApi,
  createTeamApi,
  addMemberToTeamApi,
  removeMemberFromTeamApi,
  getAdminMagicLinkApi,
  getTechnicalMagicLinkApi,
  updateCurrentAdminApi,
} from './staffService';

export const fetchAdmins = createAsyncThunk<Admin[]>(
  'staff/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch admins');
    }
  },
);

export const fetchTechnicals = createAsyncThunk<Technical[]>(
  'staff/fetchTechnicals',
  async (_, { rejectWithValue }) => {
    try {
      return await getTechnicalsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch technicals');
    }
  },
);

export const createAdmin = createAsyncThunk<Admin & { telegram_magic_link?: string }, AdminInput>(
  'staff/createAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      return await createAdminApi(payload);
    } catch (err: any) {
      if (err.response?.status === 409) {
        return rejectWithValue('ឈ្មោះគណនីនេះត្រូវបានប្រើរួចហើយ (Username already exists)');
      }
      return rejectWithValue(err.response?.data?.detail || 'Failed to create admin');
    }
  },
);

export const createTechnical = createAsyncThunk<
  Technical & { telegram_magic_link?: string },
  TechnicalInput
>('staff/createTechnical', async (payload, { rejectWithValue }) => {
  try {
    return await createTechnicalApi(payload);
  } catch (err: any) {
    console.error('Create technical error full:', err);
    console.error('Create technical error response:', err.response);
    console.error('Create technical error data:', err.response?.data);
    const status = err.response?.status;
    const detail = err.response?.data?.detail;

    // Check for duplicate username (409) or any error containing "exists" or "duplicate"
    if (
      status === 409 ||
      detail?.toLowerCase().includes('exists') ||
      detail?.toLowerCase().includes('duplicate')
    ) {
      return rejectWithValue('ឈ្មោះគណនីនេះត្រូវបានប្រើរួចហើយ (Username already exists)');
    }

    const errorMessage = detail || err.message || 'Failed to create technical staff';
    return rejectWithValue(errorMessage);
  }
});

export const fetchTeams = createAsyncThunk<TechnicalTeam[]>(
  'staff/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      return await getTechnicalTeamsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch teams');
    }
  },
);

export const createTeam = createAsyncThunk<TechnicalTeam, CreateTeamInput>(
  'staff/createTeam',
  async (payload, { rejectWithValue }) => {
    try {
      return await createTeamApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create team');
    }
  },
);

export const addMemberToTeam = createAsyncThunk<void, { teamId: string; technicalId: string }>(
  'staff/addMemberToTeam',
  async ({ teamId, technicalId }, { rejectWithValue }) => {
    try {
      await addMemberToTeamApi(teamId, technicalId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to add member to team');
    }
  },
);

export const removeMemberFromTeam = createAsyncThunk<void, string>(
  'staff/removeMemberFromTeam',
  async (technicalId, { rejectWithValue }) => {
    try {
      await removeMemberFromTeamApi(technicalId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to remove member from team');
    }
  },
);

export const getAdminMagicLink = createAsyncThunk<string, string>(
  'staff/getAdminMagicLink',
  async (adminId, { rejectWithValue }) => {
    try {
      return await getAdminMagicLinkApi(adminId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to get magic link');
    }
  },
);

export const getTechnicalMagicLink = createAsyncThunk<string, string>(
  'staff/getTechnicalMagicLink',
  async (technicalId, { rejectWithValue }) => {
    try {
      return await getTechnicalMagicLinkApi(technicalId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to get magic link');
    }
  },
);

export const updateCurrentAdmin = createAsyncThunk<
  Admin,
  {
    username?: string;
    password?: string;
    email_phone?: string;
    telegram_chat_id?: string;
    is_active?: boolean;
  }
>('staff/updateCurrentAdmin', async (payload, { rejectWithValue }) => {
  try {
    return await updateCurrentAdminApi(payload);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to update profile');
  }
});
