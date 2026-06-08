import BannerBackground from "@/components/common/BannerBackground";
import CategoriesTable from "@/components/features/categories/CategoriesTable";
import FormModalCategories from "@/components/features/categories/FormModalCategories";
import {
  useDeleteCategories,
  useGetCategoriesType,
} from "@/components/features/categories/useCategoriesMutation";
import { useCategoriesQuery } from "@/components/features/categories/useCategoriesQuery";
import FilterBar from "@/components/widget/FilterBar";
import PageHeader from "@/components/widget/PageHeader";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { confirm } from "@/store/useConfirmStore";
import type { Categories } from "@/types/categories.type";
import { useState } from "react";

export default function CategoriPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<Categories | null>(
    null,
  );
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
  } = useCategoriesQuery();

  const deleteMutation = useDeleteCategories();
  const { data = [] } = useGetCategoriesType();
  const typeOption = data.map((t: Categories) => ({
    label: t.Name,
    value: t.Type,
  }));

  const filterOptions = [
    {
      key: "ype",
      label: "Tipe",
      options: typeOption,
    },
  ];

  const handleEdit = (categories: Categories) => {
    setSelectedCategorie(categories);
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setSelectedCategorie(null);
  };

  const handleDelete = (categories: Categories) => {
    confirm({
      title: `Hapus unit "${categories.Name}"?`,
      description: "Data yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => deleteMutation.mutate(categories.Id),
    });
  };

  const emptyMessage = search
    ? `Tidak ada kategori untuk "${search}"`
    : "Belum ada kategori.";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Kategori"
        subtitle={meta ? `${meta.total} kategori terdaftar` : undefined}
        actionLabel="Tambah Kategori"
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

      <CategoriesTable
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        sort={sort}
        onSort={setSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage={emptyMessage}
      />

      <FormModalCategories
        open={showAddModal}
        onClose={handleClose}
        editData={selectedCategorie}
      />
    </div>
  );
}
