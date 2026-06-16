export interface Production {
  id: string;
  product_name: string;
  recipe_version: number;
  quantity_produced: number;
  quantity_success?: number;
  quantity_failed?: number;
  unit_symbol: string;
  production_date: string;
  expired_date: string;
  status: "SUCCESS" | "FAILED";
  notes: string | null;
}
