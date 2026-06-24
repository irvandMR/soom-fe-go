import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product.type";
import { useState, useEffect } from "react";
import { formatRupiah, formatDate } from "@/utils/format";
import { Plus, Trash2, ChefHat, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecipeManageModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onActivateVersion?: (version: number) => void;
}

interface Uom {
  id: string;
  code: string;
  name: string;
  symbol: string;
  category: "weight" | "volume" | "count";
  factor: number;
}

const MOCK_UOMS: Uom[] = [
  { id: "uom-1", code: "KG", name: "Kilogram", symbol: "kg", category: "weight", factor: 1 },
  { id: "uom-2", code: "G", name: "Gram", symbol: "g", category: "weight", factor: 0.001 },
  { id: "uom-3", code: "L", name: "Liter", symbol: "l", category: "volume", factor: 1 },
  { id: "uom-4", code: "ML", name: "Mililiter", symbol: "ml", category: "volume", factor: 0.001 },
  { id: "uom-5", code: "BUTIR", name: "Butir", symbol: "butir", category: "count", factor: 1 },
  { id: "uom-6", code: "PCS", name: "Pcs", symbol: "pcs", category: "count", factor: 1 },
  { id: "uom-7", code: "PACK", name: "Pack", symbol: "pack", category: "count", factor: 1 },
];

interface TempRecipeItem {
  ingredientId: string;
  quantity: number;
  recipeUnit: string;
}

const MOCK_INGREDIENTS = [
  { id: "ing-1", name: "Tepung Terigu", stockUnit: "kg", cost: 12000 },
  { id: "ing-2", name: "Mentega Blok", stockUnit: "kg", cost: 80000 },
  { id: "ing-3", name: "Ragi Instan", stockUnit: "g", cost: 200 },
  { id: "ing-4", name: "Gula Pasir", stockUnit: "kg", cost: 15000 },
  { id: "ing-5", name: "Telur Ayam", stockUnit: "butir", cost: 2000 },
  { id: "ing-6", name: "Susu UHT", stockUnit: "l", cost: 18000 },
  { id: "ing-7", name: "Air Dingin", stockUnit: "l", cost: 1000 },
  { id: "ing-8", name: "Box Karton Roti", stockUnit: "pcs", cost: 1500 },
  { id: "ing-9", name: "Plastik Kemasan", stockUnit: "pcs", cost: 300 },
  { id: "ing-10", name: "Stiker Logo Brand", stockUnit: "pcs", cost: 200 },
];

export const MOCK_RECIPE_HISTORY: Record<string, {
  version: number;
  date: string;
  note: string;
  cost: number;
  items: { name: string; qty: number; unit: string }[];
}[]> = {
  "prod-1": [
    {
      version: 2,
      date: "2026-06-10T09:00:00Z",
      note: "Penyesuaian takaran ragi instan biar lebih mengembang sempurna",
      cost: 9200,
      items: [
        { name: "Tepung Terigu", qty: 500, unit: "g" },
        { name: "Gula Pasir", qty: 50, unit: "g" },
        { name: "Ragi Instan", qty: 11, unit: "g" },
      ],
    },
    {
      version: 1,
      date: "2026-05-24T14:30:00Z",
      note: "Resep pertama kali rilis untuk soft opening",
      cost: 8500,
      items: [
        { name: "Tepung Terigu", qty: 500, unit: "g" },
        { name: "Gula Pasir", qty: 40, unit: "g" },
      ],
    },
  ],
  "prod-2": [
    {
      version: 2,
      date: "2026-06-12T11:00:00Z",
      note: "Peningkatan mutu bahan baku ke tepung terigu protein tinggi",
      cost: 13500,
      items: [
        { name: "Tepung Terigu Hard", qty: 600, unit: "g" },
        { name: "Garam", qty: 12, unit: "g" },
        { name: "Mentega Blok", qty: 50, unit: "g" },
      ],
    },
    {
      version: 1,
      date: "2026-05-25T08:00:00Z",
      note: "Resep standar awal baguette",
      cost: 11000,
      items: [
        { name: "Tepung Terigu Hard", qty: 500, unit: "g" },
        { name: "Ragi Kering", qty: 8, unit: "g" },
      ],
    },
  ],
  "prod-3": [
    {
      version: 1,
      date: "2026-06-01T10:00:00Z",
      note: "Resep standard awal Croissant Almond",
      cost: 14500,
      items: [
        { name: "Tepung Terigu", qty: 500, unit: "g" },
        { name: "Mentega Blok", qty: 250, unit: "g" },
      ],
    },
  ],
};

