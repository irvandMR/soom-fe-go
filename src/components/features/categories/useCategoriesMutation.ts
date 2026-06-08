import { categoriesService } from "@/service/categories.service";
import type {
  Categories,
  CreateCategoriesPayload,
  UpdateCategoriesPaylaod,
} from "@/types/categories.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseMutationOptions {
  onSuccess?: () => void;
}

export function useCreateCategories({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoriesPayload) =>
      categoriesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Kategori "${variables.name}" berhasil ditambahkan!`);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal menambahkan kategori", {
        description: "Silakan coba lagi",
      });
    },
  });
}

export function useUpdateCategories({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoriesPaylaod) =>
      categoriesService.update({ ...data }),
    onSuccess: (_, variables) => {
      console.log("var", variables);

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Kategori "${variables.name}" berhasil diperbarui!`);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal memperbarui kategori", {
        description: "Silakan coba lagi",
      });
    },
  });
}

export function useDeleteCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dihapus!");
    },
    onError: () => {
      toast.error("Gagal menghapus kategori");
    },
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
