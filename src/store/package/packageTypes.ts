export interface ServiceInCombo {
  name: string;
  description: string;
  image_url: string;
  price: number | string; // Price can be number or string from API
  duration_minutes: number;
  is_available: boolean;
  service_id: number;
  associations: Array<{
    product_name: string;
    quantity_required: number;
    is_optional: boolean;
    product_id: number;
  }>;
}

export interface ComboService {
  combo_service_id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  image_url?: string;
  service_names: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
  total_price?: string;
  total_duration_minutes?: number;
  services?: ServiceInCombo[];
}

export interface CreateComboServicePayload {
  name: string;
  description: string;
  price: number;
  service_names: string[];
}

export interface UpdateComboServicePayload {
  name?: string;
  description?: string;
  price?: number;
  service_names?: string[];
}

export interface UploadComboImagePayload {
  file: File;
}


