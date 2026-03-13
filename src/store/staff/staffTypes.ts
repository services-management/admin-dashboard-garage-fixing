export interface Admin {
  admin_id: string;
  username: string;
  email_phone: string;
  role: 'admin';
  is_active: boolean;
  telegram_magic_link?: string;
}

export interface Technical {
  technical_id: string;
  username: string;
  name: string;
  phone_number: string;
  role: 'technical';
  status: 'free' | 'busy' | 'off_duty';
  team_id?: string;
  is_active: boolean;
  telegram_magic_link?: string;
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
