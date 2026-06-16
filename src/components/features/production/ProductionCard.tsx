import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Production } from "@/types/production.type";
import { Eye, Factory, Calendar, ShieldAlert } from "lucide-react";

interface ProductionCardProps {
  data: Production;
  onDetail: (production: Production) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function ProductionCard({ data, onDetail }: ProductionCardProps) {
  const isSuccess = data.status === "SUCCESS";
  const theme = isSuccess
    ? {
        bg: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent",
        iconColor: "text-emerald-600",
        badgeVariant: "success" as const,
      }
    : {
        bg: "bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-transparent",
        iconColor: "text-rose-600",
        badgeVariant: "danger" as const,
      };

  return (
    <Card className="group relative border-[var(--fandm-border)] overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xl flex flex-col justify-between h-full">
      {/* ── Top Decorative Banner & Title ── */}
      <div className={`p-4 pb-3 flex flex-col gap-3 relative ${theme.bg}`}>
        {/* Floating ID & Status */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-100">
            #{data.id.toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-100">
            <span className={`h-1.5 w-1.5 rounded-full ${!isSuccess ? "bg-rose-500" : (data.quantity_failed ?? 0) > 0 ? "bg-amber-500 animate-pulse" : "bg-green-500 animate-pulse"}`} />
            <span className="text-[10px] font-semibold text-slate-600">
              {!isSuccess ? "Gagal Total" : (data.quantity_failed ?? 0) > 0 ? "Sukses (Ada Reject)" : "Sukses"}
            </span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300">
            {isSuccess ? (
              <Factory size={20} className={theme.iconColor} />
            ) : (
              <ShieldAlert size={20} className={theme.iconColor} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight truncate group-hover:text-[var(--fandm-primary)] transition-colors duration-200">
              {data.product_name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
              <span>Resep:</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold bg-slate-50 text-slate-600">
                v{data.recipe_version}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Production Stats ── */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center border-t border-dashed border-slate-100 bg-slate-50/30">
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2">
          {/* Quantity Section */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Hasil Produksi
            </span>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-slate-700">
                  {data.quantity_produced}
                </span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {data.unit_symbol}
                </span>
              </div>
              {(data.quantity_failed ?? 0) > 0 && (
                <span className="text-[9px] font-semibold text-rose-600 mt-0.5">
                  ({data.quantity_success ?? data.quantity_produced} ok · {data.quantity_failed} rjt)
                </span>
              )}
            </div>
          </div>

          {/* Dates Section */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Tgl Produksi
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
              <Calendar size={11} className="text-slate-400" />
              {formatDate(data.production_date)}
            </div>
          </div>

          {/* Expiry Date Section */}
          <div className="flex flex-col gap-0.5 border-t border-slate-100/70 pt-2.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Kadaluwarsa (Expired)
            </span>
            <span className="text-xs text-slate-600 font-semibold">
              {formatDate(data.expired_date)}
            </span>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-0.5 border-t border-slate-100/70 pt-2.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Catatan
            </span>
            <span className="text-xs text-slate-500 italic truncate">
              {data.notes || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-end rounded-b-xl">
        <Button
          variant="outline"
          size="sm"
          icon={<Eye size={12} />}
          onClick={() => onDetail(data)}
          className="text-xs px-3.5 h-8 font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 w-full sm:w-auto"
        >
          Lihat Detail
        </Button>
      </div>
    </Card>
  );
}
