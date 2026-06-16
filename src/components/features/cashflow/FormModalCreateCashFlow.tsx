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

interface FormModalCreateCashFlowProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES_IN = ["Penjualan", "Investasi", "Pemasukan Lainnya"];
const CATEGORIES_OUT = ["Bahan Baku", "Gaji Karyawan", "Operasional (Listrik/Air)", "Peralatan", "Sewa Tempat", "Pengeluaran Lainnya"];

export default function FormModalCreateCashFlow({
  open,
  onClose,
}: FormModalCreateCashFlowProps) {
  const [type, setType] = useState("OUT");
  const [category, setCategory] = useState("Bahan Baku");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");

  const getTodayStr = () => {
    return new Date().toISOString().split("T")[0];
  };
  const [transactionDate, setTransactionDate] = useState(getTodayStr());

  // Automatically reset category when transaction type changes
  useEffect(() => {
    if (type === "IN") {
      setCategory(CATEGORIES_IN[0]);
    } else {
      setCategory(CATEGORIES_OUT[0]);
    }
  }, [type]);

  useEffect(() => {
    if (open) {
      setType("OUT");
      setCategory("Bahan Baku");
      setAmount(0);
      setDescription("");
      setTransactionDate(getTodayStr());
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("Jumlah transaksi harus lebih besar dari Rp 0");
      return;
    }
    if (!description.trim()) {
      toast.error("Deskripsi transaksi wajib diisi");
      return;
    }

    toast.success(
      `Transaksi ${type === "IN" ? "Pemasukan" : "Pengeluaran"} senilai Rp ${amount.toLocaleString("id-ID")} berhasil dicatat! (Mock)`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Input Manual Keuangan</DialogTitle>
          <DialogDescription>
            Catat transaksi pemasukan atau pengeluaran secara manual ke pembukuan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Transaction Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Tipe Transaksi
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">Pemasukan (+)</SelectItem>
                <SelectItem value="OUT">Pengeluaran (-)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Kategori Keuangan
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {type === "IN"
                  ? CATEGORIES_IN.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))
                  : CATEGORIES_OUT.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Jumlah Uang
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <Input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Contoh: 150000"
                className="pl-9"
              />
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Tanggal Transaksi
            </label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Deskripsi / Keterangan
            </label>
            <Input
              placeholder="Contoh: Beli kemasan paper bag isi 100pcs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Simpan Transaksi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
