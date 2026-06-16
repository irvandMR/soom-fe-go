import { useState } from "react";
import BannerBackground from "@/components/common/BannerBackground";
import CashFlowTable from "@/components/features/cashflow/CashFlowTable";
import CashFlowCard from "@/components/features/cashflow/CashFlowCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { CashFlow, MonthlyCashFlow, ProfitLossSummary } from "@/types/cashflow.type";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/format";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileSpreadsheet,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { SortState } from "@/hooks/useDataQuery";
import FormModalCreateCashFlow from "@/components/features/cashflow/FormModalCreateCashFlow";
import { useActiveTenantStore } from "@/store/useActiveTenantStore";

const DUMMY_CASHFLOWS: (CashFlow & { tenantId: string })[] = [
  {
    id: "cf-1",
    transaction_date: "2026-06-01T10:00:00Z",
    type: "IN",
    category: "Penjualan",
    description: "Pendapatan order #ORD-20260601",
    amount: 350000,
    reference_type: "Order",
    tenantId: "ten-1",
  },
  {
    id: "cf-2",
    transaction_date: "2026-06-02T11:30:00Z",
    type: "OUT",
    category: "Bahan Baku",
    description: "Pembelian terigu segitiga biru 25kg",
    amount: 285000,
    reference_type: "Ingredient",
    tenantId: "ten-1",
  },
  {
    id: "cf-3",
    transaction_date: "2026-06-03T15:00:00Z",
    type: "IN",
    category: "Penjualan",
    description: "Pendapatan kasir harian",
    amount: 1250000,
    reference_type: "Manual",
    tenantId: "ten-2",
  },
  {
    id: "cf-4",
    transaction_date: "2026-06-05T09:00:00Z",
    type: "OUT",
    category: "Operasional",
    description: "Pembayaran listrik & air bulan Juni",
    amount: 450000,
    reference_type: "Manual",
    tenantId: "ten-1",
  },
  {
    id: "cf-5",
    transaction_date: "2026-06-10T14:00:00Z",
    type: "OUT",
    category: "Bahan Baku",
    description: "Pembelian gula pasir 10kg",
    amount: 150000,
    reference_type: "Ingredient",
    tenantId: "ten-2",
  },
];

const DUMMY_MONTHLY: MonthlyCashFlow[] = [
  { month: 1, year: 2026, total_in: 12500000, total_out: 8900000, balance: 3600000 },
  { month: 2, year: 2026, total_in: 14200000, total_out: 9300000, balance: 4900000 },
  { month: 3, year: 2026, total_in: 15800000, total_out: 11000000, balance: 4800000 },
  { month: 4, year: 2026, total_in: 18000000, total_out: 13500000, balance: 4500000 },
  { month: 5, year: 2026, total_in: 19500000, total_out: 14000000, balance: 5500000 },
  { month: 6, year: 2026, total_in: 1600000, total_out: 885000, balance: 715000 }, // June current
];

const DUMMY_PL: ProfitLossSummary = {
  revenue: 1600000,
  cogs: 435000,
  gross_profit: 1165000,
  gross_margin: 73,
  operational_expenses: 450000,
  net_profit: 715000,
  net_margin: 45,
};

