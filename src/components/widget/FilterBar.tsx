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
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, val: string) => void;
  onReset: () => void;
  className?: string;
  allOptionLabel?: string;
}

export default function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onReset,
  className,
  allOptionLabel = "Semua",
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const activeCount = Object.keys(activeFilters).length;
  const { isMobile } = useBreakpoint();

  const renderFilters = () => (
    <>
      {filters.map((f) => (
        <div key={f.key} className="flex flex-col gap-1.5 min-w-[150px]">
          <Select
            value={activeFilters[f.key] ?? ""}
            onValueChange={(val) =>
              onFilterChange(f.key, val === "__all__" ? "" : val)
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={allOptionLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua</SelectItem>
              {f.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {activeCount > 0 && (
        <div className="flex items-end pb-0.5">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* ✅ MOBILE → pakai button */}
      {isMobile && (
        <>
          <Button
            variant="outline"
            size="sm"
            icon={<SlidersHorizontal size={13} />}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "w-auto",
              activeCount > 0 &&
                "border-[var(--fandm-primary)] text-[var(--fandm-primary)]",
            )}
          >
            Filter
            {activeCount > 0 && (
              <span className="ml-1 size-4 rounded-full bg-[var(--fandm-primary)] text-white text-[9px] flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>

          {open && renderFilters()}
        </>
      )}

      {/* ✅ DESKTOP → langsung tampil */}
      {!isMobile && (
        <div className="flex flex-wrap items-end gap-3 p-3 ">
          {renderFilters()}
        </div>
      )}
    </div>
  );
}
