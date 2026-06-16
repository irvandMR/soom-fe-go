import { useState } from "react";
import BannerBackground from "@/components/common/BannerBackground";
import OrderTable from "@/components/features/order/OrderTable";
import OrderCard from "@/components/features/order/OrderCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { Order } from "@/types/order.type";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/format";
import {
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import type { SortState } from "@/hooks/useDataQuery";
import DetailOrderModal from "@/components/features/order/DetailOrderModal";
import { useActiveTenantStore } from "@/store/useActiveTenantStore";

const DUMMY_ORDERS: (Order & { tenantId: string })[] = [
  {
    id: "1",
    customerName: "Rizky Irvandi",
    orderNumber: "ORD-SUD-001",
    orderDate: "2026-06-13T09:12:00Z",
    status: "DONE",
    totalAmount: 125000,
    paymentStatus: "LUNAS",
    orderType: "DIRECT",
    paymentMethod: "QRIS Bank Mandiri",
    notes: "Minta dipotong tebal-tebal rotinya.",
    tenantId: "ten-1",
    items: [
      { id: "item-1", productName: "Roti Tawar Kupas", quantity: 2, price: 35000, productType: "MADE_TO_STOCK" },
      { id: "item-2", productName: "Croissant Almond", quantity: 1, price: 25000, productType: "MADE_TO_STOCK" },
      { id: "item-3", productName: "Plastik Kemasan", quantity: 2, price: 15000, productType: "RESELL" },
    ],
  },
  {
    id: "2",
    customerName: "Jane Doe",
    orderNumber: "ORD-SUD-002",
    orderDate: "2026-06-13T08:30:00Z",
    status: "PENDING",
    totalAmount: 45000,
    paymentStatus: "DP",
    dpAmount: 20000,
    orderType: "PRE_ORDER",
    paymentMethod: "GoPay",
    tenantId: "ten-1",
    items: [
      { id: "item-4", productName: "Sourdough Plain (Custom Bake)", quantity: 1, price: 45000, productType: "MADE_TO_ORDER" },
    ],
  },
  {
    id: "3",
    customerName: "John Smith",
    orderNumber: "ORD-SUD-003",
    orderDate: "2026-06-12T17:45:00Z",
    status: "DONE",
    totalAmount: 89000,
    paymentStatus: "LUNAS",
    orderType: "DIRECT",
    paymentMethod: "Debit BCA",
    tenantId: "ten-1",
    items: [
      { id: "item-5", productName: "Croissant Almond", quantity: 2, price: 25000, productType: "MADE_TO_STOCK" },
      { id: "item-6", productName: "Roti Maryam", quantity: 3, price: 13000, productType: "MADE_TO_STOCK" },
    ],
  },
  {
    id: "4",
    customerName: "Alice Cooper",
    orderNumber: "ORD-SUD-004",
    orderDate: "2026-06-11T14:20:00Z",
    status: "CANCELLED",
    totalAmount: 50000,
    paymentStatus: "LUNAS",
    orderType: "DIRECT",
    paymentMethod: "QRIS OVO",
    notes: "Customer salah pencet jumlah barang.",
    tenantId: "ten-1",
    items: [
      { id: "item-7", productName: "Roti Maryam", quantity: 5, price: 10000, productType: "MADE_TO_STOCK" },
    ],
  },
  {
    id: "5",
    customerName: "Michael Brown",
    orderNumber: "ORD-SUD-005",
    orderDate: "2026-06-11T10:05:00Z",
    status: "DONE",
    totalAmount: 160000,
    paymentStatus: "DP",
    dpAmount: 50000,
    orderType: "PRE_ORDER",
    paymentMethod: "Cash",
    tenantId: "ten-1",
    items: [
      { id: "item-8", productName: "Roti Tawar Kupas", quantity: 4, price: 35000, productType: "MADE_TO_STOCK" },
      { id: "item-9", productName: "Roti Maryam", quantity: 2, price: 10000, productType: "MADE_TO_STOCK" },
    ],
  },
  {
    id: "6",
    customerName: "Sarah Connor",
    orderNumber: "ORD-SUD-006",
    orderDate: "2026-06-10T16:30:00Z",
    status: "DONE",
    totalAmount: 70000,
    paymentStatus: "LUNAS",
    orderType: "DIRECT",
    paymentMethod: "QRIS ShopeePay",
    tenantId: "ten-1",
    items: [
      { id: "item-10", productName: "Croissant Almond", quantity: 2, price: 25000, productType: "MADE_TO_STOCK" },
      { id: "item-11", productName: "Roti Maryam", quantity: 2, price: 10000, productType: "MADE_TO_STOCK" },
    ],
  },
  {
    id: "7",
    customerName: "Andi Wijaya",
    orderNumber: "ORD-DAG-001",
    orderDate: "2026-06-13T07:45:00Z",
    status: "DONE",
    totalAmount: 75000,
    paymentStatus: "LUNAS",
    orderType: "DIRECT",
    paymentMethod: "QRIS",
    tenantId: "ten-2",
    items: [
      { id: "item-12", productName: "Kopi Susu Aren", quantity: 3, price: 20000, productType: "MADE_TO_STOCK" },
      { id: "item-13", productName: "Cinnamon Roll", quantity: 1, price: 15000, productType: "MADE_TO_STOCK" },
    ],
  },
  {
    id: "8",
    customerName: "Rina Marlina",
    orderNumber: "ORD-DAG-002",
    orderDate: "2026-06-12T19:30:00Z",
    status: "DONE",
    totalAmount: 112000,
    paymentStatus: "DP",
    dpAmount: 40000,
    orderType: "PRE_ORDER",
    paymentMethod: "Cash",
    tenantId: "ten-2",
    items: [
      { id: "item-14", productName: "Kopi Susu Aren", quantity: 4, price: 20000, productType: "MADE_TO_STOCK" },
      { id: "item-15", productName: "Cinnamon Roll", quantity: 2, price: 16000, productType: "MADE_TO_STOCK" },
    ],
  },
  {
    id: "9",
    customerName: "Eko Prasetyo",
    orderNumber: "ORD-DAG-003",
    orderDate: "2026-06-12T11:20:00Z",
    status: "DONE",
    totalAmount: 310000,
    paymentStatus: "LUNAS",
    orderType: "DIRECT",
    paymentMethod: "Debit BCA",
    tenantId: "ten-2",
    items: [
      { id: "item-16", productName: "Kopi Susu Aren", quantity: 10, price: 20000, productType: "MADE_TO_STOCK" },
      { id: "item-17", productName: "Croissant Almond", quantity: 4, price: 27500, productType: "MADE_TO_STOCK" },
    ],
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Selesai", value: "DONE" },
      { label: "Pending", value: "PENDING" },
      { label: "Batal", value: "CANCELLED" },
    ],
  },
  {
    key: "paymentStatus",
    label: "Status Bayar",
    options: [
      { label: "Lunas", value: "LUNAS" },
      { label: "DP (Uang Muka)", value: "DP" },
    ],
  },
];

