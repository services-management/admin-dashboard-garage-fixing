export interface ServiceAssociation {
  product_name: string;
  quantity_required: number;
  is_optional: boolean;
}

export interface Service {
  service_id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  duration_minutes: number;
  is_available: boolean;
  associations: ServiceAssociation[];
}
