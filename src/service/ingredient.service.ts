import api from "@/lib/axios";
import type { CreatedIngredientPayload, StockInIngredientPayload, UpdateIngredientPayload } from "@/types/ingredients.type";

export const ingredientService = {
  create: (data: CreatedIngredientPayload) => {
    return api.post("/ingredient", data);
  },
  delete: (id: string) => {
    return api.delete(`/ingredient/${id}`);
  },

  stockIn: (data: StockInIngredientPayload) => {
    return api.post("/ingredient/stock-in", data);
  },

  getHistory: (id: string, startDate?: string, endDate?: string) => {
    return api.get(`/ingredient/history/${id}`, {
      params: { start_date: startDate, end_date: endDate },
    });
  },

  update: (data: UpdateIngredientPayload) => {
    return api.post("/ingredient/update", data);
  },
};
