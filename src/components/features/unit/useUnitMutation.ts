// src/components/features/unit/useUnitMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  unitService,
  type CreateUnitPayload,
  type UpdateUnitPayload,
} from "@/service/unit.service";
import { toast } from "sonner";

interface UseMutationOptions {
  onSuccess?: () => void;
}

// ── Create ─────────────────────────────────────────────────────────────────
export function useCreateUnit({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnitPayload) => unitService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success("Unit berhasil ditambahkan!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal menambahkan unit", {
        description: "Silakan coba lagi",
      });
    },
  });
}

// ── Update ─────────────────────────────────────────────────────────────────
export function useUpdateUnit({ onSuccess }: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUnitPayload) => unitService.update({ ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success("Unit berhasil diperbarui!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal memperbarui unit", {
        description: "Silakan coba lagi",
      });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success("Unit berhasil dihapus!");
    },
    onError: () => {
      toast.error("Gagal menghapus unit");
    },
  });
}