const filterOptions = [
  {
    key: "type",
    label: "Tipe",
    options: [
      { label: "Pemasukan", value: "IN" },
      { label: "Pengeluaran", value: "OUT" },
    ],
  },
];

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function CashFlowPage() {
  const { isMobile } = useBreakpoint();
  const { activeTenantId } = useActiveTenantStore();

  // ── States ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"list" | "monthly" | "profit-loss">("list");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>({ key: "transaction_date", dir: "desc" });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (key: string, val: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (!val) {
        delete next[key];
      } else {
        next[key] = val;
      }
      return next;
    });
    setPage(1);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data keuangan diperbarui! (Mock)");
    }, 500);
  };

  // ── Tenant Specific Data Processing ──────────────────────────────────────────
  const tenantCashflows = DUMMY_CASHFLOWS.filter((c) => c.tenantId === activeTenantId);

  const tenantMonthly = DUMMY_MONTHLY.map((m) => {
    if (activeTenantId === "ten-4") {
      return { ...m, total_in: 0, total_out: 0, balance: 0 };
    }
    const factor = activeTenantId === "ten-2" ? 0.75 : activeTenantId === "ten-3" ? 0.3 : 1;
    const outFactor = activeTenantId === "ten-2" ? 0.65 : activeTenantId === "ten-3" ? 0.9 : 1;
    const tin = Math.round(m.total_in * factor);
    const tout = Math.round(m.total_out * outFactor);
    return {
      ...m,
      total_in: tin,
      total_out: tout,
      balance: tin - tout,
    };
  });

  const tenantPL = (() => {
    if (activeTenantId === "ten-4") {
      return { revenue: 0, cogs: 0, gross_profit: 0, gross_margin: 0, operational_expenses: 0, net_profit: 0, net_margin: 0 };
    }
    const factor = activeTenantId === "ten-2" ? 0.75 : activeTenantId === "ten-3" ? 0.3 : 1;
    const rev = Math.round(DUMMY_PL.revenue * factor);
    const cogs = Math.round(DUMMY_PL.cogs * (activeTenantId === "ten-2" ? 0.7 : activeTenantId === "ten-3" ? 0.6 : 1));
    const opex = Math.round(DUMMY_PL.operational_expenses * (activeTenantId === "ten-2" ? 0.6 : activeTenantId === "ten-3" ? 1.4 : 1));
    const gross = rev - cogs;
    const net = gross - opex;
    return {
      revenue: rev,
      cogs,
      gross_profit: gross,
      gross_margin: rev ? Math.round((gross / rev) * 100) : 0,
      operational_expenses: opex,
      net_profit: net,
      net_margin: rev ? Math.round((net / rev) * 100) : 0,
    };
  })();

  const filtered = tenantCashflows.filter((row) => {
    if (search && !row.description.toLowerCase().includes(search.toLowerCase()) && !row.category.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (activeFilters.type && row.type !== activeFilters.type) {
      return false;
    }
    if (startDate) {
      const rowDate = new Date(row.transaction_date).getTime();
      const filterStart = new Date(startDate).setHours(0, 0, 0, 0);
      if (rowDate < filterStart) return false;
    }
    if (endDate) {
      const rowDate = new Date(row.transaction_date).getTime();
      const filterEnd = new Date(endDate).setHours(23, 59, 59, 999);
      if (rowDate > filterEnd) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key as keyof CashFlow];
    const bValue = b[sort.key as keyof CashFlow];

    if (aValue === null || aValue === undefined) return sort.dir === "asc" ? 1 : -1;
    if (bValue === null || bValue === undefined) return sort.dir === "asc" ? -1 : 1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sort.dir === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sort.dir === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const limit = 5;
  const totalPages = Math.ceil(sorted.length / limit);
  const startIndex = (page - 1) * limit;
  const paginated = sorted.slice(startIndex, startIndex + limit);

  const meta = {
    total: sorted.length,
    page,
    limit,
    total_pages: totalPages || 1,
  };

  // Stats
  const totalIn = tenantCashflows.filter((c) => c.type === "IN").reduce((sum, c) => sum + c.amount, 0);
  const totalOut = tenantCashflows.filter((c) => c.type === "OUT").reduce((sum, c) => sum + c.amount, 0);
  const balance = totalIn - totalOut;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Keuangan</h1>
          <p className="text-xs text-slate-500">Rekap transaksi pemasukan dan pengeluaran</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet size={13} />}
            onClick={() => toast.info("Ekspor Excel (Fitur Mock)")}
            className="text-xs font-semibold"
          >
            Ekspor Excel
          </Button>
          <Button
            size="sm"
            icon={<Plus size={13} />}
            onClick={() => setShowCreateModal(true)}
            className="text-xs font-semibold bg-[var(--fandm-primary)] hover:bg-[var(--fandm-primary-dark)] text-white"
          >
            Input Manual
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Pemasukan",
            value: formatRupiah(totalIn),
            icon: <TrendingUp className="text-emerald-600" size={18} />,
            bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          },
          {
            label: "Total Pengeluaran",
            value: formatRupiah(totalOut),
            icon: <TrendingDown className="text-rose-600" size={18} />,
            bg: "bg-rose-50 border-rose-100 text-rose-700",
          },
          {
            label: "Sisa Saldo",
            value: formatRupiah(balance),
            icon: <Wallet className="text-indigo-600" size={18} />,
            bg: "bg-indigo-50 border-indigo-100 text-indigo-700",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 flex items-center gap-4 bg-white shadow-xs"
          >
            <div className={`p-2.5 rounded-xl border ${item.bg.split(" ")[0]} ${item.bg.split(" ")[1]}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                {item.label}
              </p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl self-start">
        {[
          { key: "list", label: "Daftar Transaksi" },
          { key: "monthly", label: "Rekap Bulanan" },
          { key: "profit-loss", label: "Laba Rugi" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "list" && (
        <div className="flex flex-col gap-4">
          <BannerBackground
            variant="subtle"
            className="flex flex-col gap-2 p-3 rounded-lg border"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <SearchInput
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                placeholder="Cari deskripsi atau kategori..."
                className="w-full sm:max-w-sm"
              />

              <Button
                variant="outline-secondary"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={handleRefresh}
                title="Refresh data"
              >
                <RefreshCw size={13} className="text-white" />
              </Button>

              <FilterBar
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />

              {/* Date Filters */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 px-2 text-xs border rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  title="Tanggal Mulai"
                />
                <span className="text-xs text-white/60">s/d</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 px-2 text-xs border rounded-lg bg-white/10 text-white border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  title="Tanggal Selesai"
                />
                {(startDate || endDate) && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="h-8 text-white px-2 cursor-pointer"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setPage(1);
                    }}
                  >
                    Clear Tgl
                  </Button>
                )}
              </div>
            </div>
          </BannerBackground>

          {/* Pagination */}
          {meta && (
            <Pagination
              meta={meta}
              page={page}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}

          {isMobile ? (
            <CardList<CashFlow>
              rows={paginated}
              isLoading={isLoading}
              isError={false}
              emptyMessage="Belum ada transaksi."
              renderItem={(cf) => <CashFlowCard key={cf.id} data={cf} />}
            />
          ) : (
            <CashFlowTable
              rows={paginated}
              isLoading={isLoading}
              isError={false}
              sort={sort}
              onSort={handleSort}
              emptyMessage="Belum ada transaksi."
            />
          )}
        </div>
      )}

      {activeTab === "monthly" && (
        <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Bulan
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pemasukan
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pengeluaran
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Saldo Bersih
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenantMonthly.map((m, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm font-semibold text-slate-700">
                      {monthNames[m.month - 1]} {m.year}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-green-600">
                      {formatRupiah(m.total_in)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-rose-600">
                      {formatRupiah(m.total_out)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-slate-800">
                      {formatRupiah(m.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "profit-loss" && (
        <div className="max-w-2xl bg-white border border-slate-100 rounded-2xl p-6 shadow-xs mx-auto w-full">
          <div className="text-center mb-6">
            <h2 className="text-base font-extrabold text-slate-800">Laporan Laba Rugi</h2>
            <p className="text-xs text-slate-500 mt-0.5">Periode Juni 2026 (Estimasi)</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-slate-700">Pendapatan (Revenue)</span>
              <span className="text-sm font-black text-green-600">{formatRupiah(tenantPL.revenue)}</span>
            </div>

            <div className="flex justify-between items-center p-3.5 border-b border-slate-100/70 text-rose-600">
              <span className="text-sm font-semibold text-slate-600">Harga Pokok Penjualan (HPP)</span>
              <span className="text-sm font-black">({formatRupiah(tenantPL.cogs)})</span>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-50 border border-indigo-100/70 text-indigo-800 mt-2">
              <div>
                <span className="text-sm font-extrabold block">Laba Kotor (Gross Profit)</span>
                <span className="text-[10px] font-semibold text-indigo-500">Margin: {tenantPL.gross_margin}%</span>
              </div>
              <span className="text-base font-black">{formatRupiah(tenantPL.gross_profit)}</span>
            </div>

            <div className="flex justify-between items-center p-3.5 border-b border-slate-100/70 text-rose-600 mt-3">
              <span className="text-sm font-semibold text-slate-600">Biaya Operasional</span>
              <span className="text-sm font-black">({formatRupiah(tenantPL.operational_expenses)})</span>
            </div>

            <div className="flex justify-between items-center p-4.5 rounded-xl bg-emerald-50 border border-emerald-100/70 text-emerald-800 mt-4">
              <div>
                <span className="text-base font-black block">Laba Bersih (Net Profit)</span>
                <span className="text-[10px] font-semibold text-emerald-500">Margin Bersih: {tenantPL.net_margin}%</span>
              </div>
              <span className="text-lg font-black">{formatRupiah(tenantPL.net_profit)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}
      <FormModalCreateCashFlow
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
