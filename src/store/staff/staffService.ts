import axios from 'axios';
import type { Admin, AdminInput, Technical, TechnicalInput } from './staffTypes';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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
