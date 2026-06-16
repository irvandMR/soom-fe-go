import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/order.type";
import { Eye, Calendar, ShoppingBag } from "lucide-react";
import { formatRupiah, formatDate } from "@/utils/format";

interface OrderCardProps {
  data: Order;
  onDetail: (order: Order) => void;
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "default" }
> = {
  DONE: { label: "Selesai", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  CANCELLED: { label: "Batal", variant: "destructive" },
};

export default function OrderCard({ data, onDetail }: OrderCardProps) {
  const conf = statusConfig[data.status] || { label: data.status, variant: "secondary" };
  const isDone = data.status === "DONE";

  const theme = isDone
    ? {
        bg: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent",
        iconColor: "text-emerald-600",
      }
    : data.status === "PENDING"
    ? {
        bg: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent",
        iconColor: "text-amber-600",
      }
    : {
        bg: "bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-transparent",
        iconColor: "text-rose-600",
      };

  return (
    <Card className="group relative border-[var(--fandm-border)] overflow-hidden bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xl flex flex-col justify-between h-full">
      {/* Top Section */}
      <div className={`p-4 pb-3 flex flex-col gap-2 relative ${theme.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-100">
              {data.orderNumber}
            </span>
            {data.orderType && (
              <Badge variant={data.orderType === "PRE_ORDER" ? "info" : "success"} className="text-[8px] px-1.5 py-0 font-bold">
                {data.orderType === "PRE_ORDER" ? "Pre-Order" : "Ritel"}
              </Badge>
            )}
          </div>
          <Badge variant={conf.variant} className="text-[9px] px-2 py-0.5 font-bold">
            {conf.label}
          </Badge>
        </div>

        {/* Customer Profile */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className={theme.iconColor} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight truncate">
              {data.customerName || "Walk-in Customer"}
            </h3>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center border-t border-dashed border-slate-100 bg-slate-50/30 gap-2.5">
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} /> Tanggal
            </span>
            <span className="text-xs text-slate-600 font-medium truncate">
              {formatDate(data.orderDate)}
            </span>
          </div>
          <div className="text-right flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Total Tagihan
            </span>
            <span className="text-xs font-black text-slate-800">
              {formatRupiah(data.totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Status Row */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Status Bayar
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant={data.paymentStatus === "LUNAS" ? "success" : "warning"} className="text-[8px] px-1.5 py-0.5 font-bold">
              {data.paymentStatus === "LUNAS" ? "Lunas" : "DP"}
            </Badge>
            {data.paymentStatus === "DP" && data.dpAmount !== undefined && (
              <span className="text-[10px] font-bold text-slate-600">
                {formatRupiah(data.dpAmount)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between rounded-b-xl gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={12} />}
          onClick={() => onDetail(data)}
          className="text-xs font-semibold text-slate-700 w-full hover:bg-slate-50"
        >
          Lihat Rincian
        </Button>
      </div>
    </Card>
  );
}
