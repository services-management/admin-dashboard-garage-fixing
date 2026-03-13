export interface ServiceAssociation {
  category_id?: number;
  category_name: string;
  product_name?: string;
  quantity_required?: number;
  is_optional?: boolean;
}

export interface Service {
  service_id: number;
  name: string;
  description: string;
  image_url: string;
  garage_price: string;
  home_price: string;
  duration_minutes: number;
  is_available: boolean;
  status: string;
  associations: ServiceAssociation[];
}
