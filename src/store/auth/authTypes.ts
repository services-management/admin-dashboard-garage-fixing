export interface AdminUser {
  id: number;
  username: string;
  email?: string;
  email_phone?: string;
  is_active: boolean;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}
