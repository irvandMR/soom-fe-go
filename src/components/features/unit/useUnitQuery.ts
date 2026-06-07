import { useDataQuery } from "@/hooks/useDataQuery";

export interface Unit {
  Id: string;
  Name: string;
  Code: string;
  Symbol: string;
  HaveConversion: boolean;
  BaseUnit: string;
  ConversionFactor: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export function useUnitQuery() {
  return useDataQuery<Unit>({
    url: "/uoms",
    queryKey: "units",
    pageSize: 10,
  });
}
