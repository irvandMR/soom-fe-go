import { useDataQuery } from "@/hooks/useDataQuery";
import type { Categories } from "@/types/categories.type";

export function useCategoriesQuery() {
  return useDataQuery<Categories>({
    url: "/categories",
    queryKey: "categories",
    pageSize: 10,
  });
}
