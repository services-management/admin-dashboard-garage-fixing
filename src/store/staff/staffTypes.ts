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
  telegram_chat_id?: string;
}

export interface TechnicalInput {
  username: string;
  password: string;
  name: string;
  phone_number: string;
  telegram_chat_id?: string;
}

export interface TechnicalTeam {
  team_id: string;
  team_name: string;
  description?: string;
  team_lead_id?: string;
  is_active: boolean;
  created_at: string;
  members: string[];
}

export interface CreateTeamInput {
  team_name: string;
  description?: string;
  team_lead_id?: string;
}

export interface StaffState {
  admins: Admin[];
  technicals: Technical[];
  teams: TechnicalTeam[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
