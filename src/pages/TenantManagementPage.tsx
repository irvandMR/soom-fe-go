import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import { useAuthStore } from "@/store/useAuthStore";
import BannerBackground from "@/components/common/BannerBackground";
import TenantTable from "@/components/features/tenant/TenantTable";
import TenantCard from "@/components/features/tenant/TenantCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import PageHeader from "@/components/widget/PageHeader";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { confirm } from "@/store/useConfirmStore";
import type { Tenant } from "@/types/tenant.type";
import { Button } from "@/components/ui/button";
import { RefreshCw, Store, CheckCircle, ShieldAlert, Upload } from "lucide-react";
import { toast } from "sonner";
import type { SortState } from "@/hooks/useDataQuery";
import FormModalCreateTenant from "@/components/features/tenant/FormModalCreateTenant";
import FormModalImportTenant from "@/components/features/tenant/FormModalImportTenant";

const DUMMY_TENANTS: Tenant[] = [
  {
    id: "ten-1",
    name: "SOOM Bakery & Cafe - Sudirman",
    code: "TEN-SUD",
    address: "Jl. Jend. Sudirman No. 102, Jakarta Pusat",
    owner_name: "Rizky Irvandi",
    phone: "0812-3456-7890",
    is_active: true,
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "ten-2",
    name: "SOOM Express - Dago",
    code: "TEN-DAG",
    address: "Jl. Ir. H. Juanda No. 85, Bandung",
    owner_name: "Budi Santoso",
    phone: "0821-9876-5432",
    is_active: true,
    created_at: "2026-03-20T00:00:00Z",
  },
  {
    id: "ten-3",
    name: "SOOM Central Kitchen",
    code: "TEN-PST",
    address: "Kawasan Industri MM2100 Blok C5, Bekasi",
    owner_name: "Siti Rahma",
    phone: "0811-2233-4455",
    is_active: true,
    created_at: "2026-02-10T00:00:00Z",
  },
  {
    id: "ten-4",
    name: "SOOM Stall - Margonda (Inactive)",
    code: "TEN-MAR",
    address: "Jl. Margonda Raya No. 412, Depok",
    owner_name: "Andi Wijaya",
    phone: "0855-6677-8899",
    is_active: false,
    created_at: "2026-05-01T00:00:00Z",
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Aktif", value: "true" },
      { label: "Non-aktif", value: "false" },
    ],
  },
];

export default function TenantManagementPage() {
  const { isMobile } = useBreakpoint();
  const { user } = useAuthStore();

  if (user && user.role !== "superadmin") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // ── States ──────────────────────────────────────────────────────────────────
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem("soom-tenants");
    return saved ? JSON.parse(saved) : DUMMY_TENANTS;
  });

  useEffect(() => {
    localStorage.setItem("soom-tenants", JSON.stringify(tenants));
  }, [tenants]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>({ key: "name", dir: "asc" });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

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
      toast.success("Data tenant diperbarui! (Mock)");
    }, 500);
  };

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowCreateModal(true);
  };

  const handleDelete = (tenant: Tenant) => {
    confirm({
      title: `Hapus Outlet "${tenant.name}"?`,
      description: "Data outlet dan relasinya akan dihapus permanen.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => {
        setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
        toast.success(`Outlet "${tenant.name}" berhasil dihapus!`);
      },
    });
  };

  const handleSave = (tenantData: {
    code: string;
    name: string;
    owner_name: string;
    phone: string;
    address: string;
    is_active: boolean;
  }) => {
    if (selectedTenant) {
      setTenants((prev) =>
        prev.map((t) => (t.id === selectedTenant.id ? { ...t, ...tenantData } : t))
      );
      toast.success(`Outlet "${tenantData.name}" berhasil diperbarui!`);
    } else {
      const newTenant: Tenant = {
        id: `ten-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...tenantData,
      };
      setTenants((prev) => [newTenant, ...prev]);
      toast.success(`Outlet "${tenantData.name}" berhasil didaftarkan!`);
    }
  };

  // ── Data Processing ──────────────────────────────────────────────────────────
  const filtered = tenants.filter((row) => {
    if (
      search &&
      !row.name.toLowerCase().includes(search.toLowerCase()) &&
      !row.code.toLowerCase().includes(search.toLowerCase()) &&
      !row.owner_name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (activeFilters.status) {
      const isActFilter = activeFilters.status === "true";
      if (row.is_active !== isActFilter) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key as keyof Tenant];
    const bValue = b[sort.key as keyof Tenant];

    if (aValue === null || aValue === undefined) return sort.dir === "asc" ? 1 : -1;
    if (bValue === null || bValue === undefined) return sort.dir === "asc" ? -1 : 1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sort.dir === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
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
  const activeCount = tenants.filter((t) => t.is_active).length;
  const inactiveCount = tenants.filter((t) => !t.is_active).length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Tenant Management"
        subtitle={`${tenants.length} outlet terdaftar`}
        actionLabel="Tambah Outlet"
        onAction={() => {
          setSelectedTenant(null);
          setShowCreateModal(true);
        }}
        extraActions={
          <Button
            variant="outline"
            className="flex items-center gap-2 border-dashed h-9"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={14} />
            <span>Import CSV</span>
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Outlet",
            value: `${tenants.length} Outlet`,
            icon: <Store className="text-indigo-600" size={18} />,
            bg: "bg-indigo-50 border-indigo-100 text-indigo-700",
          },
          {
            label: "Outlet Aktif",
            value: `${activeCount} Aktif`,
            icon: <CheckCircle className="text-emerald-600" size={18} />,
            bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          },
          {
            label: "Outlet Non-Aktif",
            value: `${inactiveCount} Non-Aktif`,
            icon: <ShieldAlert className="text-rose-600" size={18} />,
            bg: "bg-rose-50 border-rose-100 text-rose-700",
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
            placeholder="Cari kode, nama, atau owner..."
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
        <CardList<Tenant>
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          emptyMessage="Belum ada outlet terdaftar."
          renderItem={(tenant) => (
            <TenantCard
              key={tenant.id}
              data={tenant}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      ) : (
        <TenantTable
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          sort={sort}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Belum ada outlet terdaftar."
        />
      )}

      <FormModalCreateTenant
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        editData={selectedTenant}
        onSave={handleSave}
      />

      <FormModalImportTenant
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(importedTenants) => {
          setTenants((prev) => [...importedTenants, ...prev]);
        }}
      />
    </div>
  );
}
