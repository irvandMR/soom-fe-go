import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type DataMeta } from "./useDataQuery";
import { cn } from "@/lib/utils";

interface PaginationProps {
  meta: DataMeta;
  page: number;
  onPageChange: (p: number) => void;
  isLoading?: boolean;
  className?: string;
}

export default function Pagination({
  meta,
  page,
  onPageChange,
  isLoading,
  className,
}: PaginationProps) {
  const { total, limit, total_pages } = meta;

  if (total === 0) return null;

  const pageNumbers = Array.from({ length: total_pages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === total_pages || Math.abs(p - page) <= 1)
    .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 flex-wrap",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {(page - 1) * limit + 1}–{Math.min(page * limit, total)}
        </span>{" "}
        dari <span className="font-medium text-foreground">{total}</span> data
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          icon={<ChevronLeft size={14} />}
          iconOnly
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Sebelumnya
        </Button>

        {pageNumbers.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="px-1 text-xs text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon-sm"
              disabled={isLoading}
              onClick={() => onPageChange(p as number)}
              className="text-xs min-w-[28px]"
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon-sm"
          icon={<ChevronRight size={14} />}
          iconOnly
          disabled={page >= total_pages || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
