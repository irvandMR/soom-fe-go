import { Badge } from "@/components/ui/badge";
import DataTable, { type ColumnDef } from "@/components/widget/DataTable";
import type { SortState } from "@/hooks/useDataQuery";
import type { CashFlow } from "@/types/cashflow.type";
import { formatRupiah } from "@/utils/format";

interface CashFlowTableProps {
  rows: CashFlow[];
  isLoading: boolean;
  isError: boolean;
  sort: SortState | null;
  onSort: (key: string) => void;
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

const columns: ColumnDef<CashFlow>[] = [
  {
    key: "transaction_date",
    label: "Tgl Transaksi",
    sortable: true,
    render: (val) => <span className="text-slate-500 text-xs">{formatDate(val as string)}</span>,
  },
  {
    key: "type",
    label: "Tipe",
    sortable: true,
    align: "center",
    render(value) {
      const type = value as string;
      return (
        <Badge variant={type === "IN" ? "success" : "danger"}>
          {type === "IN" ? "Pemasukan" : "Pengeluaran"}
        </Badge>
      );
    },
  },
  {
    key: "category",
    label: "Kategori",
    sortable: true,
  },
  {
    key: "description",
    label: "Deskripsi",
    sortable: true,
  },
  {
    key: "amount",
    label: "Jumlah",
    sortable: true,
    align: "right",
    render(value, row) {
      const type = row.type;
      const isIncome = type === "IN";
      return (
        <span className={`font-bold text-sm ${isIncome ? "text-green-600" : "text-rose-600"}`}>
          {isIncome ? "+" : "-"}{formatRupiah(value as number)}
        </span>
      );
    },
  },
  {
    key: "reference_type",
    label: "Sumber",
    sortable: true,
    render(value) {
      return (
        <span className="text-slate-400 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {value as string || "Manual"}
        </span>
      );
    },
  },
];

export default function CashFlowTable({
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  emptyMessage,
}: CashFlowTableProps) {
  return (
    <DataTable<CashFlow>
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      sort={sort}
      onSort={onSort}
      emptyMessage={emptyMessage}
    />
  );
}
