import { useDataQuery } from "@/hooks/useDataQuery";
import { unitService } from "@/service/unit.service";
import type { Unit } from "@/types/unit.type";
import { useQuery } from "@tanstack/react-query";

export function useUnitQuery() {
  return useDataQuery<Unit>({
    url: "/uoms",
    queryKey: "units",
    pageSize: 10,
  });
}

export function useGetUnitAll() {
  return useQuery({
    queryKey: ["unit-all"],
    queryFn: async () => {
      const res = await unitService.getAll();
      const rawData = res.data?.result ?? res.data?.data ?? res.data;

      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && typeof rawData === "object" && Array.isArray((rawData as any).data)) {
        return (rawData as any).data;
      }
      return [];
    },
  });
}
