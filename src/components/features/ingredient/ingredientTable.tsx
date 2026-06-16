import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { Ingredients } from "@/types/ingredients.type";
import { formatRupiah } from "@/utils/format";
import {
  CircleCheck,
  CircleX,
  HistoryIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

interface IngredientsTabelProps {
  rows: Ingredients[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onEdit: (ingredient: Ingredients) => void;
  onStockIn: (ingredient: Ingredients) => void;
  onDelete: (ingredient: Ingredients) => void;
  onHistory: (ingredient: Ingredients) => void;
  emptyMessage?: string;
  isPackaging?: boolean;
}

const columns = (
  onEdit: (ingredient: Ingredients) => void,
  onStockIn: (ingredient: Ingredients) => void,
  onDelete: (ingredient: Ingredients) => void,
  onHistory: (ingredient: Ingredients) => void,
  isPackaging?: boolean,
): ColumnDef<Ingredients>[] => [
    {
      key: "name",
      label: isPackaging ? "Nama Kemasan / Wadah" : "Nama Bahan Baku",
      sortable: true,
    },
    {
      key: "category_name",
      label: "Kategori",
      sortable: true,
    },
    {
      key: "stock_qty",
      label: "Jumlah Stock",
      sortable: true,
      render(value, row) {
        return (
          <span>
            {value != null ? String(value) : "0"} {" "}
            <Badge variant="info">{row.unit_symbol}</Badge>
          </span>
        );
      },
    },
    {
      key: "min_stock",
      label: "Min. Stock",
      sortable: true,
      render(value, row) {
        return (
          <span>
            {value != null ? String(value) : "-"} {" "}
            <Badge variant="info">{row.unit_symbol}</Badge>
          </span>
        );
      },
    },
    {
      key: "purchase_price",
      label: "Harga Beli",
      sortable: true,
      render(value, row) {
        return (
          <div className="flex items-center gap-1">
            <span>{formatRupiah(value as number)}</span>
            <span>/</span>
            <Badge variant="info">{row.unit_symbol}</Badge>
          </div>
        );
      },
    },
    {
      key: "average_price",
      label: "Harga rata-rata",
      sortable: true,
      render(value, row) {
        return (
          <div className="flex items-center gap-1">
            <span>{formatRupiah(value as number)}</span>
            <span>/</span>
            <Badge variant="info">{row.unit_symbol}</Badge>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "status",
      sortable: true,
      align: "center",
      render: (val) => {
        const status = val as string | null;
        const variantBadge =
          status === null || status === ""
            ? "danger"
            : status === "KRITIS"
              ? "warning"
              : "success";
        return (
          <Badge variant={variantBadge}>
            {status ? status.toLocaleLowerCase() : "belum ada stok"}
          </Badge>
        );
      },
    },
    {
      key: "is_active",
      label: "aktif",
      // align: "center",
      render: (val) =>
        val ? (
          <span className="text-green-500">
            <CircleCheck size={16} />
          </span>
        ) : (
          <span className="text-red-500">
            <CircleX size={16} />
          </span>
        ),
    },
    {
      key: "Id",
      label: "Aksi",
      width: "60px",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            icon={<Pencil size={13} />}
            iconOnly
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            icon={<Trash2 size={13} />}
            iconOnly
            onClick={() => onDelete(row)}
          >
            Hapus
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            icon={<Plus size={13} />}
            iconOnly
            onClick={() => onStockIn(row)}
          >
            Tambah Stock
          </Button>
          <Button
            title="History"
            variant="ghost"
            size="icon-sm"
            icon={<HistoryIcon size={13} />}
            iconOnly
            onClick={() => onHistory(row)}
          >
            Riwayat Belanja
          </Button>
        </div>
      ),
    },
  ];

export default function IngredientsTabel({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onEdit,
  onDelete,
  onStockIn,
  onHistory,
  emptyMessage,
  isPackaging,
}: IngredientsTabelProps) {
  return (
    <DataTable<Ingredients>
      columns={columns(onEdit, onStockIn, onDelete, onHistory, isPackaging)}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      sort={sort}
      onSort={onSort}
      emptyMessage={emptyMessage}
    />
  );
}
