import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order.type";
import { formatRupiah, formatDate } from "@/utils/format";
import { ShoppingBag, Calendar, CreditCard, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface DetailOrderModalProps {
  open: boolean;
  onClose: () => void;
  data: Order | null;
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "destructive"; icon: React.ReactNode }
> = {
  DONE: {
    label: "Selesai",
    variant: "success",
    icon: <CheckCircle size={13} className="text-emerald-600" />,
  },
  PENDING: {
    label: "Pending",
    variant: "warning",
    icon: <Clock size={13} className="text-amber-600" />,
  },
  CANCELLED: {
    label: "Batal",
    variant: "destructive",
    icon: <XCircle size={13} className="text-rose-600" />,
  },
};

export default function DetailOrderModal({ open, onClose, data }: DetailOrderModalProps) {
  if (!data) return null;

  const statusInfo = statusConfig[data.status] || {
    label: data.status,
    variant: "secondary",
    icon: null,
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag size={18} className="text-[var(--fandm-primary)]" />
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {data.orderNumber}
            </span>
          </div>
          <DialogTitle className="text-slate-800 font-extrabold text-base">Detail Transaksi</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Rincian pesanan ritel dari kasir outlet aktif
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-3">
          {/* Status Banner */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border bg-slate-50/50 border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white border shadow-xs shrink-0">
                {statusInfo.icon}
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                  Status Pesanan
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant={statusInfo.variant} className="text-[8px] py-0 px-1.5 font-bold">
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-l border-slate-200/60 pl-3">
              <div className="p-2 rounded-lg bg-white border shadow-xs shrink-0">
                <CreditCard size={13} className={data.paymentStatus === "LUNAS" ? "text-emerald-600" : "text-amber-600"} />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                  Status Bayar
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant={data.paymentStatus === "LUNAS" ? "success" : "warning"} className="text-[8px] py-0 px-1.5 font-bold">
                    {data.paymentStatus === "LUNAS" ? "Lunas" : "DP (Uang Muka)"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/20 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Pelanggan</span>
              <span className="font-bold text-slate-700 mt-0.5 block">{data.customerName || "Ritel Customer"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
                <Calendar size={10} /> Tanggal Transaksi
              </span>
              <span className="font-medium text-slate-600 mt-0.5 block">{formatDate(data.orderDate)}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
                <CreditCard size={10} /> Metode Pembayaran
              </span>
              <span className="font-semibold text-slate-600 mt-0.5 block">{data.paymentMethod || "QRIS"}</span>
            </div>
          </div>

          {/* Itemized List */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Belanja</h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {data.items && data.items.length > 0 ? (
                data.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 text-xs">
                    <div className="min-w-0 pr-3 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-700 truncate">{item.productName}</span>
                        {item.productType && (
                          <Badge variant={item.productType === "MADE_TO_ORDER" ? "info" : item.productType === "RESELL" ? "warning" : "success"} className="text-[8px] py-0 px-1 font-bold">
                            {item.productType === "MADE_TO_ORDER" ? "MTO" : item.productType === "RESELL" ? "Resell" : "MTS"}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.quantity} x {formatRupiah(item.price)}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 shrink-0">
                      {formatRupiah(item.quantity * item.price)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 italic">
                  Tidak ada rincian belanja untuk transaksi ini.
                </div>
              )}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Total Tagihan</span>
              <span className="font-semibold">{formatRupiah(data.totalAmount)}</span>
            </div>

            {data.paymentStatus === "DP" ? (
              <>
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>Sudah Dibayar (DP)</span>
                  <span>-{formatRupiah(data.dpAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-500 pb-2 border-b border-dashed border-slate-200">
                  <span>Pajak (0%)</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between text-slate-800 font-black text-sm pt-1">
                  <span>Sisa Pembayaran</span>
                  <span className="text-amber-600">{formatRupiah(data.totalAmount - (data.dpAmount || 0))}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Sudah Dibayar (Lunas)</span>
                  <span>-{formatRupiah(data.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500 pb-2 border-b border-dashed border-slate-200">
                  <span>Pajak (0%)</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between text-slate-800 font-black text-sm pt-1">
                  <span>Sisa Pembayaran</span>
                  <span className="text-emerald-600 font-bold">Lunas (Rp 0)</span>
                </div>
              </>
            )}
          </div>

          {/* Notes if any */}
          {data.notes && (
            <div className="p-3 bg-amber-50/30 rounded-xl border border-amber-100/50 text-xs text-amber-800 flex items-start gap-2">
              <FileText size={13} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700">Catatan</span>
                <p className="mt-0.5 font-medium leading-relaxed">{data.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-slate-50 pt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
