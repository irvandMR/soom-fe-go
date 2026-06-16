import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetCategoryAll } from "../categories/useCategoriesQuery";
import { useGetUnitAll } from "../unit/useUnitQuery";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateIngredient } from "./useIngredientMutation";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ingredientSchema, type IngredientFormData } from "./ingredientSchema";

interface FormModalCreateIngredientProps {
  open: boolean;
  onClose: () => void;
  defaultCategoryType?: "ingredient" | "packaging";
}

export default function FormModalCreateIngredient({
  open,
  onClose,
  defaultCategoryType = "ingredient",
}: FormModalCreateIngredientProps) {
  const { data: categoryOption = [] } = useGetCategoryAll();
  const { data: unitOption = [] } = useGetUnitAll();

  const filteredCategoryOptions = useMemo(() => {
    return categoryOption.filter((cat: any) => {
      const typeStr = (cat.type || "").toLowerCase();
      const nameStr = (cat.name || "").toLowerCase();
      const typeToFind = (defaultCategoryType || "ingredient").toLowerCase();
      
      if (typeToFind === "packaging") {
        return (
          typeStr.includes("packaging") ||
          typeStr.includes("kemasan") ||
          typeStr.includes("box") ||
          nameStr.includes("packaging") ||
          nameStr.includes("kemasan") ||
          nameStr.includes("box") ||
          nameStr.includes("wadah")
        );
      }
      
      return (
        typeStr === "ingredient" ||
        nameStr.includes("bahan baku") ||
        (!typeStr.includes("packaging") &&
         !typeStr.includes("kemasan") &&
         !typeStr.includes("box") &&
         !nameStr.includes("packaging") &&
         !nameStr.includes("kemasan") &&
         !nameStr.includes("box") &&
         !nameStr.includes("wadah"))
      );
    });
  }, [categoryOption, defaultCategoryType]);

  const filteredUnitOptions = useMemo(() => {
    return unitOption.filter((unit: any) => {
      const sym = (unit.symbol || "").toLowerCase();
      const name = (unit.name || "").toLowerCase();
      
      const isWeightOrVolume =
        sym === "kg" ||
        sym === "g" ||
        sym === "gr" ||
        sym === "gram" ||
        sym === "mg" ||
        sym === "l" ||
        sym === "ml" ||
        sym === "liter" ||
        sym === "mililiter" ||
        name.includes("gram") ||
        name.includes("liter") ||
        name.includes("kilogram");
        
      if (defaultCategoryType === "packaging") {
        return !isWeightOrVolume;
      }
      
      return true;
    });
  }, [unitOption, defaultCategoryType]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema) as any,
    defaultValues: {
      category_id: "",
      unit_id: "",
      name: "",
      min_stock: 0,
      is_active: false,
    },
  });

  useEffect(() => {
    if (open) {
      const defaultCategory = filteredCategoryOptions[0];

      reset({
        category_id: defaultCategory?.id || "",
        unit_id: "",
        name: "",
        min_stock: 0,
        is_active: false,
      });
    }
  }, [open, reset, filteredCategoryOptions]);

  const createMuatation = useCreateIngredient({ onSuccess: onClose });
  const isPending = createMuatation.isPending;
  const isActive = watch("is_active");

  const onSubmit = (data: any) => {
    const values = data as IngredientFormData;

    const payload = {
      category_id: values.category_id,
      unit_id: values.unit_id,
      name: values.name,
      min_stock: values.min_stock,
      is_active: values.is_active,
    };

    createMuatation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultCategoryType === "packaging" ? "Tambah Kemasan & Wadah" : "Tambah Bahan Baku"}
          </DialogTitle>
          <DialogDescription>
            {defaultCategoryType === "packaging"
              ? "Masukkan data kemasan atau wadah baru yang ingin ditambahkan ke sistem."
              : "Masukkan data bahan baku baru yang ingin ditambahkan ke sistem."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              {defaultCategoryType === "packaging" ? "Nama Kemasan / Wadah" : "Nama Bahan Baku"}
            </label>
            <Input
              placeholder={defaultCategoryType === "packaging" ? "Contoh: Box Roti" : "Contoh: Tepung Terigu"}
              {...register("name")}
            />

            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Kategori
            </label>

            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled>
                  <SelectTrigger className="w-full disabled:opacity-60">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategoryOptions.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name || cat.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-[10px] text-muted-foreground mt-0.5">
              * Kategori ini dikhususkan untuk <strong>{defaultCategoryType === "packaging" ? "Kemasan & Wadah" : "Bahan Baku"}</strong>.
            </p>
            {errors.category_id && (
              <p className="text-xs text-red-500">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Unit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Satuan
            </label>

            <Controller
              control={control}
              name="unit_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Satuan" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={4}
                    className="max-h-60"
                  >
                    {filteredUnitOptions.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} <Badge variant="info">{unit.symbol}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unit_id && (
              <p className="text-xs text-red-500">{errors.unit_id.message}</p>
            )}
          </div>

          {/* Minimum Stock */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Minimum Stock
            </label>
            <Input
              type="number"
              placeholder="Contoh: 2"
              {...register("min_stock")}
            />

            {errors.min_stock && (
              <p className="text-xs text-red-500">{errors.min_stock.message}</p>
            )}
          </div>

          {/* active */}

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
          <Button
            type="submit"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
            {defaultCategoryType === "packaging" ? "Tambah Kemasan & Wadah" : "Tambah Bahan Baku"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
