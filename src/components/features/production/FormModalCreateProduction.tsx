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
import { toast } from "sonner";

interface FormModalCreateProductionProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_PRODUCTS = [
  { id: "p1", name: "Roti Tawar Kupas", unit: "pack", version: 1 },
  { id: "p2", name: "Baguette Parisienne", unit: "pcs", version: 2 },
  { id: "p3", name: "Croissant Almond", unit: "pcs", version: 1 },
  { id: "p4", name: "Kopi Susu Gula Aren 1L", unit: "btl", version: 1 },
];

export default function FormModalCreateProduction({
  open,
  onClose,
}: FormModalCreateProductionProps) {
  const [productId, setProductId] = useState("p1");
  const [quantitySuccess, setQuantitySuccess] = useState<number>(10);
  const [quantityFailed, setQuantityFailed] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Calculate default expiry date (e.g. today + 3 days)
  const getTodayStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [productionDate, setProductionDate] = useState(getTodayStr());
  const [expiredDate, setExpiredDate] = useState(getTodayStr(3));

  useEffect(() => {
    if (open) {
      setProductId("p1");
      setQuantitySuccess(10);
      setQuantityFailed(0);
      setNotes("");
      setProductionDate(getTodayStr());
      setExpiredDate(getTodayStr(3));
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalQty = quantitySuccess + quantityFailed;
    if (totalQty <= 0) {
      toast.error("Total jumlah produksi harus lebih besar dari 0");
      return;
    }

    const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (selectedProduct) {
      toast.success(
        `Batch produksi "${selectedProduct.name}" sejumlah ${totalQty} ${selectedProduct.unit} (${quantitySuccess} sukses, ${quantityFailed} gagal) berhasil dicatat! (Mock)`
      );
    }
    onClose();
  };

  const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === productId);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Hasil Produksi</DialogTitle>
          <DialogDescription>
            Masukkan rincian hasil produksi barang yang baru selesai dibuat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Product Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Produk
            </label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Produk" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PRODUCTS.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id}>
                    {prod.name} (v{prod.version})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Success & Failed Quantities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Jumlah Sukses (Lolos QC)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={quantitySuccess}
                  onChange={(e) => setQuantitySuccess(Math.max(0, Number(e.target.value)))}
                  placeholder="Contoh: 18"
                  className="w-full text-xs"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                Jumlah Gagal (Reject/Waste)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={quantityFailed}
                  onChange={(e) => setQuantityFailed(Math.max(0, Number(e.target.value)))}
                  placeholder="Contoh: 2"
                  className="w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Computed Total Production display */}
          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Total Produksi yang Dicatat:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 text-sm">
                {quantitySuccess + quantityFailed}
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {selectedProduct?.unit || "unit"}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--fandm-text)]">
                Tanggal Produksi
              </label>
              <Input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--fandm-text)]">
                Tanggal Kedaluwarsa
              </label>
              <Input
                type="date"
                value={expiredDate}
                onChange={(e) => setExpiredDate(e.target.value)}
              />
            </div>
          </div>



          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Catatan Produksi
            </label>
            <Input
              placeholder="Contoh: Tekstur adonan lembut, oven rata"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Simpan Batch Produksi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
