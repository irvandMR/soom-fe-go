import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CashFlow } from "@/types/cashflow.type";
import { formatRupiah } from "@/utils/format";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface CashFlowCardProps {
  data: CashFlow;
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

export default function CashFlowCard({ data }: CashFlowCardProps) {
  const isIncome = data.type === "IN";
  const theme = isIncome
    ? {
        bg: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent",
        iconColor: "text-emerald-600",
        amountColor: "text-green-600",
        badgeVariant: "success" as const,
        icon: TrendingUp,
      }
    : {
        bg: "bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-transparent",
        iconColor: "text-rose-600",
        amountColor: "text-rose-600",
        badgeVariant: "danger" as const,
        icon: TrendingDown,
      };

  const IconComponent = theme.icon;

  return (
    <Card className="group relative border-[var(--fandm-border)] overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xl flex flex-col justify-between h-full">
      {/* ── Top Decorative Banner & Title ── */}
      <div className={`p-4 pb-3 flex flex-col gap-3 relative ${theme.bg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-100">
            #{data.id.toUpperCase()}
          </span>
          <Badge variant={theme.badgeVariant} className="text-[10px] px-2 py-0.5">
            {isIncome ? "Pemasukan" : "Pengeluaran"}
          </Badge>
        </div>

        {/* Transaction Meta Section */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0">
            <IconComponent size={18} className={theme.iconColor} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight truncate">
              {data.category}
            </h3>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {data.reference_type || "Manual"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Transaction Details & Amount ── */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center border-t border-dashed border-slate-100 bg-slate-50/30 gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Jumlah
          </span>
          <span className={`text-base font-extrabold ${theme.amountColor}`}>
            {isIncome ? "+" : "-"}{formatRupiah(data.amount)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 border-t border-slate-100/70 pt-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Deskripsi
          </span>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {data.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <Calendar size={11} />
          <span>Tanggal: {formatDate(data.transaction_date)}</span>
        </div>
      </div>
    </Card>
  );
}
