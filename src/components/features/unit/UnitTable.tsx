import { CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import { type SortState } from "@/hooks/useDataQuery";
import type { Unit } from "@/types/unit.type";

interface UnitTableProps {
  rows: Unit[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
  emptyMessage?: string;
}

const columns = (
  onEdit: (unit: Unit) => void,
  onDelete: (unit: Unit) => void,
): ColumnDef<Unit>[] => [
  {
    key: "code",
    label: "Kode Unit",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Unit",
    sortable: true,
  },
  {
    key: "symbol",
    label: "Simbol",
    width: "120px",
    align: "center",
    render: (val) => (
      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-[var(--fandm-bg)] border border-[var(--fandm-border)] text-xs font-mono font-medium">
        {String(val)}
      </span>
    ),
  },
  {
    key: "have_conversion",
    label: "Memiliki Konversi",
    sortable: true,
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
    key: "conversion_factor",
    label: "Faktor Konversi",
    sortable: true,
  },
  {
    key: "base_unit",
    label: "Unit Dasar",
    sortable: true,
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

export default function UnitTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onEdit,
  onDelete,
  emptyMessage,
}: UnitTableProps) {
  return (
    <DataTable<Unit>
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
