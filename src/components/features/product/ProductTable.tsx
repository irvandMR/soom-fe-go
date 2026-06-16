import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { Product } from "@/types/product.type";
import { formatRupiah } from "@/utils/format";
import {
  CircleCheck,
  CircleX,
  Pencil,
  Trash2,
  Eye,
  ChefHat,
} from "lucide-react";

interface ProductTableProps {
  rows: Product[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onEdit: (product: Product) => void;
  onDetail: (product: Product) => void;
  onRecipe: (product: Product) => void;
  onDelete: (product: Product) => void;
  emptyMessage?: string;
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

const columns = (
  onEdit: (product: Product) => void,
  onDetail: (product: Product) => void,
  onRecipe: (product: Product) => void,
  onDelete: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    key: "name",
    label: "Nama Produk",
    sortable: true,
  },
  {
    key: "category_name",
    label: "Kategori",
    sortable: true,
  },
  {
    key: "type",
    label: "Tipe Produk",
    sortable: true,
    render(value) {
      const typeStr = value as string;
      return (
        <Badge variant={typeBadgeVariant(typeStr)}>
          {typeLabel[typeStr] ?? typeStr}
        </Badge>
      );
    },
  },
  {
    key: "active_recipe_version",
    label: "Versi Resep",
    sortable: true,
    align: "center",
    render(value) {
      return value != null ? (
        <Badge variant="success" className="font-semibold">
          v{String(value)}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    key: "stock_qty",
    label: "Stok",
    sortable: true,
    render(value, row) {
      return (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{value != null ? String(value) : "0"}</span>
          <Badge variant="outline">{row.unit_symbol}</Badge>
        </div>
      );
    },
  },
  {
    key: "estimated_cost",
    label: "Estimasi Biaya HPP",
    sortable: true,
    render(value) {
      return (
        <span className="font-medium text-foreground">
          {value != null ? formatRupiah(value as number) : "—"}
        </span>
      );
    },
  },
  {
    key: "is_active",
    label: "Aktif",
    align: "center",
    render: (val) =>
      val ? (
        <span className="text-green-500 flex justify-center">
          <CircleCheck size={16} />
        </span>
      ) : (
        <span className="text-red-500 flex justify-center">
          <CircleX size={16} />
        </span>
      ),
  },
  {
    key: "id",
    label: "Aksi",
    width: "60px",
    align: "center",
    render: (_, row) => (
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          icon={<Eye size={13} />}
          iconOnly
          title="Detail Produk"
          onClick={() => onDetail(row)}
        >
          Detail
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          icon={<ChefHat size={13} />}
          iconOnly
          title="Resep & HPP"
          onClick={() => onRecipe(row)}
        >
          Resep
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          icon={<Pencil size={13} />}
          iconOnly
          title="Edit"
          onClick={() => onEdit(row)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          icon={<Trash2 size={13} />}
          iconOnly
          title="Hapus"
          onClick={() => onDelete(row)}
        >
          Hapus
        </Button>
      </div>
    ),
  },
];

export default function ProductTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onEdit,
  onDetail,
  onRecipe,
  onDelete,
  emptyMessage,
}: ProductTableProps) {
  return (
    <DataTable<Product>
      columns={columns(onEdit, onDetail, onRecipe, onDelete)}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      sort={sort}
      onSort={onSort}
      emptyMessage={emptyMessage}
    />
  );
}
