export interface Category {
  name: string;
  description: string;
  categoryID: number;
}

export interface Inventory {
  current_stock: string;
  min_stock_level: string;
  last_restock_date: string | null;
}

export interface Product {
  product_id: number;
  name: string;
  selling_price: string;
  unit_cost: string;
  description: string;
  image_url: string;
  status: string;
  category_id: number;
  category: Category;
  inventory: Inventory;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