export default function OrderPage() {
  const { isMobile } = useBreakpoint();
  const { activeTenantId } = useActiveTenantStore();

  // ── States ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>({ key: "orderDate", dir: "desc" });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      toast.success("Daftar transaksi berhasil dimuat ulang! (Mock)");
    }, 500);
  };

  const handleDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // ── Data Processing ──────────────────────────────────────────────────────────
  const tenantOrders = DUMMY_ORDERS.filter((o) => o.tenantId === activeTenantId);

  const filtered = tenantOrders.filter((row) => {
    // Text search (invoice / customer name)
    if (
      search &&
      !row.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !row.orderNumber.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    // Status filter
    if (activeFilters.status && row.status !== activeFilters.status) {
      return false;
    }
    // Payment Status filter
    if (activeFilters.paymentStatus && row.paymentStatus !== activeFilters.paymentStatus) {
      return false;
    }
    // Start date filter
    if (startDate) {
      const rowDate = new Date(row.orderDate).getTime();
      const filterStart = new Date(startDate).setHours(0, 0, 0, 0);
      if (rowDate < filterStart) return false;
    }
    // End date filter
    if (endDate) {
      const rowDate = new Date(row.orderDate).getTime();
      const filterEnd = new Date(endDate).setHours(23, 59, 59, 999);
      if (rowDate > filterEnd) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key as keyof Order];
    const bValue = b[sort.key as keyof Order];

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

  // ── Metrics Calculations ────────────────────────────────────────────────────
  const totalCount = tenantOrders.length;
  const totalRevenue = tenantOrders
    .filter((o) => o.status === "DONE")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lunasCount = tenantOrders.filter((o) => o.paymentStatus === "LUNAS").length;
  const dpCount = tenantOrders.filter((o) => o.paymentStatus === "DP").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header (Monitor Only - No creation button) */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Transaksi Terbaru</h1>
          <p className="text-xs text-slate-500">Monitoring transaksi ritel kasir aktif secara realtime</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FileSpreadsheet size={13} />}
          onClick={() => toast.info("Ekspor Rekap Penjualan (Fitur Mock)")}
          className="text-xs font-semibold"
        >
          Ekspor Rekap
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Transaksi",
            value: `${totalCount} Transaksi`,
            icon: <ShoppingBag className="text-indigo-600" size={18} />,
            bg: "bg-indigo-50 border-indigo-100 text-indigo-700",
          },
          {
            label: "Total Omset",
            value: formatRupiah(totalRevenue),
            icon: <TrendingUp className="text-emerald-600" size={18} />,
            bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          },
          {
            label: "Pesanan Lunas",
            value: `${lunasCount} Transaksi`,
            icon: <CheckCircle className="text-emerald-600" size={18} />,
            bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          },
          {
            label: "Uang Muka (DP)",
            value: `${dpCount} Transaksi`,
            icon: <Clock className="text-amber-600" size={18} />,
            bg: "bg-amber-50 border-amber-100 text-amber-700",
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
              <p className="text-sm font-black text-slate-700 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
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
            placeholder="Cari pelanggan atau nomor invoice..."
            className="w-full sm:max-w-sm"
          />
          <Button
            variant="outline-secondary"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleRefresh}
            title="Muat ulang data"
          >
            <RefreshCw size={13} className="text-white" />
          </Button>
          <FilterBar
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(v) => { setStartDate(v); setPage(1); }}
            onEndDateChange={(v) => { setEndDate(v); setPage(1); }}
          />
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

      {/* List Layout (Desktop vs Mobile) */}
      {isMobile ? (
        <CardList<Order>
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          emptyMessage="Belum ada transaksi ritel terekam."
          renderItem={(order) => (
            <OrderCard
              key={order.id}
              data={order}
              onDetail={handleDetail}
            />
          )}
        />
      ) : (
        <OrderTable
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          sort={sort}
          onSort={handleSort}
          onDetail={handleDetail}
          emptyMessage="Belum ada transaksi ritel terekam."
        />
      )}

      {/* Invoice Detail Modal */}
      <DetailOrderModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={selectedOrder}
      />
    </div>
  );
}
