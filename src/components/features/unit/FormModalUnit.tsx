// src/components/features/unit/FormModalUnit.tsx
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitSchema, type UnitFormData } from "./unitSchema";
import { useCreateUnit, useUpdateUnit } from "./useUnitMutation";
import { type Unit } from "./useUnitQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { confirm } from "@/store/useConfirmStore";

interface FormModalUnitProps {
  open: boolean;
  onClose: () => void;
  editData?: Unit | null; // null = mode tambah, ada data = mode edit
}

const baseUnitOptions = [
  { label: "Kilogram", value: "kg" },
  { label: "Liter", value: "L" },
  { label: "Pcs", value: "pcs" },
  { label: "Meter", value: "m" },
];

export default function FormModalUnit({
  open,
  onClose,
  editData,
}: FormModalUnitProps) {
  const isEdit = !!editData;
  const title = isEdit ? "Edit Unit" : "Tambah Unit";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      symbol: "",
      have_conversion: false,
      base_unit: "",
      conversion_factor: 1,
    },
  });
  const haveConversion = watch("have_conversion");

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          code: editData.Code ?? "",
          name: editData.Name ?? "",
          symbol: editData.Symbol ?? "",
          have_conversion: editData.HaveConversion ?? false,
          base_unit: editData.BaseUnit ?? "",
          conversion_factor: editData.ConversionFactor ?? undefined,
        });
      } else {
        reset({
          code: "",
          name: "",
          symbol: "",
          have_conversion: false,
          base_unit: "",
          conversion_factor: 0,
        });
      }
    }
  }, [open, editData, reset]);

  const createMutation = useCreateUnit({ onSuccess: onClose });
  const updateMutation = useUpdateUnit({ onSuccess: onClose });
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: any) => {
    const values = data as UnitFormData;

    const payload = {
      code: values.code,
      name: values.name,
      symbol: values.symbol,
      base_unit: values.base_unit,
      have_conversion: values.have_conversion ?? false,
      conversion_factor: haveConversion ? (values.conversion_factor ?? 1) : 1,
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
      title: `Simpan perubahan unit "${editData?.Name}"?`,
      description: "Pastikan data konversi dan nama unit sudah benar.",
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
          {/* Kode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Kode
            </label>
            <Input
              placeholder="Contoh: KG"
              {...register("code")}
              disabled={isEdit}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama
            </label>
            <Input placeholder="Contoh: Kilogram" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Simbol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Simbol
            </label>
            <Input placeholder="Contoh: kg" {...register("symbol")} />
            {errors.symbol && (
              <p className="text-xs text-red-500">{errors.symbol.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Unit Dasar
            </label>

            <Select
              // Otomatis disable jika checkbox have_conversion tidak dicentang
              // Mengambil value state dari React Hook Form
              value={watch("base_unit")}
              // Set value ke RHF dan langsung trigger validasi Zod agar error merah hilang
              onValueChange={(val) =>
                setValue("base_unit", val, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih unit dasar" />
              </SelectTrigger>

              <SelectContent>
                {baseUnitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.base_unit && (
              <p className="text-xs text-red-500">{errors.base_unit.message}</p>
            )}
          </div>

          {/* Checkbox konversi */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="have_conversion"
              checked={haveConversion}
              onCheckedChange={(val) => setValue("have_conversion", !!val)}
            />
            <label
              htmlFor="have_conversion"
              className="text-sm text-[var(--fandm-text)] cursor-pointer"
            >
              Memiliki konversi ke unit lain
            </label>
          </div>

          {/* Field konversi — muncul kalau checkbox aktif */}
          {haveConversion && (
            <div className="flex flex-col gap-3 pl-4 border-l-2 border-[var(--fandm-border)]">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--fandm-text)]">
                  Faktor Konversi
                </label>
                <Input
                  type="number"
                  step="any"
                  placeholder="Contoh: 1000"
                  {...register("conversion_factor", { valueAsNumber: true })}
                />
                {errors.conversion_factor && (
                  <p className="text-xs text-red-500">
                    {errors.conversion_factor.message}
                  </p>
                )}
              </div>
            </div>
          )}

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
