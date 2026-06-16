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
import type { Product } from "@/types/product.type";
import { formatRupiah } from "@/utils/format";
import { ChefHat, Sparkles, Layers, Archive } from "lucide-react";
import { MOCK_RECIPE_HISTORY } from "./RecipeManageModal";

interface DetailProductModalProps {
  open: boolean;
  onClose: () => void;
  data: Product | null;
  onManageRecipe: () => void;
}

const typeLabel: Record<string, string> = {
  MADE_TO_ORDER: "Made to Order",
  MADE_TO_STOCK: "Made to Stock",
  RESELL: "Resell",
};

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "MADE_TO_STOCK":
      return "success";
    case "MADE_TO_ORDER":
      return "info";
    case "RESELL":
      return "warning";
    default:
      return "secondary";
  }
};

// Mock recipe items for display
const MOCK_RECIPES: Record<string, { name: string; qty: number; unit: string }[]> = {
  "prod-1": [
    { name: "Tepung Terigu", qty: 500, unit: "g" },
    { name: "Mentega", qty: 50, unit: "g" },
    { name: "Air", qty: 250, unit: "ml" },
    { name: "Ragi", qty: 11, unit: "g" },
    { name: "Gula Pasir", qty: 40, unit: "g" },
  ],
  "prod-2": [
    { name: "Tepung Terigu Hard", qty: 600, unit: "g" },
    { name: "Ragi Kering", qty: 8, unit: "g" },
    { name: "Gula", qty: 10, unit: "g" },
    { name: "Garam", qty: 12, unit: "g" },
    { name: "Air Dingin", qty: 380, unit: "ml" },
  ],
  "prod-3": [
    { name: "Tepung Terigu", qty: 500, unit: "g" },
    { name: "Mentega Blok", qty: 250, unit: "g" },
    { name: "Gula Pasir", qty: 60, unit: "g" },
    { name: "Susu Cair", qty: 150, unit: "ml" },
    { name: "Kuning Telur", qty: 2, unit: "butir" },
  ],
  "prod-4": [
    { name: "Coklat Bubuk Premium", qty: 100, unit: "g" },
    { name: "Tepung Kue", qty: 300, unit: "g" },
    { name: "Mentega", qty: 150, unit: "g" },
    { name: "Telur Ayam", qty: 6, unit: "butir" },
    { name: "Gula Halus", qty: 200, unit: "g" },
  ],
};

export default function DetailProductModal({
  open,
  onClose,
  data,
  onManageRecipe,
}: DetailProductModalProps) {
  if (!data) return null;

  const activeVersion = data.active_recipe_version;
  const historyItems = MOCK_RECIPE_HISTORY[data.id] || [];
  const activeVersionRecipe = historyItems.find((h) => h.version === activeVersion);
  
  const recipeItems = activeVersionRecipe 
    ? activeVersionRecipe.items 
    : (MOCK_RECIPES[data.id] || []);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Detail Produk</DialogTitle>
            <Badge variant={typeBadgeVariant(data.type)} className="text-[10px]">
              {typeLabel[data.type]}
            </Badge>
          </div>
          <DialogDescription>
            Informasi lengkap produk dan resep aktif.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 text-sm text-[var(--fandm-text)]">
          {/* Visual Header */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-xs shrink-0">
              {data.type === "MADE_TO_ORDER" ? (
                <Sparkles size={24} className="text-indigo-600" />
              ) : data.type === "MADE_TO_STOCK" ? (
                <Layers size={24} className="text-emerald-600" />
              ) : (
                <Archive size={24} className="text-amber-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-base text-slate-800 truncate leading-tight">
                {data.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kategori: <span className="font-semibold text-slate-600">{data.category_name}</span>
              </p>
            </div>
            <Badge variant={data.is_active ? "success" : "secondary"} className="shrink-0 text-[10px]">
              {data.is_active ? "Aktif" : "Non-aktif"}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Satuan Unit</span>
              <span className="font-semibold text-slate-700 mt-0.5">{data.unit_name} ({data.unit_symbol})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Stok Saat Ini</span>
              <span className="font-semibold text-slate-700 mt-0.5">{data.stock_qty} {data.unit_symbol}</span>
            </div>
            <div className="flex flex-col col-span-2 border-t border-slate-100 pt-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimasi HPP (Modal)</span>
              <span className="font-extrabold text-slate-800 mt-0.5 text-base">
                {data.estimated_cost != null ? formatRupiah(data.estimated_cost) : "—"}
              </span>
            </div>
          </div>

          {/* Recipe Section */}
          <div className="border-t border-slate-100 pt-3.5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <ChefHat size={16} className="text-slate-500" />
                <span>Bahan Baku Resep</span>
              </div>
              {data.active_recipe_version ? (
                <Badge variant="success" className="text-[10px]">
                  v{data.active_recipe_version} (Aktif)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">
                  Resell / No Recipe
                </Badge>
              )}
            </div>

            {recipeItems.length > 0 ? (
              <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 max-h-40 overflow-y-auto">
                {recipeItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-100/50 last:border-0">
                    <span className="font-medium text-slate-600">{item.name}</span>
                    <span className="font-bold text-slate-700">
                      {item.qty} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
                Produk ini tidak memiliki resep aktif.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-slate-50 mt-1">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onManageRecipe}>
            Kelola Resep & HPP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
