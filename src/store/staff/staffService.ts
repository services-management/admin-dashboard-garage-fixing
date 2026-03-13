import axios from 'axios';
import type { Admin, AdminInput, Technical, TechnicalInput } from './staffTypes';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminsApi = async (skip = 0, limit = 100): Promise<Admin[]> => {
  const response = await axios.get(`${API_BASE}/admin/accounts/admins`, {
    params: { skip, limit },
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getTechnicalsApi = async (skip = 0, limit = 100): Promise<Technical[]> => {
  const response = await axios.get(`${API_BASE}/admin/accounts/technicals`, {
    params: { skip, limit },
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createAdminApi = async (admin: AdminInput): Promise<Admin> => {
  const response = await axios.post(`${API_BASE}/admin/`, admin, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createTechnicalApi = async (technical: TechnicalInput): Promise<Technical> => {
  const response = await axios.post(`${API_BASE}/admin/technical`, technical, {
    headers: getAuthHeader(),
  });
  return response.data;
};
