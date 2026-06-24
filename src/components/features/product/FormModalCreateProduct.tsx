import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product.type";
import { Controller, useForm } from "react-hook-form";
import { productCreateShema, type ProductFormData } from "./productShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct, useUpdateProduct } from "./useProductMutation";
import { confirm } from "@/store/useConfirmStore";
import { PRODUCT_TYPE } from "@/constant/options";
import { useGetCategoryAll } from "../categories/useCategoriesQuery";
import { useGetUnitAll } from "../unit/useUnitQuery";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface FormModalCreateProductProps {
  open: boolean;
  onClose: () => void;
  editData?: Product | null;
}

export default function FormModalCreateProduct({
  open,
  onClose,
  editData,
}: FormModalCreateProductProps) {
  const isEdit = !!editData;
  const title = isEdit ? "Edit Produk" : "Tambah Produck";
  const { data: categoryOption = [] } = useGetCategoryAll();
  const { data: unitOption = [] } = useGetUnitAll();

  const filteredCategoryOptions = useMemo(() => {
    return categoryOption.filter((cat: any) => cat.type === "PRODUCT");
  }, [categoryOption]);


  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors }, } = useForm<ProductFormData>({
      resolver: zodResolver(productCreateShema) as any,
      defaultValues: {
        code: "",
        name: "",
        type: "",
        category_id: "",
        unit_id: "",
        is_active: false
      }
    })

  useEffect(() => {
    if (open) {

      const defaultCategory = filteredCategoryOptions[0]


      if (editData) {
        console.log("editData", editData);

        reset({
          code: editData.code ?? "",
          name: editData.name ?? "",
          type: editData.type ?? "",
          category_id: editData.category_id ?? "",
          unit_id: editData.unit_id ?? "",
          is_active: editData.is_active ?? false
        })
      } else {
        reset({
          code: "",
          name: "",
          type: "",
          category_id: defaultCategory?.id || "",
          unit_id: "",
          is_active: false
        })
      }
    }
  }, [open, editData, reset, filteredCategoryOptions]);

  const isActive = watch("is_active")
  const createProductMutation = useCreateProduct({ onSuccess: onClose })
  const updateProductMutation = useUpdateProduct({ onSuccess: onClose })
  const isPending = createProductMutation.isPending || updateProductMutation.isPending

  const onSubmit = (data: ProductFormData) => {
    const paylaod = {
      code: data.code,
      name: data.name,
      category_id: data.category_id,
      unit_id: data.unit_id,
      type: data.type,
      is_active: data.is_active
    }

    if (isEdit) {
      const paylaodEdit = {
        ...paylaod,
        id: editData.id
      }
      handleEdit(paylaodEdit)
    } else {
      createProductMutation.mutate(paylaod)
    }

  }

  const handleEdit = (payload: any) => {
    confirm({
      title: `Simpan perubahan PRODUK "${editData?.name}"?`,
      description: "Pastikan data produk sudah benar.",
      confirmLabel: "Ya, Simpan",
      variant: "default",
      onConfirm: () => updateProductMutation.mutate(payload),
    });
  };


  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Perbarui informasi produk di dalam sistem."
              : "Masukkan data produk baru yang ingin ditambahkan ke sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Code Produk
            </label>
            <Input
              placeholder="Contoh: CCK-1"
              {...register("code")}
              disabled={isEdit}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama Produk
            </label>
            <Input
              placeholder="Contoh: Croissant Coklat"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Tipe Produk
            </label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tipe Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPE.map((type: any) => (
                      <SelectItem value={type.value}>{type.label}</SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-500">
                {errors.type.message}
              </p>
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
              * Kategori ini dikhususkan untuk <strong>Produk</strong>.
            </p>
            {errors.category_id && (
              <p className="text-xs text-red-500">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Unit Symbol */}
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
                    {unitOption.map((unit: any) => (
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

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Status Keaktifan
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
              {editData ? "Perbarui Produk" : "Tambah Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
