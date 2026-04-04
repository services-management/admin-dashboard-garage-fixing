import type {
  Admin,
  AdminInput,
  Technical,
  TechnicalInput,
  TechnicalTeam,
  CreateTeamInput,
} from './staffTypes';
import { authAxios } from '../auth/authService';

const API_BASE = import.meta.env.VITE_API_HOST as string;

export const getAdminsApi = async (skip = 0, limit = 100): Promise<Admin[]> => {
  const response = await authAxios.get(`${API_BASE}/admin/accounts/admins`, {
    params: { skip, limit },
  });
  return response.data;
};

export const getTechnicalsApi = async (skip = 0, limit = 100): Promise<Technical[]> => {
  const response = await authAxios.get(`${API_BASE}/admin/accounts/technicals`, {
    params: { skip, limit },
  });
  return response.data;
};

export const createAdminApi = async (admin: AdminInput): Promise<Admin> => {
  const response = await authAxios.post(`${API_BASE}/admin/`, {
    ...admin,
    telegram_chat_id: admin.telegram_chat_id || '',
  });
  return response.data;
};

export const createTechnicalApi = async (
  technical: TechnicalInput,
): Promise<Technical & { telegram_magic_link?: string }> => {
  const payload = {
    ...technical,
    telegram_chat_id: technical.telegram_chat_id || '',
  };
  console.log('Creating technical with payload:', payload);
  const response = await authAxios.post(`${API_BASE}/admin/technical`, payload);
  console.log('Create technical response:', response.data);
  return response.data;
};

export const getTechnicalTeamsApi = async (skip = 0, limit = 100): Promise<TechnicalTeam[]> => {
  const response = await authAxios.get(`${API_BASE}/admin/teams`, {
    params: { skip, limit },
  });
  return response.data;
};

export const createTeamApi = async (team: CreateTeamInput): Promise<TechnicalTeam> => {
  const response = await authAxios.post(`${API_BASE}/admin/teams`, team);
  return response.data;
};

export const addMemberToTeamApi = async (teamId: string, technicalId: string): Promise<void> => {
  await authAxios.post(`${API_BASE}/admin/teams/${teamId}/members/${technicalId}`, null);
};

export const removeMemberFromTeamApi = async (technicalId: string): Promise<void> => {
  await authAxios.delete(`${API_BASE}/admin/teams/members/${technicalId}`);
};

export const getAdminMagicLinkApi = async (adminId: string): Promise<string> => {
  const response = await authAxios.get(`${API_BASE}/admin/accounts/admins/${adminId}/magic-link`);
  return response.data.telegram_magic_link || response.data;
};

export const getTechnicalMagicLinkApi = async (technicalId: string): Promise<string> => {
  const response = await authAxios.get(
    `${API_BASE}/admin/accounts/technicals/${technicalId}/magic-link`,
  );
  return response.data.telegram_magic_link || response.data;
};

export const updateCurrentAdminApi = async (payload: {
  username?: string;
  password?: string;
  email_phone?: string;
  telegram_chat_id?: string;
  is_active?: boolean;
}) => {
  const response = await authAxios.put(`${API_BASE}/admin/me`, payload);
  return response.data;
};
