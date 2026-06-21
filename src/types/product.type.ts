export interface Product {
  id: string;
  code: string;
  name: string;
  type: 'MADE_TO_ORDER' | 'MADE_TO_STOCK' | 'RESELL';
  category_id: string;
  category_name: string;
  unit_id: string;
  unit_name: string;
  unit_symbol: string;
  default_price: number;
  stock_qty: number;
  estimated_cost: number;
  target_margin: number;
  active_recipe_version: number | null;
  is_active: boolean;
}
