import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/user.type";
import { Pencil, Trash2, User as UserIcon, ShieldAlert } from "lucide-react";

interface UserCardProps {
  data: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "superadmin":
      return "danger";
    case "owner":
      return "warning";
    default:
      return "info";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "owner":
      return "Owner";
    default:
      return "Karyawan";
  }
};

export default function UserCard({ data, onEdit, onDelete }: UserCardProps) {
  const isAct = data.is_active;
  const isOwner = data.role === "owner" || data.role === "superadmin";
  const theme = isOwner
    ? {
        bg: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent",
        iconColor: "text-amber-600",
      }
    : {
        bg: "bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent",
        iconColor: "text-indigo-600",
      };

  return (
    <Card className="group relative border-[var(--fandm-border)] overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xl flex flex-col justify-between h-full">
      {/* ── Top Decorative Banner ── */}
      <div className={`p-4 pb-3 flex flex-col gap-3 relative ${theme.bg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-100">
            #{data.id.toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-100">
            <span className={`h-1.5 w-1.5 rounded-full ${isAct ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
            <span className="text-[10px] font-semibold text-slate-600">
              {isAct ? "Aktif" : "Non-aktif"}
            </span>
          </div>
        </div>

        {/* User profile section */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0">
            {isOwner ? (
              <ShieldAlert size={18} className={theme.iconColor} />
            ) : (
              <UserIcon size={18} className={theme.iconColor} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight truncate">
              {data.name}
            </h3>
            <Badge variant={getRoleBadgeVariant(data.role)} className="text-[9px] px-1.5 py-0 mt-0.5 font-bold">
              {getRoleLabel(data.role)}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── User contact details ── */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center border-t border-dashed border-slate-100 bg-slate-50/30">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Email
          </span>
          <span className="text-xs text-slate-700 font-medium truncate">
            {data.email}
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
        {data.role === "karyawan" && (
          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 size={12} />}
            onClick={() => onDelete(data)}
            className="text-xs font-semibold w-full h-8 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 border border-transparent hover:border-rose-100"
          >
            Hapus
          </Button>
        )}
      </div>
    </Card>
  );
}