export default function RecipeManageModal({
  open,
  onClose,
  product,
  onActivateVersion,
}: RecipeManageModalProps) {
  if (!product) return null;


  const [activeSubTab, setActiveSubTab] = useState<"edit" | "history">("edit");
  const [notes, setNotes] = useState("");
  const [estimatedYield, setEstimatedYield] = useState<number>(1);
  const [items, setItems] = useState<TempRecipeItem[]>([
    { ingredientId: "ing-1", quantity: 500, recipeUnit: "g" },
  ]);
  const [packagingItems, setPackagingItems] = useState<TempRecipeItem[]>([
    { ingredientId: "ing-8", quantity: 1, recipeUnit: "pcs" },
  ]);
  const [targetMarkup, setTargetMarkup] = useState<number>(150); // 150% default markup

  useEffect(() => {
    if (open) {
      setActiveSubTab("edit");
      setNotes(`Formula baru untuk ${product.name}`);
      setEstimatedYield(product.stock_qty || 10);
      setItems([
        { ingredientId: "ing-1", quantity: 500, recipeUnit: "g" },
        { ingredientId: "ing-4", quantity: 50, recipeUnit: "g" },
      ]);
      setPackagingItems([
        { ingredientId: "ing-8", quantity: 1, recipeUnit: "pcs" },
      ]);
      setTargetMarkup(150);
    }
  }, [open, product]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { ingredientId: "", quantity: 0, recipeUnit: "" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<TempRecipeItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const getConversionFactor = (fromSymbol: string, toSymbol: string): number => {
    const fromUom = MOCK_UOMS.find((u) => u.symbol.toLowerCase() === fromSymbol.toLowerCase());
    const toUom = MOCK_UOMS.find((u) => u.symbol.toLowerCase() === toSymbol.toLowerCase());
    if (!fromUom || !toUom) return 1;
    if (fromUom.category !== toUom.category) return 1;
    return fromUom.factor / toUom.factor;
  };

  const getCompatibleUnits = (ingredientId: string): Uom[] => {
    const ing = MOCK_INGREDIENTS.find((i) => i.id === ingredientId);
    if (!ing) return [];
    const stockUom = MOCK_UOMS.find((u) => u.symbol.toLowerCase() === ing.stockUnit.toLowerCase());
    if (!stockUom) return [];
    return MOCK_UOMS.filter((u) => u.category === stockUom.category);
  };

  const handleIngredientChange = (index: number, ingredientId: string) => {
    const selected = MOCK_INGREDIENTS.find((i) => i.id === ingredientId);
    if (selected) {
      handleUpdateItem(index, {
        ingredientId,
        recipeUnit: selected.stockUnit,
      });
    }
  };

  const handleAddPackagingItem = () => {
    setPackagingItems((prev) => [
      ...prev,
      { ingredientId: "", quantity: 1, recipeUnit: "pcs" },
    ]);
  };

  const handleRemovePackagingItem = (index: number) => {
    setPackagingItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdatePackagingItem = (index: number, updates: Partial<TempRecipeItem>) => {
    setPackagingItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handlePackagingIngredientChange = (index: number, ingredientId: string) => {
    const selected = MOCK_INGREDIENTS.find((i) => i.id === ingredientId);
    if (selected) {
      handleUpdatePackagingItem(index, {
        ingredientId,
        recipeUnit: selected.stockUnit,
      });
    }
  };

  // Calculations
  const totalBatchCost = items.reduce((sum, item) => {
    const ing = MOCK_INGREDIENTS.find((i) => i.id === item.ingredientId);
    if (!ing) return sum;
    const factor = getConversionFactor(item.recipeUnit, ing.stockUnit);
    return sum + (item.quantity * factor * ing.cost);
  }, 0);
  const costPerProductUnit = estimatedYield > 0 ? totalBatchCost / estimatedYield : 0;

  const totalPackagingCostPerUnit = packagingItems.reduce((sum, item) => {
    const ing = MOCK_INGREDIENTS.find((i) => i.id === item.ingredientId);
    if (!ing) return sum;
    const factor = getConversionFactor(item.recipeUnit, ing.stockUnit);
    return sum + (item.quantity * factor * ing.cost);
  }, 0);

  const finalHppPerUnit = costPerProductUnit + totalPackagingCostPerUnit;

  const rawRecommendedPrice = finalHppPerUnit * (1 + targetMarkup / 100);
  const recommendedPrice = Math.round(rawRecommendedPrice / 500) * 500;

  const handleSave = () => {
    if (items.some((item) => !item.ingredientId || item.quantity <= 0)) {
      toast.error("Semua bahan baku dan jumlahnya harus diisi!");
      return;
    }
    if (packagingItems.some((item) => !item.ingredientId || item.quantity <= 0)) {
      toast.error("Semua bahan kemasan dan jumlahnya harus diisi!");
      return;
    }
    toast.success(`Resep untuk "${product.name}" berhasil disimpan dengan Rekomendasi Harga Jual ${formatRupiah(recommendedPrice)} (Mock)`);
    onClose();
  };

  const handleActivateVersion = (version: number) => {
    if (onActivateVersion) {
      onActivateVersion(version);
      toast.success(`Resep Versi ${version} berhasil diaktifkan sebagai formula aktif!`);
    } else {
      toast.error("Gagal mengaktifkan resep.");
    }
  };

  const historyItems = MOCK_RECIPE_HISTORY[product.id] || [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[80dvh] md:max-h-[85vh] flex flex-col justify-between overflow-hidden p-0 rounded-2xl shadow-xl border border-slate-100">
        <DialogHeader className="p-4 sm:p-5 pb-3 sm:pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <ChefHat className="text-brand-primary" size={18} />
            <DialogTitle className="text-base font-extrabold text-slate-800">Kelola Resep — {product.name}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-400">
            Tentukan komposisi bahan baku untuk menghitung estimasi biaya HPP secara berkala.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex px-4 sm:px-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <button
            onClick={() => setActiveSubTab("edit")}
            className={cn(
              "px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer",
              activeSubTab === "edit"
                ? "border-brand-primary text-brand-primary font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Formulir Komposisi
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={cn(
              "px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
              activeSubTab === "history"
                ? "border-brand-primary text-brand-primary font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <Clock size={12} />
            <span>Riwayat Versi ({historyItems.length})</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 py-4 min-h-0">
          {activeSubTab === "edit" ? (
            <div className="flex flex-col gap-4">
              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Catatan Perubahan Versi
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Mengurangi ragi karena suhu ruangan naik"
                  className="text-xs py-2 bg-white"
                />
              </div>

              {/* Yield */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimasi Hasil per Batch
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={estimatedYield || ""}
                    onChange={(e) => setEstimatedYield(Number(e.target.value))}
                    placeholder="Jumlah produk jadi"
                    className="w-40 text-xs py-2 bg-white"
                  />
                  <Badge variant="outline" className="text-xs py-1.5 px-3 bg-slate-100 border-slate-200 text-slate-600 font-bold uppercase">
                    {product.unit_symbol}
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Berapa banyak unit {product.unit_name} yang dihasilkan dari satu resep ini.
                </span>
              </div>

              {/* Recipe Items */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Bahan-bahan Komposisi
                </label>

                <div className="flex flex-col gap-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:border-slate-200 transition-colors shadow-2xs">
                      {/* Ingredient Select */}
                      <div className="w-full sm:flex-1 min-w-0">
                        <Select
                          value={item.ingredientId}
                          onValueChange={(val) => handleIngredientChange(idx, val)}
                        >
                          <SelectTrigger className="w-full bg-white text-xs py-1">
                            <SelectValue placeholder="Pilih Bahan Baku" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_INGREDIENTS.map((ing) => (
                              <SelectItem key={ing.id} value={ing.id} className="text-xs">
                                {ing.name} (Rp {ing.cost.toLocaleString()}/{ing.stockUnit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Qty, Unit & Trash row for mobile spacing */}
                      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-between">
                        {/* Qty Input */}
                        <div className="flex-1 sm:w-20">
                          <Input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => handleUpdateItem(idx, { quantity: Number(e.target.value) })}
                            placeholder="Qty"
                            className="bg-white text-center text-xs p-1 h-9 w-full"
                          />
                        </div>

                        {/* Unit Select */}
                        <div className="w-24 sm:w-20 shrink-0">
                          <Select
                            value={item.recipeUnit}
                            onValueChange={(val) => handleUpdateItem(idx, { recipeUnit: val })}
                            disabled={!item.ingredientId}
                          >
                            <SelectTrigger className="w-full bg-white text-xs py-1 h-9">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCompatibleUnits(item.ingredientId).map((u) => (
                                <SelectItem key={u.id} value={u.symbol} className="text-xs">
                                  {u.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length <= 1}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent shrink-0"
                          title="Hapus Bahan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={12} />}
                  onClick={handleAddItem}
                  className="mt-2 self-start text-xs border-dashed border-slate-200 hover:border-brand-accent hover:text-brand-primary hover:bg-brand-primary/5 bg-white"
                >
                  Tambah Bahan Komposisi
                </Button>
              </div>

              {/* Packaging Items Section */}
              <div className="flex flex-col gap-2 mt-4 border-t border-slate-100 pt-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Kemasan & Bahan Pembantu
                  </label>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Masukkan kemasan yang digunakan langsung per satu unit produk {product.unit_symbol}.
                  </span>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  {packagingItems.map((item, idx) => (
                    <div key={`pkg-${idx}`} className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:border-slate-200 transition-colors shadow-2xs">
                      {/* Packaging Ingredient Select */}
                      <div className="w-full sm:flex-1 min-w-0">
                        <Select
                          value={item.ingredientId}
                          onValueChange={(val) => handlePackagingIngredientChange(idx, val)}
                        >
                          <SelectTrigger className="w-full bg-white text-xs py-1">
                            <SelectValue placeholder="Pilih Kemasan" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_INGREDIENTS.filter(ing => ["ing-8", "ing-9", "ing-10"].includes(ing.id) || ing.stockUnit === "pcs").map((ing) => (
                              <SelectItem key={ing.id} value={ing.id} className="text-xs">
                                {ing.name} (Rp {ing.cost.toLocaleString()}/{ing.stockUnit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Qty & Unit select */}
                      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-between">
                        <div className="flex-1 sm:w-20">
                          <Input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => handleUpdatePackagingItem(idx, { quantity: Number(e.target.value) })}
                            placeholder="Qty"
                            className="bg-white text-center text-xs p-1 h-9 w-full"
                          />
                        </div>

                        <div className="w-24 sm:w-20 shrink-0">
                          <Select
                            value={item.recipeUnit}
                            onValueChange={(val) => handleUpdatePackagingItem(idx, { recipeUnit: val })}
                            disabled={!item.ingredientId}
                          >
                            <SelectTrigger className="w-full bg-white text-xs py-1 h-9">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCompatibleUnits(item.ingredientId).map((u) => (
                                <SelectItem key={u.id} value={u.symbol} className="text-xs">
                                  {u.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemovePackagingItem(idx)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors shrink-0"
                          title="Hapus Kemasan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={12} />}
                  onClick={handleAddPackagingItem}
                  className="mt-1 self-start text-xs border-dashed border-slate-200 hover:border-brand-accent hover:text-brand-primary hover:bg-brand-primary/5 bg-white"
                >
                  Tambah Kemasan / Wadah
                </Button>
              </div>
            </div>
          ) : (
            /* Version History Timeline View */
            <div className="flex flex-col gap-4 py-2">
              {historyItems.length > 0 ? (
                historyItems.map((hist) => (
                  <div
                    key={hist.version}
                    className="relative pl-6 border-l-2 border-slate-100 last:border-l-0 pb-6 last:pb-0"
                  >
                    {/* Timeline circle */}
                    <div className={cn(
                      "absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white transition-all duration-300",
                      hist.version === product.active_recipe_version
                        ? "border-brand-accent ring-4 ring-brand-primary/10 bg-brand-primary"
                        : "border-slate-300"
                    )} />

                    <div className={cn(
                      "rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all duration-150 border",
                      hist.version === product.active_recipe_version
                        ? "bg-gradient-to-br from-white via-white to-brand-primary/[0.02] border-brand-accent shadow-xs ring-1 ring-brand-accent/25"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    )}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-slate-800">Versi {hist.version}</span>
                          {hist.version === product.active_recipe_version ? (
                            <Badge variant="success" className="text-[8px] py-0 px-1 font-bold">Aktif</Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => handleActivateVersion(hist.version)}
                              className="text-[9px] font-bold border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white cursor-pointer h-5 px-2 py-0"
                            >
                              Aktifkan Versi Ini
                            </Button>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{formatDate(hist.date)}</span>
                      </div>

                      <p className="text-xs text-slate-500 leading-normal mb-3">"{hist.note}"</p>

                      <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100/50 mb-3.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">HPP Hasil Produksi</span>
                        <span className="text-xs font-black text-slate-800">{formatRupiah(hist.cost)}</span>
                      </div>

                      {/* Detail list */}
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-2">Komposisi Bahan Baku</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {hist.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-0.5 border-b border-slate-100/50 sm:border-0">
                              <span className="font-medium text-slate-500">{it.name}</span>
                              <span className="font-bold text-slate-700">{it.qty} {it.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-xs text-slate-400 italic bg-slate-50/50 border border-dashed rounded-xl p-6">
                  Belum ada log riwayat perubahan formula untuk resep ini.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Calculations footer & actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0 rounded-b-xl">
          {activeSubTab === "edit" ? (
            <>
              {/* Markup Input Row */}
              <div className="flex items-center justify-between gap-4 mb-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Markup (%)</label>
                  <span className="text-[9px] text-slate-400 font-medium">Persentase kenaikan harga jual dari total HPP modal.</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Input
                    type="number"
                    value={targetMarkup || ""}
                    onChange={(e) => setTargetMarkup(Math.max(0, Number(e.target.value)))}
                    placeholder="150"
                    className="w-20 text-center text-xs h-8 bg-slate-50 border-slate-200 font-bold"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>

              {/* Summary calculations */}
              <div className="grid grid-cols-3 gap-2.5 text-center mb-4 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col border-r border-slate-100 justify-between py-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total HPP / {product.unit_symbol}</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5">
                    {formatRupiah(finalHppPerUnit)}
                  </span>
                  <span className="text-[8px] text-slate-400 font-medium mt-0.5">
                    ({formatRupiah(costPerProductUnit)} bhn + {formatRupiah(totalPackagingCostPerUnit)} kms)
                  </span>
                </div>
                <div className="flex flex-col border-r border-slate-100 justify-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Markup</span>
                  <span className="text-xs font-extrabold text-slate-700 mt-1">
                    +{targetMarkup}%
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Rekomendasi Harga</span>
                  <span className="text-xs font-black text-green-600 mt-1">
                    {formatRupiah(recommendedPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  Simpan Resep Baru
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose} className="px-5">
                Tutup
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
