import { useState } from "react";
import BannerBackground from "@/components/common/BannerBackground";
import ProductionTable from "@/components/features/production/ProductionTable";
import ProductionCard from "@/components/features/production/ProductionCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import PageHeader from "@/components/widget/PageHeader";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { Production } from "@/types/production.type";
import { Button } from "@/components/ui/button";
import { RefreshCw, Factory, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { SortState } from "@/hooks/useDataQuery";
import FormModalCreateProduction from "@/components/features/production/FormModalCreateProduction";
import DetailProductionModal from "@/components/features/production/DetailProductionModal";
import { useActiveTenantStore } from "@/store/useActiveTenantStore";

const DUMMY_PRODUCTIONS: (Production & { tenantId: string })[] = [
  {
    id: "prd-1",
    product_name: "Roti Tawar Kupas",
    recipe_version: 1,
    quantity_produced: 100,
    quantity_success: 98,
    quantity_failed: 2,
    unit_symbol: "pack",
    production_date: "2026-06-10T08:00:00Z",
    expired_date: "2026-06-13T08:00:00Z",
    status: "SUCCESS",
    notes: "Adonan mengembang dengan baik, terdapat 2 pack reject di pinggiran gosong.",
    tenantId: "ten-1",
  },
  {
    id: "prd-2",
    product_name: "Baguette Parisienne",
    recipe_version: 2,
    quantity_produced: 30,
    quantity_success: 30,
    quantity_failed: 0,
    unit_symbol: "pcs",
    production_date: "2026-06-11T09:00:00Z",
    expired_date: "2026-06-12T09:00:00Z",
    status: "SUCCESS",
    notes: "Kulit baguette renyah sempurna.",
    tenantId: "ten-1",
  },
  {
    id: "prd-3",
    product_name: "Croissant Almond",
    recipe_version: 1,
    quantity_produced: 50,
    quantity_success: 48,
    quantity_failed: 2,
    unit_symbol: "pcs",
    production_date: "2026-06-12T07:30:00Z",
    expired_date: "2026-06-14T07:30:00Z",
    status: "SUCCESS",
    notes: "2 pcs gosong di bagian bawah.",
    tenantId: "ten-3",
  },
  {
    id: "prd-4",
    product_name: "Roti Tawar Kupas",
    recipe_version: 1,
    quantity_produced: 80,
    quantity_success: 0,
    quantity_failed: 80,
    unit_symbol: "pack",
    production_date: "2026-06-12T13:00:00Z",
    expired_date: "2026-06-15T13:00:00Z",
    status: "FAILED",
    notes: "Suhu oven terlalu tinggi, seluruh roti gosong total.",
    tenantId: "ten-1",
  },
  {
    id: "prd-5",
    product_name: "Kopi Susu Gula Aren 1L",
    recipe_version: 1,
    quantity_produced: 150,
    quantity_success: 150,
    quantity_failed: 0,
    unit_symbol: "btl",
    production_date: "2026-06-13T08:00:00Z",
    expired_date: "2026-06-20T08:00:00Z",
    status: "SUCCESS",
    notes: "Pengemasan botol steril.",
    tenantId: "ten-2",
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Sukses", value: "SUCCESS" },
      { label: "Gagal", value: "FAILED" },
    ],
  },
];

export default function ProductionPage() {
  const { isMobile } = useBreakpoint();
  const { activeTenantId } = useActiveTenantStore();

  // ── States ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>({ key: "production_date", dir: "desc" });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (key: string, val: string) => {
    setActiveFilters((prev) => {
      const text = { ...prev };
      if (!val) {
        delete text[key];
      } else {
        text[key] = val;
      }
      return text;
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
      toast.success("Data produksi berhasil dimuat ulang! (Mock)");
    }, 500);
  };

  const handleDetail = (production: Production) => {
    setSelectedProduction(production);
    setShowDetailModal(true);
  };

  // ── Data Processing ──────────────────────────────────────────────────────────
  const tenantProductions = DUMMY_PRODUCTIONS.filter((p) => p.tenantId === activeTenantId);

  const filtered = tenantProductions.filter((row) => {
    if (search && !row.product_name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (activeFilters.status && row.status !== activeFilters.status) {
      return false;
    }
    if (startDate) {
      const rowDate = new Date(row.production_date).getTime();
      const filterStart = new Date(startDate).setHours(0, 0, 0, 0);
      if (rowDate < filterStart) return false;
    }
    if (endDate) {
      const rowDate = new Date(row.production_date).getTime();
      const filterEnd = new Date(endDate).setHours(23, 59, 59, 999);
      if (rowDate > filterEnd) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key as keyof Production];
    const bValue = b[sort.key as keyof Production];

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

  // ── Summary Cards Data ──────────────────────────────────────────────────────
  const successCount = tenantProductions.filter((p) => p.status === "SUCCESS").length;
  const failedCount = tenantProductions.filter((p) => p.status === "FAILED").length;
  const successRate = tenantProductions.length
    ? Math.round((successCount / tenantProductions.length) * 100)
    : 0;
  const totalQty = tenantProductions.reduce((sum, p) => (p.status === "SUCCESS" ? sum + p.quantity_produced : sum), 0);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Produksi"
        subtitle={`${tenantProductions.length} batch produksi tercatat`}
        actionLabel="Catat Produksi"
        onAction={() => setShowCreateModal(true)}
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ... card summary tetap sama */}
      </div>

      {/* ✅ SATU BannerBackground, ditutup dengan benar */}
      <BannerBackground
        variant="subtle"
        className="flex flex-col gap-2 p-3 rounded-lg border"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Cari produk yang diproduksi..."
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
      </BannerBackground>  {/* ✅ Tag ditutup di sini */}

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
        <CardList<Production>
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          emptyMessage="Belum ada data produksi."
          renderItem={(prod) => (
            <ProductionCard key={prod.id} data={prod} onDetail={handleDetail} />
          )}
        />
      ) : (
        <ProductionTable
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          sort={sort}
          onSort={handleSort}
          onDetail={handleDetail}
          emptyMessage="Belum ada data produksi."
        />
      )}

      <FormModalCreateProduction
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <DetailProductionModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={selectedProduction}
      />
    </div>
  );
}
