import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Categories } from "@/types/categories.type";
import { categoriesSchema, type CategoriesFormData } from "./categoriesSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useCreateCategories,
  useUpdateCategories,
} from "./useCategoriesMutation";
import { confirm } from "@/store/useConfirmStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface FormModalCategoriesProps {
  open: boolean;
  onClose: () => void;
  editData?: Categories | null;
}

export default function FormModalCategories({
  open,
  onClose,
  editData,
}: FormModalCategoriesProps) {
  const isEdit = !!editData;
  const title = isEdit ? "Edit Kategori" : "Tambah Kategori";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoriesFormData>({
    resolver: zodResolver(categoriesSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      type: "",
      is_active: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          code: editData.Code ?? "",
          name: editData.Name ?? "",
          type: editData.Type ?? "",
          is_active: editData.IsActive ?? false,
        });
      } else {
        reset({
          code: "",
          name: "",
          type: "",
          is_active: false,
        });
      }
    }
  }, [open, editData, reset]);

  const isActive = watch("is_active");
  const createMutation = useCreateCategories({ onSuccess: onClose });
  const updateMutation = useUpdateCategories({ onSuccess: onClose });
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: any) => {
    const values = data as CategoriesFormData;

    const payload = {
      code: values.code,
      name: values.name,
      type: values.type,
      is_active: values.is_active,
    };

    if (isEdit) {
      const payloadEdit = {
        ...payload,
        id: editData.Id,
      };

      handleEdit(payloadEdit);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (payload: any) => {
    confirm({
      title: `Simpan perubahan katageri "${editData?.Name}"?`,
      description: "Pastikan data katageri sudah benar.",
      confirmLabel: "Ya, Simpan",
      variant: "default",
      onConfirm: () => updateMutation.mutate(payload),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Kode
            </label>
            <Input
              placeholder="Contoh: INGT"
              {...register("code")}
              disabled={isEdit}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama
            </label>
            <Input
              placeholder="Contoh: Ingredient / Bahan Baku"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Type
            </label>
            <Input placeholder="Contoh: INREDIENT" {...register("type")} />
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Status
            </label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              )}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              )}
              {isEdit ? "Simpan Perubahan" : "Tambah Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
