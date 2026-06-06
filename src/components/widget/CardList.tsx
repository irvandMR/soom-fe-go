import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardListProps<T> {
  rows: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
  className?: string;
}

// Skeleton default untuk loading state
function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--fandm-border)] p-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-[40%]" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-[60%]" />
    </div>
  );
}

export default function CardList<T = Record<string, unknown>>({
  rows,
  renderItem,
  isLoading,
  isError,
  skeletonCount = 5,
  emptyMessage = "Belum ada data.",
  className,
}: CardListProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-sm text-destructive">
        Gagal memuat data. Silakan coba lagi.
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {rows.map((item, i) => renderItem(item, i))}
    </div>
  );
}
