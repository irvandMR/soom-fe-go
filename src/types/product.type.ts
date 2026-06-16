export interface Product {
  id: string;
  name: string;
  type: 'MADE_TO_ORDER' | 'MADE_TO_STOCK' | 'RESELL';
  category_name: string;
  unit_name: string;
  unit_symbol: string;
  stock_qty: number;
  estimated_cost: number;
  active_recipe_version: number | null;
  is_active: boolean;
}
