import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { Production } from "@/types/production.type";
import { Eye } from "lucide-react";

interface ProductionTableProps {
  rows: Production[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onDetail: (production: Production) => void;
  emptyMessage?: string;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const columns = (
  onDetail: (production: Production) => void
): ColumnDef<Production>[] => [
  {
    key: "product_name",
    label: "Produk",
    sortable: true,
  },
  {
    key: "recipe_version",
    label: "Versi Resep",
    sortable: true,
    align: "center",
    render(value) {
      return (
        <Badge variant="outline" className="font-semibold text-slate-500">
          v{String(value)}
        </Badge>
      );
    },
  },
  {
    key: "quantity_produced",
    label: "Qty Produksi",
    sortable: true,
    render(value, row) {
      const success = row.quantity_success ?? row.quantity_produced;
      const failed = row.quantity_failed ?? 0;
      return (
        <div className="flex flex-col gap-0.5 text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span>{String(value)}</span>
            <Badge variant="info" className="text-[10px] py-0 px-1">{row.unit_symbol}</Badge>
          </div>
          {failed > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="text-green-600 font-semibold">{success} ok</span>
              <span>·</span>
              <span className="text-rose-600 font-semibold">{failed} rjt</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "production_date",
    label: "Tgl Produksi",
    sortable: true,
    render: (val) => <span className="text-slate-500 text-xs">{formatDate(val as string)}</span>,
  },
  {
    key: "expired_date",
    label: "Tgl Expired",
    sortable: true,
    render: (val) => <span className="text-slate-500 text-xs">{formatDate(val as string)}</span>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    align: "center",
    render(value, row) {
      const status = value as string;
      const failed = row.quantity_failed ?? 0;
      if (status === "SUCCESS") {
        if (failed > 0) {
          return (
            <Badge variant="warning">
              Sukses (Ada Reject)
            </Badge>
          );
        }
        return (
          <Badge variant="success">
            Sukses
          </Badge>
        );
      }
      return (
        <Badge variant="danger">
          Gagal Total
        </Badge>
      );
    },
  },
  {
    key: "notes",
    label: "Catatan",
    render: (val) => <span className="text-slate-400 text-xs italic">{val as string || "—"}</span>,
  },
  {
    key: "id",
    label: "Aksi",
    width: "60px",
    align: "center",
    render: (_, row) => (
      <div className="flex items-center justify-center shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          icon={<Eye size={13} />}
          iconOnly
          title="Detail Produksi"
          onClick={() => onDetail(row)}
        >
          Detail
        </Button>
      </div>
    ),
  },
];

export default function ProductionTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onDetail,
  emptyMessage,
}: ProductionTableProps) {
  return (
    <DataTable<Production>
      columns={columns(onDetail)}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      sort={sort}
      onSort={onSort}
      emptyMessage={emptyMessage}
    />
  );
}
