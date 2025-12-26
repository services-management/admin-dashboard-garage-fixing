import axios from 'axios';

// Use the Vite proxy base in development to avoid CORS, otherwise use the configured env var
const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE as string);

if (import.meta.env.DEV) {
  // helpful debug during development
  // this will print in the browser console so you can verify the request base
  console.debug('[authService] API_BASE (dev):', API_BASE);
}

export const adminLoginApi = async (identifier: string, password: string) => {
  // support login by username or email
  const payload = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };

  const response = await axios.post(`${API_BASE}/admin/login`, payload);

  // Normalize response to include `access_token` which `authSlice` expects
  const data = response.data;
  const token = data?.access_token || data?.token || data?.Token || null;

  if (token) {
    return {
      ...data,
      access_token: token,
    };
  }

  // fallback: return original data if no recognizable token field found
  return data;
};
