export interface Unit {
  id: string;
  name: string;
  code: string;
  symbol: string;
  have_conversion: boolean;
  base_unit: string;
  conversion_factor: number;
}
