import { useDataQuery } from "@/hooks/useDataQuery";
import type { Ingredients, StockInHistoryItem } from "@/types/ingredients.type";
import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "@/service/ingredient.service";

export function useIngredientsQuery() {
  return useDataQuery<Ingredients>({
    url: "/ingredient",
    queryKey: "ingredients",
    pageSize: 10,
  });
}

export function useIngredientHistoryQuery(ingredientId: string | null, startDate?: string, endDate?: string) {
  return useQuery<StockInHistoryItem[]>({
    queryKey: ["ingredient-history", ingredientId, startDate, endDate],
    queryFn: async () => {
      const res = await ingredientService.getHistory(ingredientId!, startDate, endDate);
      const rawData = res.data?.result ?? res.data?.data ?? res.data;
      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && typeof rawData === "object" && Array.isArray((rawData as any).data)) {
        return (rawData as any).data;
      }
      return [];
    },
    enabled: !!ingredientId,
    staleTime: 30_000,
  });
}
