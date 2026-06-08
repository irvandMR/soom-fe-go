import { useState } from "react";
import PageHeader from "@/components/widget/PageHeader";
import SearchInput from "@/components/widget/SearchInput";
import DataTable from "@/components/widget/DataTable";
// import CardList from '@/components/widget/CardList'
import Pagination from "@/components/widget/Pagination";
import {
  useUnitQuery,
  type Unit,
} from "@/components/features/unit/useUnitQuery";
import UnitTable from "@/components/features/unit/UnitTable";
import UnitCard from "@/components/features/unit/UnitCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import BannerBackground from "@/components/common/BannerBackground";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import FormModalUnit from "@/components/features/unit/FormModalUnit";
import { confirm } from "@/store/useConfirmStore";
import { useDeleteUnit } from "@/components/features/unit/useUnitMutation";
import { BASE_UNIT } from "@/constant/options";

export default function UnitPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const { isMobile } = useBreakpoint();

  const {
    rows,
    meta,
    isLoading,
    isError,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    activeFilters,
    setFilter,
    resetFilters,
  } = useUnitQuery();

  const filterOptions = [
    {
      key: "base_unit",
      label: "Unit Dasar",
      options: BASE_UNIT,
    },
  ];

  const deleteMutation = useDeleteUnit();

  const handleEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowAddModal(true);
  };

  const handleDelete = (unit: Unit) => {
    confirm({
      title: `Hapus unit "${unit.Name}"?`,
      description: "Data yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => deleteMutation.mutate(unit.Id),
    });
  };

  const handleClose = () => {
    setShowAddModal(false);
    setSelectedUnit(null);
  };

  const emptyMessage = search
    ? `Tidak ada unit untuk "${search}"`
    : "Belum ada unit.";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Units"
        subtitle={meta ? `${meta.total} unit terdaftar` : undefined}
        actionLabel="Tambah Unit"
        onAction={() => setShowAddModal(true)}
      />

      <BannerBackground
        variant="subtle"
        className="flex flex-col gap-2 p-3 rounded-lg border"
      >
        {/* Toolbar Row */}
        <div className="flex items-center  gap-3 flex-wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama unit atau simbol..."
            className="w-full sm:max-w-sm"
          />

          <FilterBar
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={setFilter}
            onReset={resetFilters}
            allOptionLabel="Semua Unit Dasar"
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
        <CardList<Unit>
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          emptyMessage={emptyMessage}
          renderItem={(unit) => (
            <UnitCard
              key={unit.Id}
              data={unit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      ) : (
        <UnitTable
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          sort={sort}
          onSort={setSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={emptyMessage}
        />
      )}

      <FormModalUnit
        open={showAddModal}
        onClose={handleClose}
        editData={selectedUnit}
      />
    </div>
  );
}
