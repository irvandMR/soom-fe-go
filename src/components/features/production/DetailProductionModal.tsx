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
import type { Production } from "@/types/production.type";
import { Factory, Calendar, ShieldCheck, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/utils/format";

interface DetailProductionModalProps {
  open: boolean;
  onClose: () => void;
  data: Production | null;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const getMockCostPerUnit = (productName: string, version: number | string): number => {
  const vStr = String(version);
  const nameLower = productName.toLowerCase();
  
  if (nameLower.includes("roti tawar")) {
    return vStr === "1" ? 8500 : 9200;
  }
  if (nameLower.includes("baguette")) {
    return vStr === "1" ? 11000 : 13500;
  }
  if (nameLower.includes("croissant")) {
    return 14500;
  }
  return 10000;
};

// Mock consumed ingredients for display in production details
const MOCK_CONSUMED: Record<string, { name: string; qty: number; unit: string }[]> = {
  "prd-1": [
    { name: "Tepung Terigu", qty: 5, unit: "kg" },
    { name: "Mentega", qty: 500, unit: "g" },
    { name: "Gula Pasir", qty: 400, unit: "g" },
  ],
  "prd-2": [
    { name: "Tepung Terigu Hard", qty: 1.8, unit: "kg" },
    { name: "Ragi Kering", qty: 24, unit: "g" },
  ],
  "prd-3": [
    { name: "Tepung Terigu", qty: 2.5, unit: "kg" },
    { name: "Mentega Blok", qty: 1.25, unit: "kg" },
  ],
};

export default function DetailProductionModal({
  open,
  onClose,
  data,
}: DetailProductionModalProps) {
  if (!data) return null;

  const isSuccess = data.status === "SUCCESS";
  const consumedItems = MOCK_CONSUMED[data.id] || [];

  // Calculations for selling recommendations
  const estimatedCostPerUnit = getMockCostPerUnit(data.product_name, data.recipe_version);
  const overheadPerUnit = Math.round(estimatedCostPerUnit * 0.20); // 20% overhead
  const totalCostPerUnit = estimatedCostPerUnit + overheadPerUnit;
  
  const targetMarkup = 150; // default 150% markup (equivalent to 60% margin)
  const rawRecommendedPrice = totalCostPerUnit * (1 + targetMarkup / 100);
  const recommendedPrice = Math.round(rawRecommendedPrice / 500) * 500; // round to nearest Rp 500
  
  const successQty = data.quantity_success ?? data.quantity_produced;
  const potentialBatchRevenue = successQty * recommendedPrice;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Detail Batch Produksi</DialogTitle>
            <Badge variant={isSuccess ? "success" : "danger"} className="text-[10px]">
              {isSuccess ? "Sukses (Lolos QC)" : "Gagal / Reject"}
            </Badge>
          </div>
          <DialogDescription>
            Rincian riwayat pengolahan produk hasil pabrik/dapur.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 text-sm text-[var(--fandm-text)]">
          {/* Visual Header */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${isSuccess ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-xs shrink-0">
              <Factory size={22} className={isSuccess ? "text-emerald-600" : "text-rose-600"} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-base text-slate-800 truncate leading-tight">
                {data.product_name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Batch ID: <span className="font-mono text-slate-600 font-bold">{data.id.toUpperCase()}</span>
              </p>
            </div>
            <div className="shrink-0 flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Resep</span>
              <span className="text-xs font-bold text-slate-600">Versi {data.recipe_version}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Output</span>
              <span className="font-bold text-slate-700 mt-0.5">
                {data.quantity_produced} {data.unit_symbol}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tgl Produksi</span>
              <span className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
                <Calendar size={11} className="text-slate-400" />
                {formatDate(data.production_date)}
              </span>
            </div>

            {/* Qty Sukses & Qty Gagal */}
            <div className="flex flex-col border-t border-slate-100 pt-2.5">
              <span className="text-[10px] uppercase font-bold text-green-600">Lolos QC (Sukses)</span>
              <span className="font-bold text-green-700 mt-0.5">
                {data.quantity_success ?? data.quantity_produced} {data.unit_symbol}
              </span>
            </div>
            <div className="flex flex-col border-t border-slate-100 pt-2.5">
              <span className="text-[10px] uppercase font-bold text-rose-600">Reject (Gagal)</span>
              <span className="font-bold text-rose-700 mt-0.5">
                {data.quantity_failed ?? 0} {data.unit_symbol}
              </span>
            </div>

            <div className="flex flex-col col-span-2 border-t border-slate-100 pt-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tanggal Kedaluwarsa</span>
              <span className="text-xs text-slate-600 mt-0.5 font-semibold">
                {formatDate(data.expired_date)}
              </span>
            </div>
            {data.notes && (
              <div className="flex flex-col col-span-2 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <FileText size={11} /> Catatan Batch
                </span>
                <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2.5 rounded border border-slate-150">
                  "{data.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Pricing Recommendation Section */}
          {isSuccess && (
            <div className="border-t border-slate-100 pt-3.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-2">
                <TrendingUp size={16} className="text-emerald-600" />
                <span>Rekomendasi Harga & Potensi Omzet</span>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-emerald-500/[0.01] rounded-xl p-3 border border-slate-100 flex flex-col gap-3">
                {/* Cost Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pb-2 border-b border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">HPP Bahan & Kemasan</span>
                    <span className="font-semibold text-slate-700 mt-0.5">
                      {formatRupiah(estimatedCostPerUnit)}
                    </span>
                  </div>
                  <div className="flex flex-col border-x border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Est. Overhead (20%)</span>
                    <span className="font-semibold text-slate-700 mt-0.5">
                      {formatRupiah(overheadPerUnit)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">HPP + Overhead</span>
                    <span className="font-bold text-slate-800 mt-0.5">
                      {formatRupiah(totalCostPerUnit)}
                    </span>
                  </div>
                </div>

                {/* Sell Recommendations */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200/60 shadow-2xs">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Rekomendasi Harga Jual</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5">
                      {formatRupiah(recommendedPrice)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                      Target Markup {targetMarkup}% (Dibulatkan)
                    </span>
                  </div>
                  <div className="flex flex-col sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Potensi Nilai Jual Batch</span>
                    <span className="text-sm font-black text-green-600 mt-0.5">
                      {formatRupiah(potentialBatchRevenue)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                      Dari {successQty} unit lolos QC
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw Materials Consumed */}
          {isSuccess && (
            <div className="border-t border-slate-100 pt-3.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Bahan Baku yang Digunakan (Estimasi)</span>
              </div>

              {consumedItems.length > 0 ? (
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2">
                  {consumedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-100/50 last:border-0">
                      <span className="font-medium text-slate-600">{item.name}</span>
                      <span className="font-bold text-slate-700">
                        {item.qty} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3 text-center border border-dashed border-slate-200">
                  Data pemakaian bahan baku tidak terekam.
                </div>
              )}
            </div>
          )}

          {/* QC Warning Banner */}
          {(!isSuccess || (data.quantity_failed ?? 0) > 0) && (
            <div className={`border p-3 rounded-xl flex items-start gap-2.5 mt-1 ${
              !isSuccess 
                ? "bg-rose-50 border-rose-100 text-rose-700" 
                : "bg-amber-50 border-amber-100 text-amber-700"
            }`}>
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">
                  {!isSuccess ? "Kegagalan Total Produksi" : "Laporan Susut / Reject"}
                </p>
                <p className={`text-[11px] mt-0.5 ${!isSuccess ? "text-rose-600" : "text-amber-600"}`}>
                  {!isSuccess 
                    ? `Batch ini gagal sepenuhnya (${data.quantity_failed ?? data.quantity_produced} ${data.unit_symbol} reject) dan tidak ada produk yang ditambahkan ke stok.` 
                    : `Terdapat ${data.quantity_failed} ${data.unit_symbol} reject. Hanya produk yang lolos QC (${data.quantity_success ?? data.quantity_produced} ${data.unit_symbol}) yang ditambahkan ke stok siap jual.`}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t border-slate-50 mt-1">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
