import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Ingredients } from "@/types/ingredients.type";
import { formatRupiah, formatDateLong, formatTime } from "@/utils/format";
import {
  CalendarIcon,
  ClockIcon,
  ReceiptIcon,
  StickyNoteIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIngredientHistoryQuery } from "@/components/features/ingredient/useIngredientQuery";

interface ModalHistoryIngredientProps {
  open: boolean;
  onClose: () => void;
  ingredientData?: Ingredients | null;
}


export default function ModalHistoryIngredient({
  open,
  onClose,
  ingredientData,
}: ModalHistoryIngredientProps) {
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  const { data, isLoading, isError, error } = useIngredientHistoryQuery(
    open ? (ingredientData?.id ?? null) : null,
    filterDateFrom || undefined,
    filterDateTo || undefined
  );

  let messageErroRangeMonth = "";
  if (isError) {
    messageErroRangeMonth = (error as any)?.response?.data?.message || error?.message;
  }

  const historyItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  }, [data]);

  const handleClearFilter = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0">
        {/* ── Header ─────────────────────────────────────────── */}
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          <div className="flex items-start gap-2 pr-6">
            <span className="p-1.5 rounded-lg bg-[var(--status-info-bg)] text-[var(--status-info-text)] shrink-0">
              <ReceiptIcon size={14} />
            </span>
            <div className="flex flex-col gap-0.5">
              <DialogTitle>Riwayat Stock Masuk</DialogTitle>
              <DialogDescription className="text-xs">
                <strong>{ingredientData?.name}</strong> ·{" "}
                <Badge variant="info">{ingredientData?.unit_symbol}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Filter tanggal ─────────────────────────────────── */}
        <div className="px-4 py-3 border-b border-border shrink-0 bg-muted/30">
          <div className="flex items-center gap-2">
            <CalendarIcon
              size={13}
              className="text-muted-foreground shrink-0"
            />
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              Filter Tanggal
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                Dari
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                Sampai
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                min={filterDateFrom}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
            {(filterDateFrom || filterDateTo) && (
              <button
                onClick={handleClearFilter}
                className="mt-4 self-end h-8 px-2.5 rounded-md text-xs text-muted-foreground border border-input hover:bg-muted/60 transition-colors shrink-0"
              >
                Reset
              </button>
            )}
          </div>

          {isError && <div className="text-xs text-red-500">{messageErroRangeMonth}</div>}
        </div>

        {/* ── List history ──────────────────────────────────────── */}
        <ScrollArea className="max-h-[calc(90vh-16rem)] px-4 py-3">
          <div className="flex flex-col gap-2.5 pb-2">
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="rounded-xl border border-border bg-muted/20 p-3 flex flex-col gap-2 animate-pulse"
                >
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted" />
                </div>
              ))
            ) : historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                <span className="p-3 rounded-full bg-muted/60">
                  <ReceiptIcon size={20} className="text-muted-foreground" />
                </span>
                <p className="text-sm font-medium text-muted-foreground">
                  {!filterDateFrom && !filterDateTo
                    ? "Belum ada riwayat stock masuk"
                    : "Tidak ada data pada rentang tanggal ini"}
                </p>
                {(filterDateFrom || filterDateTo) && (
                  <button
                    onClick={handleClearFilter}
                    className="text-xs text-[var(--status-info-text)] hover:underline"
                  >
                    Hapus filter
                  </button>
                )}
              </div>
            ) : (
              historyItems.map((item, index) => (
                <div
                  key={item.id ?? `item-${index}`}
                  className="group rounded-xl border border-border bg-background hover:border-[var(--fandm-primary)]/30 hover:bg-[var(--fandm-primary)]/5 transition-all duration-150 overflow-hidden"
                >
                  {/* Header card */}
                  <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--status-info-bg)] text-[var(--status-info-text)] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon size={11} />
                        <span>{formatDateLong(item.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ClockIcon size={10} />
                      <span>{formatTime(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Body card */}
                  <div className="px-3 pb-3 pt-2 flex flex-col gap-2">
                    {/* Harga & Qty */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          Harga Beli
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {formatRupiah(item.purchase_price)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          Jumlah
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <Badge variant="info">
                            {ingredientData?.unit_symbol}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Harga per unit */}
                    {item.purchase_price != null && item.purchase_price > 0 && item.quantity > 0 && (
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[var(--status-info-bg)]/60 border border-[var(--status-info-text)]/15">
                        <span className="text-[10px] text-[var(--status-info-text)]">
                          Harga per {ingredientData?.unit_symbol ?? "unit"}
                        </span>
                        <span className="text-xs font-semibold text-[var(--status-info-text)]">
                          {formatRupiah(item.purchase_price / item.quantity)}
                        </span>
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="flex items-start gap-1.5 mt-0.5">
                        <StickyNoteIcon
                          size={11}
                          className="text-muted-foreground shrink-0 mt-0.5"
                        />
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* ── Footer summary ──────────────────────────────────── */}
        {historyItems.length > 0 && !isLoading && (
          <div className="px-4 py-3 border-t border-border bg-muted/30 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Total {historyItems.length} transaksi
              </span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Total belanja:</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(
                    historyItems.reduce((sum, item) => sum + item.purchase_price, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
