export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}
