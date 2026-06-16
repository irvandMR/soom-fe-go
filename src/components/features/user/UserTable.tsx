import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { User } from "@/types/user.type";
import { Pencil, Trash2, CircleCheck, CircleX } from "lucide-react";

interface UserTableProps {
  rows: User[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  emptyMessage?: string;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "superadmin":
      return "danger";
    case "owner":
      return "warning";
    default:
      return "info";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "owner":
      return "Owner";
    default:
      return "Karyawan";
  }
};

const columns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] => [
  {
    key: "name",
    label: "Nama",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    align: "center",
    render(value) {
      const role = value as string;
      return (
        <Badge variant={getRoleBadgeVariant(role)}>
          {getRoleLabel(role)}
        </Badge>
      );
    },
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
          title="Edit User"
          onClick={() => onEdit(row)}
        >
          Edit
        </Button>
        {row.role === "karyawan" && (
          <Button
            variant="destructive"
            size="icon-sm"
            icon={<Trash2 size={13} />}
            iconOnly
            title="Hapus User"
            onClick={() => onDelete(row)}
          >
            Hapus
          </Button>
        )}
      </div>
    ),
  },
];

export default function UserTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onEdit,
  onDelete,
  emptyMessage,
}: UserTableProps) {
  return (
    <DataTable<User>
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
