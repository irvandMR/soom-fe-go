import api from "@/lib/axios";
import type {
  CreateCategoriesPayload,
  UpdateCategoriesPaylaod,
} from "@/types/categories.type";

export const categoriesService = {
  getById: (id: string) => {
    return api.get(`/categories/${id}`);
  },

  create: (data: CreateCategoriesPayload) => {
    return api.post("/categories", data);
  },

  update: (data: UpdateCategoriesPaylaod) => {
    return api.post("/categories/update", data);
  },

  delete: (id: string) => {
    return api.delete(`/categories/${id}`);
  },

  getType: () => {
    return api.get("/categories/types");
  },
};
