import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface FilterBarProps {
  /** Daftar filter dropdown (status, kategori, dll) */
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, val: string) => void;
  onReset: () => void;
  className?: string;
  allOptionLabel?: string;

  /** Opsional: filter tanggal */
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (val: string) => void;
  onEndDateChange?: (val: string) => void;
}

export default function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onReset,
  className,
  allOptionLabel,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useBreakpoint();

  const hasDate = onStartDateChange !== undefined && onEndDateChange !== undefined;
  const activeFilterCount = Object.keys(activeFilters).length;
  const activeDateCount = (startDate ? 1 : 0) + (endDate ? 1 : 0);
  const totalActive = activeFilterCount + activeDateCount;

  // ── Shared: status filter dropdowns ───────────────────────────────────────
  const renderDropdowns = (stretch = false) => (
    <>
      {filters.map((f) => (
        <Select
          key={f.key}
          value={activeFilters[f.key] ?? ""}
          onValueChange={(val) =>
            onFilterChange(f.key, val === "__all__" ? "" : val)
          }
        >
          <SelectTrigger
            className={cn(
              "h-8 text-xs border-white/20 bg-white/10 text-[var(--fandm-text-secondary)] data-placeholder:text-white",
              stretch ? "flex-1" : "min-w-[130px] max-w-[180px]",
            )}
            iconClassName="text-white"
          >
            <SelectValue className="h-8 text-xs" placeholder={allOptionLabel || f.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{allOptionLabel || `Semua ${f.label}`}</SelectItem>
            {f.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </>
  );

  // ── Shared: date range grid (mobile) ──────────────────────────────────────
  const renderDateGrid = () =>
    hasDate ? (
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/50">Dari</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange!(e.target.value)}
            className="w-full h-9 px-2 text-xs border rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/50">Sampai</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange!(e.target.value)}
            className="w-full h-9 px-2 text-xs border rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    ) : null;

  // ── Shared: date range inline (desktop) ───────────────────────────────────
  const renderDateInline = () =>
    hasDate ? (
      <>
        <span className="text-xs text-white/40">|</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange!(e.target.value)}
          className="h-9 px-2 text-xs border rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          title="Dari tanggal"
        />
        <span className="text-xs text-white/50">s/d</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange!(e.target.value)}
          className="h-9 px-2 text-xs border rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          title="Sampai tanggal"
        />
      </>
    ) : null;

  // ── Reset button ──────────────────────────────────────────────────────────
  const renderReset = (onClose?: () => void) =>
    totalActive > 0 ? (
      <button
        onClick={() => {
          onReset();
          onClose?.();
        }}
        className="self-start text-[11px] text-white/50 hover:text-white underline underline-offset-2 cursor-pointer"
      >
        Reset semua filter
      </button>
    ) : null;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MOBILE layout
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isMobile) {
    return (
      <div className={cn("flex flex-col gap-0", open ? "w-full" : "w-auto", className)}>
        {/* Toggle button */}
        <Button
          variant={totalActive > 0 || open ? "default" : "outline-secondary"}
          size="sm"
          className="h-9 px-3 shrink-0 gap-1.5 text-white text-xs self-end"
          onClick={() => setOpen((v) => !v)}
        >
          <SlidersHorizontal size={13} />
          Filter
          {totalActive > 0 && (
            <span className="size-4 rounded-full bg-white/30 text-white text-[9px] flex items-center justify-center font-bold">
              {totalActive}
            </span>
          )}
        </Button>

        {/* Expandable panel */}
        {open && (
          <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-white/10">
            {/* Status dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {renderDropdowns(true)}
            </div>

            {/* Date range (optional) */}
            {renderDateGrid()}

            {/* Reset */}
            {renderReset(() => setOpen(false))}
          </div>
        )}
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DESKTOP layout — semua inline satu baris
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {renderDropdowns()}
      {renderDateInline()}
      {totalActive > 0 && (
        <button
          onClick={onReset}
          className="text-xs text-white/50 hover:text-white underline underline-offset-2 cursor-pointer"
        >
          Reset
        </button>
      )}
    </div>
  );
}
