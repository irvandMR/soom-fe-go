import { ingredientService } from "@/service/ingredient.service";
import type { CreatedIngredientPayload, StockInIngredientPayload, UpdateIngredientPayload } from "@/types/ingredients.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseMutationOptions {
  onSuccess?: () => void;
}

export function useCreateIngredient({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatedIngredientPayload) =>
      ingredientService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success(`Bahan Baku "${variables.name}" berhasil ditambahkan!`);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal menambahkan unit", {
        description: "Silakan coba lagi",
      });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ingredientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Unit berhasil dihapus!");
    },
    onError: () => {
      toast.error("Gagal menghapus unit");
    },
  });
}

export function useStockInIngredient({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StockInIngredientPayload) =>
      ingredientService.stockIn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success(`Stock Bahan Baku "${res?.data.name}" berhasil ditambahkan!`);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal menambahkan stock bahan baku", {
        description: "Silakan coba lagi",
      });
    },
  });
}

export function useUpdateIngredient({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateIngredientPayload) =>
      ingredientService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["ingredient-history"] });
      toast.success("Data bahan baku berhasil diperbarui!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal memperbarui data", {
        description: "Silakan coba lagi",
      });
    },
  });
}
