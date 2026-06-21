import { useDataQuery } from "@/hooks/useDataQuery";
import type { Product } from "@/types/product.type";

export function useProductQuery() {
    return useDataQuery<Product>({
        url: "/product",
        queryKey: "product",
        pageSize: 10
    })
}