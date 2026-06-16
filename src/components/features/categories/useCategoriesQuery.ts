import { useDataQuery } from "@/hooks/useDataQuery";
import { categoriesService } from "@/service/categories.service";
import type { Categories } from "@/types/categories.type";
import { useQuery } from "@tanstack/react-query";

export function useCategoriesQuery() {
  return useDataQuery<Categories>({
    url: "/categories",
    queryKey: "categories",
    pageSize: 10,
  });
}

export function useGetCategoriesType() {
  return useQuery({
    queryKey: ["categories-type"],
    queryFn: async () => {
      const res = await categoriesService.getType();

      return res.data.result;
    },
  });
}

export function useGetCategoryAll() {
  return useQuery({
    queryKey: ["categories-all"],
    queryFn: async () => {
      const res = await categoriesService.getAll();
      return res.data.result;
    },
  });
}
