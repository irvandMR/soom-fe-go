import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarCheck, ChevronRight } from "lucide-react";
import type { Ingredients, StockInHistoryItem } from "@/types/ingredients.type";
import { formatRupiah } from "@/utils/format";
import { useState, useMemo } from "react";
import { useIngredientHistoryQuery } from "@/components/features/ingredient/useIngredientQuery";
import { useUpdateIngredient } from "@/components/features/ingredient/useIngredientMutation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";

// ── Helper: format tanggal ─────────────────────────────────────────────────
function formatDate(isoString: string) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

interface FormModalEditIngredientProps {
  open: boolean;
  onClose: () => void;
  ingredientData?: Ingredients | null;
}

type EditStep = "select-date" | "edit-form";

export default function FormModalEditIngredient({
  open,
  onClose,
  ingredientData,
}: FormModalEditIngredientProps) {
  const { data, isLoading } = useIngredientHistoryQuery(
    open ? (ingredientData?.id ?? null) : null
  );

  const historyItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  }, [data]);
  const { mutate: updateIngredient, isPending } = useUpdateIngredient({
    onSuccess: handleClose,
  });
  const [step, setStep] = useState<EditStep>("select-date");
  const [selectedHistory, setSelectedHistory] =
    useState<StockInHistoryItem | null>(null);

  // Form state
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);

  // Harga per unit auto-calculate
  const pricePerUnit = useMemo(() => {
    if (!selectedHistory) return null;
    if (selectedHistory.quantity > 0 && purchasePrice > 0)
      return purchasePrice / selectedHistory.quantity;
    return null;
  }, [selectedHistory, purchasePrice]);

  const handleSelectHistory = (item: StockInHistoryItem) => {
    setSelectedHistory(item);
    setPurchasePrice(item.purchase_price);
    setMinStock(ingredientData?.min_stock ?? 0);
    setStep("edit-form");
  };

  const handleBack = () => {
    setStep("select-date");
    setSelectedHistory(null);
    setPurchasePrice(0);
    setMinStock(0);
  };

  function handleClose() {
    setStep("select-date");
    setSelectedHistory(null);
    setPurchasePrice(0);
    setMinStock(0);
    onClose();
  }

  const handleSubmit = () => {
    if (!selectedHistory || !ingredientData) return;
    const payload = {
      id: ingredientData.id,
      category_id: ingredientData.category_id,
      unit_id: ingredientData.unit_id,
      name: ingredientData.name,
      min_stock: minStock,
      is_active: ingredientData.is_active,
      purchase_price: purchasePrice,
      history_id: selectedHistory.id,
    };
    updateIngredient(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0">
        {/* ── Header ─────────────────────────────────────────── */}
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2 pr-6">
            {step === "edit-form" && (
              <button
                onClick={handleBack}
                className="p-1 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors shrink-0"
              >
                <ChevronRight size={14} className="rotate-180" />
              </button>
            )}
            <div className="flex flex-col gap-0.5">
              <DialogTitle>
                {step === "select-date"
                  ? "Pilih Tanggal Stock In"
                  : "Edit Harga Beli"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                <strong>{ingredientData?.name}</strong> ·{" "}
                <Badge variant="info">{ingredientData?.unit_symbol}</Badge>
              </DialogDescription>
            </div>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === "select-date"
                    ? "bg-[var(--fandm-primary)] text-white"
                    : "bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
                  }`}
              >
                1
              </span>
              <span
                className={`text-xs transition-colors ${step === "select-date"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                  }`}
              >
                Pilih Tanggal
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === "edit-form"
                    ? "bg-[var(--fandm-primary)] text-white"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                2
              </span>
              <span
                className={`text-xs transition-colors ${step === "edit-form"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                  }`}
              >
                Edit Harga
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* ── Step 1: Pilih tanggal ──────────────────────────── */}
        {step === "select-date" && (
          <ScrollArea className="max-h-[calc(90vh-12rem)] px-4 py-3">
            <div className="flex flex-col gap-2 pb-2">
              <p className="text-xs text-muted-foreground mb-1">
                Pilih satu transaksi yang ingin diedit harga belinya.
              </p>

              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="rounded-xl border border-border p-3 flex flex-col gap-2 animate-pulse"
                  >
                    <div className="h-3 w-36 rounded bg-muted" />
                    <div className="h-4 w-24 rounded bg-muted" />
                  </div>
                ))
              ) : historyItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <span className="p-3 rounded-full bg-muted/60">
                    <CalendarCheck size={20} className="text-muted-foreground" />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Belum ada riwayat stock masuk
                  </p>
                </div>
              ) : (
                historyItems.map((item, index) => (
                  <button
                    key={item.id ?? `item-${index}`}
                    onClick={() => handleSelectHistory(item)}
                    className="group w-full text-left rounded-xl border border-border bg-background hover:border-[var(--fandm-primary)]/40 hover:bg-[var(--fandm-primary)]/5 active:scale-[0.99] transition-all duration-150 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[var(--status-info-bg)] text-[var(--status-info-text)] flex items-center justify-center text-[10px] font-bold shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <ChevronRight
                        size={13}
                        className="text-muted-foreground group-hover:text-[var(--fandm-primary)] transition-colors"
                      />
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          Harga Beli
                        </span>
                        <span className="text-sm font-semibold">
                          {formatRupiah(item.purchase_price)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          Jumlah
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Badge variant="info">
                            {ingredientData?.unit_symbol}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {item.notes && (
                      <div className="px-3 pb-2">
                        <p className="text-[10px] text-muted-foreground italic truncate">
                          📝 {item.notes}
                        </p>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        )}

        {/* ── Step 2: Edit form ─────────────────────────────── */}
        {step === "edit-form" && selectedHistory && (
          <>
            <ScrollArea className="max-h-[calc(90vh-12rem)] px-4 py-3">
              <div className="flex flex-col gap-4 pb-2">
                {/* Info transaksi terpilih */}
                <div className="px-3 py-2.5 rounded-xl bg-[var(--status-info-bg)] border border-[var(--status-info-text)]/20 flex items-center gap-2">
                  <CalendarCheck
                    size={13}
                    className="text-[var(--status-info-text)] shrink-0"
                  />
                  <p className="text-xs text-[var(--status-info-text)]">
                    Transaksi:{" "}
                    <strong>{formatDate(selectedHistory.created_at)}</strong>
                  </p>
                </div>

                {/* ── Field disable: Nama bahan baku ── */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--fandm-text)]">
                    Nama Bahan Baku
                    <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                      (tidak dapat diubah)
                    </span>
                  </label>
                  <Input
                    value={ingredientData?.name ?? ""}
                    disabled
                    className="disabled:opacity-60"
                  />
                </div>

                {/* ── Field disable: Jumlah (quantity) ── */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--fandm-text)]">
                    Jumlah Stock
                    <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                      (tidak dapat diubah)
                    </span>
                  </label>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      value={selectedHistory.quantity}
                      disabled
                      className="disabled:opacity-60"
                    />
                    <InputGroupAddon align="inline-end">
                      {ingredientData?.unit_symbol}
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                {/* ── Field AKTIF: Minimum Stock ── */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--fandm-text)]">
                    Minimum Stock
                    <Badge variant="success" className="ml-1.5">
                      Dapat diubah
                    </Badge>
                  </label>
                  <InputGroup className="focus-within:ring-ring/50 focus-within:ring-3 focus-within:border-ring transition-colors rounded-lg overflow-hidden">
                    <InputGroupInput
                      type="number"
                      value={minStock || ""}
                      onChange={(e) => setMinStock(Number(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <InputGroupAddon align="inline-end">
                      {ingredientData?.unit_symbol}
                    </InputGroupAddon>
                  </InputGroup>
                  {ingredientData && minStock !== ingredientData.min_stock && (
                    <p className="text-[10px] text-[var(--status-warning-text)]">
                      * Akan mengubah minimum stock bahan baku (sebelumnya {ingredientData.min_stock})
                    </p>
                  )}
                </div>

                {/* ── Field disable: Catatan ── */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--fandm-text)]">
                    Catatan
                    <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                      (tidak dapat diubah)
                    </span>
                  </label>
                  <Input
                    value={selectedHistory.notes ?? "-"}
                    disabled
                    className="disabled:opacity-60"
                  />
                </div>

                {/* ── Field AKTIF: Harga Beli ── */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--fandm-text)]">
                    Harga Beli
                    <Badge variant="success" className="ml-1.5">
                      Dapat diubah
                    </Badge>
                  </label>
                  <div className="flex h-8 w-full rounded-lg border border-input bg-transparent text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 overflow-hidden">
                    <span className="flex items-center px-2.5 bg-muted/50 border-r border-input text-muted-foreground text-xs font-medium shrink-0 select-none">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={purchasePrice}
                      onChange={(e) =>
                        setPurchasePrice(Number(e.target.value) || 0)
                      }
                      className="flex-1 min-w-0 px-2.5 py-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Preview harga per unit */}
                  {pricePerUnit !== null && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--status-info-bg)] border border-[var(--status-info-text)]/20 mt-0.5">
                      <span className="text-xs text-[var(--status-info-text)]">
                        Harga per{" "}
                        <strong>{ingredientData?.unit_symbol ?? "unit"}</strong>
                      </span>
                      <span className="text-xs font-semibold text-[var(--status-info-text)]">
                        {formatRupiah(pricePerUnit)}
                      </span>
                    </div>
                  )}

                  {/* Perubahan harga */}
                  {purchasePrice !== selectedHistory.purchase_price && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--status-warning-bg)] border border-[var(--status-warning-text)]/20 mt-0.5">
                      <span className="text-xs text-[var(--status-warning-text)]">
                        Sebelumnya
                      </span>
                      <span className="text-xs font-semibold text-[var(--status-warning-text)] line-through">
                        {formatRupiah(selectedHistory.purchase_price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* ── Footer ─────────────────────────────────────── */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Kembali
              </Button>
              <Button
                type="button"
                disabled={purchasePrice <= 0 || isPending}
                onClick={handleSubmit}
              >
                {isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
