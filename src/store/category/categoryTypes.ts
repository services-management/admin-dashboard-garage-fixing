export interface Category {
  categoryID: number;
  name: string;
  description: string;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
}

export interface UpdateCategoryPayload {
  categoryID: number;
  name: string;
  description: string;
}
