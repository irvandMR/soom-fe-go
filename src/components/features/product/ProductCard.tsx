import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product.type";
import { formatRupiah } from "@/utils/format";
import {
  Pencil,
  Trash2,
  Eye,
  ChefHat,
  Archive,
  Layers,
  Sparkles,
} from "lucide-react";

interface ProductCardProps {
  data: Product;
  onEdit: (product: Product) => void;
  onDetail: (product: Product) => void;
  onRecipe: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const typeLabel: Record<string, string> = {
  MADE_TO_ORDER: "Made to Order",
  MADE_TO_STOCK: "Made to Stock",
  RESELL: "Resell",
};

export default function ProductCard({
  data,
  onEdit,
  onDetail,
  onRecipe,
  onDelete,
}: ProductCardProps) {
  // Dynamic gradient banner backgrounds based on product type for premium aesthetic
  const getThemedBanner = (type: string) => {
    switch (type) {
      case "MADE_TO_STOCK":
        return {
          bg: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent",
          iconColor: "text-emerald-600",
          badgeVariant: "success" as const,
        };
      case "MADE_TO_ORDER":
        return {
          bg: "bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent",
          iconColor: "text-indigo-600",
          badgeVariant: "info" as const,
        };
      case "RESELL":
        return {
          bg: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent",
          iconColor: "text-amber-600",
          badgeVariant: "warning" as const,
        };
      default:
        return {
          bg: "bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-transparent",
          iconColor: "text-slate-600",
          badgeVariant: "secondary" as const,
        };
      }
  };

  const theme = getThemedBanner(data.type);

  return (
    <Card className="group relative border-[var(--fandm-border)] overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-xl flex flex-col justify-between h-full">
      {/* ── Top Decorative Banner & Category ── */}
      <div className={`p-4 pb-3 flex flex-col gap-3 relative ${theme.bg}`}>
        {/* Floating ID & Status */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-100">
            #{data.id.toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-100">
            <span className={`h-1.5 w-1.5 rounded-full ${data.is_active ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
            <span className="text-[10px] font-medium text-slate-600">
              {data.is_active ? "Aktif" : "Non-aktif"}
            </span>
          </div>
        </div>

        {/* Product Meta Section */}
        <div className="flex items-center gap-3 mt-1">
          {/* Main Visual Placeholder */}
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300">
            {data.type === "MADE_TO_ORDER" ? (
              <Sparkles size={20} className={theme.iconColor} />
            ) : data.type === "MADE_TO_STOCK" ? (
              <Layers size={20} className={theme.iconColor} />
            ) : (
              <Archive size={20} className={theme.iconColor} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-[var(--fandm-primary)] transition-colors duration-200 truncate">
              {data.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-500 truncate">
                {data.category_name}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <Badge variant={theme.badgeVariant} className="text-[10px] px-1.5 py-0">
                {typeLabel[data.type]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Stats & Information Grid ── */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center border-t border-dashed border-slate-100 bg-slate-50/30">
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2">
          {/* Stock Section */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Stok
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-sm font-extrabold ${data.stock_qty <= 5 ? "text-rose-600" : "text-slate-700"}`}>
                {data.stock_qty}
              </span>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {data.unit_symbol}
              </span>
            </div>
          </div>

          {/* Recipe Version Section */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Versi Resep
            </span>
            <div className="flex items-center">
              {data.active_recipe_version != null ? (
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px] font-bold">
                  <ChefHat size={10} />
                  v{data.active_recipe_version}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic font-medium">— Tanpa Resep</span>
              )}
            </div>
          </div>

          {/* Estimated HPP Cost */}
          <div className="col-span-2 flex flex-col gap-0.5 border-t border-slate-100/70 pt-2.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Estimasi Biaya HPP
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-black text-slate-800">
                {data.estimated_cost != null ? formatRupiah(data.estimated_cost) : "—"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium italic">
                per {data.unit_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-3 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between gap-1.5 rounded-b-xl">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            icon={<Eye size={13} />}
            iconOnly
            title="Detail"
            onClick={() => onDetail(data)}
            className="hover:bg-slate-100 hover:text-slate-700 text-slate-500"
          >
            Detail
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            icon={<Pencil size={13} />}
            iconOnly
            title="Edit"
            onClick={() => onEdit(data)}
            className="hover:bg-slate-100 hover:text-slate-700 text-slate-500"
          >
            Edit
          </Button>
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={<ChefHat size={12} />}
            onClick={() => onRecipe(data)}
            className="text-xs px-2.5 h-8 font-semibold text-slate-700 border-slate-200 hover:bg-slate-50"
          >
            Resep & HPP
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            icon={<Trash2 size={13} />}
            iconOnly
            title="Hapus"
            onClick={() => onDelete(data)}
            className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 border border-transparent hover:border-rose-100"
          >
            Hapus
          </Button>
        </div>
      </div>
    </Card>
  );
}
