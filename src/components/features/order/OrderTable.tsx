import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { Order } from "@/types/order.type";
import { Eye, Calendar } from "lucide-react";
import { formatRupiah, formatDate } from "@/utils/format";

interface OrderTableProps {
  rows: Order[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
  onDetail: (order: Order) => void;
  emptyMessage?: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "default" }
> = {
  DONE: { label: "Selesai", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  CANCELLED: { label: "Batal", variant: "destructive" },
};

const columns = (onDetail: (order: Order) => void): ColumnDef<Order>[] => [
  {
    key: "orderNumber",
    label: "No. Invoice",
    sortable: true,
    render: (val) => <span className="font-mono font-bold text-slate-700">{String(val)}</span>,
  },
  {
    key: "orderType",
    label: "Jenis Transaksi",
    sortable: true,
    align: "center",
    render: (val) => {
      const isPreOrder = val === "PRE_ORDER";
      return (
        <Badge variant={isPreOrder ? "info" : "success"} className="text-[9px] px-2 py-0.5 font-bold">
          {isPreOrder ? "Pre-Order" : "Ritel / Direct"}
        </Badge>
      );
    },
  },
  {
    key: "customerName",
    label: "Pelanggan",
    sortable: true,
    render: (val) => <span className="font-semibold text-slate-700">{String(val || "Walk-in Customer")}</span>,
  },
  {
    key: "orderDate",
    label: "Tanggal Transaksi",
    sortable: true,
    render: (val) => (
      <span className="text-slate-500 font-medium flex items-center gap-1.5">
        <Calendar size={12} className="text-slate-400" />
        {formatDate(String(val))}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    align: "center",
    render: (val) => {
      const status = String(val);
      const conf = statusConfig[status] || { label: status, variant: "secondary" };
      return (
        <Badge variant={conf.variant} className="text-[9px] px-2 py-0.5 font-bold">
          {conf.label}
        </Badge>
      );
    },
  },
  {
    key: "paymentStatus",
    label: "Status Bayar",
    sortable: true,
    align: "center",
    render: (val, row) => {
      const isLunas = val === "LUNAS";
      return (
        <div className="flex flex-col items-center gap-0.5">
          <Badge variant={isLunas ? "success" : "warning"} className="text-[9px] px-2 py-0.5 font-bold">
            {isLunas ? "Lunas" : "DP"}
          </Badge>
          {!isLunas && row.dpAmount !== undefined && (
            <span className="text-[9px] font-bold text-slate-500">
              {formatRupiah(row.dpAmount)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "totalAmount",
    label: "Total Tagihan",
    sortable: true,
    align: "right",
    render: (val) => <span className="font-extrabold text-slate-800">{formatRupiah(Number(val))}</span>,
  },
  {
    key: "id",
    label: "Detail",
    width: "60px",
    align: "center",
    render: (_, row) => (
      <Button
        variant="ghost"
        size="icon-sm"
        icon={<Eye size={13} />}
        iconOnly
        title="Lihat Detail"
        onClick={() => onDetail(row)}
      >
        Detail
      </Button>
    ),
  },
];

export default function OrderTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  onDetail,
  emptyMessage,
}: OrderTableProps) {
  return (
    <DataTable<Order>
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
