export interface CashFlow {
  id: string;
  transaction_date: string;
  type: "IN" | "OUT";
  category: string;
  description: string;
  amount: number;
  reference_type: string | null;
}

export interface MonthlyCashFlow {
  month: number;
  year: number;
  total_in: number;
  total_out: number;
  balance: number;
}

export interface ProfitLossSummary {
  revenue: number;
  cogs: number;
  gross_profit: number;
  gross_margin: number;
  operational_expenses: number;
  net_profit: number;
  net_margin: number;
}
