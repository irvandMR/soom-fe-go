import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { Tenant } from "@/types/tenant.type";
import { Pencil, Trash2, CircleCheck, CircleX } from "lucide-react";

interface TenantTableProps {
  rows: Tenant[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  emptyMessage?: string;
}

const columns = (
  onEdit: (tenant: Tenant) => void,
  onDelete: (tenant: Tenant) => void
): ColumnDef<Tenant>[] => [
  {
    key: "code",
    label: "Kode Outlet",
    sortable: true,
    render(value) {
      return (
        <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          {value as string}
        </span>
      );
    },
  },
  {
    key: "name",
    label: "Nama Outlet",
    sortable: true,
  },
  {
    key: "owner_name",
    label: "Owner",
    sortable: true,
  },
  {
    key: "phone",
    label: "Telepon",
    sortable: true,
  },
  {
    key: "address",
    label: "Alamat",
    sortable: true,
    render: (val) => <span className="text-slate-500 text-xs block max-w-xs truncate">{val as string}</span>,
  },
  {
    key: "is_active",
    label: "Status",
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
      <div className="flex items-center justify-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          icon={<Pencil size={13} />}
          iconOnly
          title="Edit Outlet"
          onClick={() => onEdit(row)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          icon={<Trash2 size={13} />}
          iconOnly
          title="Hapus Outlet"
          onClick={() => onDelete(row)}
        >
          Hapus
        </Button>
      </div>
    ),
  },
];

export default function TenantTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onEdit,
  onDelete,
  emptyMessage,
}: TenantTableProps) {
  return (
    <DataTable<Tenant>
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
