import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import type { Product } from "@/types/product.type";

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
  const [name, setName] = useState("");
  const [type, setType] = useState("MADE_TO_STOCK");
  const [categoryName, setCategoryName] = useState("Roti");
  const [unitSymbol, setUnitSymbol] = useState("pcs");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open) {
      if (editData) {
        setName(editData.name);
        setType(editData.type);
        setCategoryName(editData.category_name);
        setUnitSymbol(editData.unit_symbol);
        setIsActive(editData.is_active);
      } else {
        setName("");
        setType("MADE_TO_STOCK");
        setCategoryName("Roti");
        setUnitSymbol("pcs");
        setIsActive(true);
      }
    }
  }, [open, editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }

    if (editData) {
      toast.success(`Produk "${name}" berhasil diperbarui! (Mock)`);
    } else {
      toast.success(`Produk "${name}" berhasil ditambahkan! (Mock)`);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Perbarui informasi produk di dalam sistem."
              : "Masukkan data produk baru yang ingin ditambahkan ke sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama Produk
            </label>
            <Input
              placeholder="Contoh: Croissant Coklat"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Tipe Produk
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tipe Produk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MADE_TO_STOCK">Made to Stock</SelectItem>
                <SelectItem value="MADE_TO_ORDER">Made to Order</SelectItem>
                <SelectItem value="RESELL">Resell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Kategori
            </label>
            <Select value={categoryName} onValueChange={setCategoryName}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Roti">Roti</SelectItem>
                <SelectItem value="Kue Basah">Kue Basah</SelectItem>
                <SelectItem value="Minuman">Minuman</SelectItem>
                <SelectItem value="Bahan Pembantu">Bahan Pembantu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unit Symbol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Satuan
            </label>
            <Select value={unitSymbol} onValueChange={setUnitSymbol}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Satuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pcs">pcs</SelectItem>
                <SelectItem value="pack">pack</SelectItem>
                <SelectItem value="lyg">loyang</SelectItem>
                <SelectItem value="btl">botol</SelectItem>
                <SelectItem value="jar">jar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Status Keaktifan
            </label>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {isActive ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editData ? "Perbarui Produk" : "Tambah Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
