export interface Ingredients {
  id: string;
  category_id: string;
  unit_id: string;
  name: string;
  stock_qty: number;
  min_stock: number;
  price_per_unit: number;
  purchase_price: number;
  average_price: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;
  category_name: string;
  unit_symbol: string;
  status: string;
}

export interface CreatedIngredientPayload {
  category_id: string;
  unit_id: string;
  name: string;
  min_stock: number;
  is_active: boolean;
}

export interface UpdateIngredientPayload extends CreatedIngredientPayload {
  id: string;
  purchase_price?: number;
  history_id?: string;
}


export interface StockInIngredientPayload {
  ingredient_id: string;
  quantity: number;
  purchase_price: number;
  notes?: string;
}

export interface StockInHistoryItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  purchase_price: number;
  notes?: string;
  created_at: string;
}