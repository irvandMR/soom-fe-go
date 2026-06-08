export interface Categories {
  Id: string;
  Name: string;
  Code: string;
  Type: string;
  IsActive: boolean;
  CreatedAt: string;
}
export interface CreateCategoriesPayload {
  code: string;
  name: string;
  type: string;
  is_active: boolean;
}

export interface UpdateCategoriesPaylaod extends CreateCategoriesPayload {
  id: string;
}
