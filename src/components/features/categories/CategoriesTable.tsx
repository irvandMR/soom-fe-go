import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@/components/widget/DataTable";
import DataTable from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { Categories } from "@/types/categories.type";
import { CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";

interface CategoriesTableProps {
  rows: Categories[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onEdit: (Categorie: Categories) => void;
  onDelete: (Categorie: Categories) => void;
  emptyMessage?: string;
}

const columns = (
  onEdit: (Categorie: Categories) => void,
  onDelete: (Categorie: Categories) => void,
): ColumnDef<Categories>[] => [
  {
    key: "Code",
    label: "Kode Kategori",
    sortable: true,
  },
  {
    key: "Name",
    label: "Nama Kategori",
    sortable: true,
  },
  {
    key: "Type",
    label: "Type Kategori",
    sortable: true,
  },
  {
    key: "IsActive",
    label: "aktif",
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
      </div>
    ),
  },
];

export default function CategoriesTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onEdit,
  onDelete,
  emptyMessage,
}: CategoriesTableProps) {
  return (
    <DataTable<Categories>
      columns={columns(onEdit, onDelete)}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      sort={sort}
      onSort={onSort}
      emptyMessage={emptyMessage}
    />
  );
}
