import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import { useAuthStore } from "@/store/useAuthStore";
import BannerBackground from "@/components/common/BannerBackground";
import UserTable from "@/components/features/user/UserTable";
import UserCard from "@/components/features/user/UserCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import PageHeader from "@/components/widget/PageHeader";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { confirm } from "@/store/useConfirmStore";
import type { User } from "@/types/user.type";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, ShieldAlert, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import type { SortState } from "@/hooks/useDataQuery";
import FormModalCreateUser from "@/components/features/user/FormModalCreateUser";
import FormModalImportUser from "@/components/features/user/FormModalImportUser";
import { useActiveTenantStore } from "@/store/useActiveTenantStore";

const DUMMY_USERS: User[] = [
  {
    id: "usr-1",
    name: "Rizky Irvandi",
    email: "irvandi@soom.com",
    role: "owner",
    is_active: true,
    tenantId: "ten-1",
  },
  {
    id: "usr-2",
    name: "Budi Santoso",
    email: "budi.kasir@soom.com",
    role: "karyawan",
    is_active: true,
    tenantId: "ten-1",
  },
  {
    id: "usr-3",
    name: "Siti Rahma",
    email: "siti.staff@soom.com",
    role: "karyawan",
    is_active: true,
    tenantId: "ten-2",
  },
  {
    id: "usr-4",
    name: "Andi Wijaya",
    email: "andi@soom.com",
    role: "karyawan",
    is_active: false,
    tenantId: "ten-3",
  },
];

const filterOptions = [
  {
    key: "role",
    label: "Role",
    options: [
      { label: "Owner", value: "owner" },
      { label: "Karyawan", value: "karyawan" },
    ],
  },
];

export default function UserManagementPage() {
  const { isMobile } = useBreakpoint();
  const { activeTenantId } = useActiveTenantStore();
  const { user: currentUser } = useAuthStore();

  if (currentUser && currentUser.role !== "superadmin" && currentUser.role !== "owner") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // ── States ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("soom-users");
    return saved ? JSON.parse(saved) : DUMMY_USERS;
  });

  useEffect(() => {
    localStorage.setItem("soom-users", JSON.stringify(users));
  }, [users]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>({ key: "name", dir: "asc" });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
      toast.success("Data pengguna diperbarui! (Mock)");
    }, 500);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowCreateModal(true);
  };

  const handleDelete = (user: User) => {
    if (currentUser && user.email === currentUser.email) {
      toast.error("Anda tidak bisa menghapus akun Anda sendiri!");
      return;
    }
    confirm({
      title: `Hapus Pengguna "${user.name}"?`,
      description: "Data pengguna akan dihapus secara permanen.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success(`Pengguna "${user.name}" berhasil dihapus! (Mock)`);
      },
    });
  };

  const handleSave = (userData: { name: string; email: string; role: User["role"]; is_active: boolean; tenantId: string }) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u))
      );
      toast.success(`Pengguna "${userData.name}" berhasil diperbarui! (Mock)`);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        ...userData,
      };
      setUsers((prev) => [...prev, newUser]);
      toast.success(`Pengguna "${userData.name}" berhasil ditambahkan! (Mock)`);
    }
  };

  // ── Data Processing ──────────────────────────────────────────────────────────
  const tenantUsers = users.filter((u) => u.tenantId === activeTenantId);

  const filtered = tenantUsers.filter((row) => {
    if (search && !row.name.toLowerCase().includes(search.toLowerCase()) && !row.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (activeFilters.role && row.role !== activeFilters.role) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key as keyof User];
    const bValue = b[sort.key as keyof User];

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
  const activeCount = tenantUsers.filter((u) => u.is_active).length;
  const ownerCount = tenantUsers.filter((u) => u.role === "owner").length;
  const employeeCount = tenantUsers.filter((u) => u.role === "karyawan").length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="User Management"
        subtitle={`${tenantUsers.length} user terdaftar`}
        actionLabel="Tambah User"
        onAction={() => {
          setSelectedUser(null);
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
            label: "Total Pengguna",
            value: `${tenantUsers.length} Pengguna`,
            icon: <Users className="text-indigo-600" size={18} />,
            bg: "bg-indigo-50 border-indigo-100 text-indigo-700",
          },
          {
            label: "Pengguna Aktif",
            value: `${activeCount} Aktif`,
            icon: <CheckCircle className="text-emerald-600" size={18} />,
            bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          },
          {
            label: "Distribusi Role",
            value: `${ownerCount} Owner, ${employeeCount} Staf`,
            icon: <ShieldAlert className="text-amber-600" size={18} />,
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
            placeholder="Cari nama atau email..."
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
        <CardList<User>
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          emptyMessage="Belum ada pengguna."
          renderItem={(user) => (
            <UserCard
              key={user.id}
              data={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      ) : (
        <UserTable
          rows={paginated}
          isLoading={isLoading}
          isError={false}
          sort={sort}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Belum ada pengguna."
        />
      )}

      <FormModalCreateUser
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        editData={selectedUser}
        onSave={handleSave}
      />

      <FormModalImportUser
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(importedUsers) => {
          setUsers((prev) => [...importedUsers, ...prev]);
        }}
      />
    </div>
  );
}
