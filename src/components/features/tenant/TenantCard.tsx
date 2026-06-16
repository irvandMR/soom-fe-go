import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tenant } from "@/types/tenant.type";
import { Pencil, Trash2, Store, MapPin, Phone, User } from "lucide-react";

interface TenantCardProps {
  data: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export default function TenantCard({ data, onEdit, onDelete }: TenantCardProps) {
  const isAct = data.is_active;

  return (
    <Card className="group relative border-[var(--fandm-border)] overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xl flex flex-col justify-between h-full">
      {/* ── Top Decorative Banner ── */}
      <div className="p-4 pb-3 flex flex-col gap-3 relative bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
            {data.code}
          </span>
          <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-100">
            <span className={`h-1.5 w-1.5 rounded-full ${isAct ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
            <span className="text-[10px] font-semibold text-slate-600">
              {isAct ? "Aktif" : "Non-aktif"}
            </span>
          </div>
        </div>

        {/* Tenant profile section */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0">
            <Store size={18} className="text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight truncate">
              {data.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 font-medium">
              <User size={10} />
              <span>Owner: {data.owner_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tenant contact details ── */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center border-t border-dashed border-slate-100 bg-slate-50/30 gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Phone size={11} className="text-slate-400 shrink-0" />
          <span>{data.phone}</span>
        </div>

        <div className="flex items-start gap-2 border-t border-slate-100/70 pt-2 text-xs text-slate-600">
          <MapPin size={11} className="text-slate-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed text-[11px] text-slate-500">
            {data.address}
          </span>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between rounded-b-xl gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          icon={<Pencil size={12} />}
          onClick={() => onEdit(data)}
          className="text-xs font-semibold text-slate-700 w-full hover:bg-slate-50"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          icon={<Trash2 size={12} />}
          onClick={() => onDelete(data)}
          className="text-xs font-semibold w-full h-8 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 border border-transparent hover:border-rose-100"
        >
          Hapus
        </Button>
      </div>
    </Card>
  );
}
