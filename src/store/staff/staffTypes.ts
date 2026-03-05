export interface Admin {
  id: number;
  username: string;
  email_phone: string;
  role: 'admin';
}

export interface Technical {
  id: number;
  username: string;
  name: string;
  phone_number: string;
  role: 'technical';
}

export interface AdminInput {
  username: string;
  password: string;
  email_phone: string;
}

export interface TechnicalInput {
  username: string;
  password: string;
  name: string;
  phone_number: string;
}

export interface StaffState {
  admins: Admin[];
  technicals: Technical[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
