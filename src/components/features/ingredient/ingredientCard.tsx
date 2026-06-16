import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Ingredients } from "@/types/ingredients.type";
import { formatRupiah } from "@/utils/format";
import {
    CircleCheck,
    CircleX,
    HistoryIcon,
    Pencil,
    Plus,
    Trash2,
    PackageIcon,
} from "lucide-react";

interface IngredientCardProps {
    data: Ingredients;
    onEdit: (ingredient: Ingredients) => void;
    onDelete: (ingredient: Ingredients) => void;
    onStockIn: (ingredient: Ingredients) => void;
    onHistory: (ingredient: Ingredients) => void;
}

function StatusBadge({ status }: { status: string | null }) {
    if (!status) {
        return <Badge variant="danger">— Belum ada stok</Badge>;
    }
    return (
        <Badge variant={status === "KRITIS" ? "warning" : "success"}>
            {status.toLocaleLowerCase()}
        </Badge>
    );
}




export default function IngredientCard({
    data,
    onEdit,
    onDelete,
    onStockIn,
    onHistory,
}: IngredientCardProps) {
    return (
        <Card className="border-[var(--fandm-border)] shadow-none gap-0 py-0">
            {/* ── Header ─────────────────────────────────── */}
            <CardContent className="pt-3 pb-2.5">
                <div className="flex items-start justify-between gap-2">
                    {/* Icon + Nama + Kategori */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[var(--fandm-bg)] border border-[var(--fandm-border)] flex items-center justify-center shrink-0">
                            <PackageIcon size={16} className="text-[var(--fandm-text-muted)]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--fandm-text)] truncate leading-tight">
                                {data.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {data.category_name ?? "—"}
                            </p>
                        </div>
                    </div>

                    {/* Status aktif */}
                    <span className="shrink-0 mt-0.5">
                        {data.is_active ? (
                            <CircleCheck size={15} className="text-green-500" />
                        ) : (
                            <CircleX size={15} className="text-red-400" />
                        )}
                    </span>
                </div>

                {/* ── Info grid ─────────────────────────────── */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3">
                    {/* Stok saat ini */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                            Stok
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-foreground">
                                {data.stock_qty ?? 0}
                            </span>
                            <Badge variant="info">{data.unit_symbol}</Badge>
                        </div>
                    </div>

                    {/* Min stock */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                            Min. Stok
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-foreground">
                                {data.min_stock}
                            </span>
                            <Badge variant="outline">{data.unit_symbol}</Badge>
                        </div>
                    </div>

                    {/* Harga beli */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                            Harga Beli
                        </span>
                        <span className="text-xs font-medium text-foreground">
                            {data.purchase_price
                                ? `${formatRupiah(data.purchase_price)} / ${data.unit_symbol}`
                                : "—"}
                        </span>
                    </div>

                    {/* Harga rata-rata */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                            Rata-rata
                        </span>
                        <span className="text-xs font-medium text-foreground">
                            {data.average_price
                                ? `${formatRupiah(data.average_price)} / ${data.unit_symbol}`
                                : "—"}
                        </span>
                    </div>
                </div>

                {/* ── Status badge ──────────────────────────── */}
                <div className="mt-2.5">
                    <StatusBadge status={data.status as string | null} />
                </div>
            </CardContent>

            {/* ── Footer actions ─────────────────────────── */}
            <CardFooter className="flex items-center justify-between gap-1 px-3 py-2">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        icon={<Pencil size={13} />}
                        iconOnly
                        title="Edit"
                        onClick={() => onEdit(data)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon-sm"
                        icon={<Trash2 size={13} />}
                        iconOnly
                        title="Hapus"
                        onClick={() => onDelete(data)}
                    >
                        Hapus
                    </Button>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        icon={<Plus size={13} />}
                        iconOnly
                        title="Tambah Stok"
                        onClick={() => onStockIn(data)}
                    >
                        Tambah Stok
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        icon={<HistoryIcon size={13} />}
                        iconOnly
                        title="Riwayat Belanja"
                        onClick={() => onHistory(data)}
                    >
                        Riwayat Belanja
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
