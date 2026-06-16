import { useState } from "react";
import BannerBackground from "@/components/common/BannerBackground";
import { useGetCategoryAll } from "@/components/features/categories/useCategoriesQuery";
import FormModalCreateIngredient from "@/components/features/ingredient/FormModalCreateIngredient";
import FormModalStockInIngredient from "@/components/features/ingredient/FormModalStockInIngredient";
import FormModalEditIngredient from "@/components/features/ingredient/FormModalEditInredient";
import ModalHistoryIngredient from "@/components/features/ingredient/ModalHistoryInredient";
import IngredientsTabel from "@/components/features/ingredient/ingredientTable";
import IngredientCard from "@/components/features/ingredient/ingredientCard";
import { useDeleteIngredient } from "@/components/features/ingredient/useIngredientMutation";
import { useIngredientsQuery } from "@/components/features/ingredient/useIngredientQuery";
import { useIngredientModals } from "@/components/features/ingredient/useIngredientModals";
import FilterBar from "@/components/widget/FilterBar";
import PageHeader from "@/components/widget/PageHeader";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import CardList from "@/components/widget/CardList";
import { status } from "@/constant/options";
import { confirm } from "@/store/useConfirmStore";
import type { Ingredients } from "@/types/ingredients.type";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export default function Ingredientpage() {
  const modals = useIngredientModals();
  const deleteMutation = useDeleteIngredient();
  const { isMobile } = useBreakpoint();

  const [activeTab, setActiveTab] = useState<"ingredient" | "packaging">("ingredient");

  const {
    rows,
    meta,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    activeFilters,
    setFilter,
    resetFilters,
  } = useIngredientsQuery();

  const handleTabChange = (tab: "ingredient" | "packaging") => {
    setActiveTab(tab);
    setPage(1);
  };

  const filteredRows = rows.filter((item) => {
    const categoryName = (item.category_name || "").toLowerCase();
    const isPackaging =
      categoryName.includes("kemasan") ||
      categoryName.includes("packaging") ||
      categoryName.includes("bahan pembantu") ||
      categoryName.includes("box") ||
      categoryName.includes("wadah");
    return activeTab === "packaging" ? isPackaging : !isPackaging;
  });

  // History query dipindah ke dalam modal masing-masing

  const { data: categoryOption = [] } = useGetCategoryAll();

  const filteredFilterCategories = categoryOption.filter((cat: any) => {
    const typeStr = (cat.type || "").toLowerCase();
    const nameStr = (cat.name || "").toLowerCase();
    const isPackaging =
      typeStr.includes("packaging") ||
      typeStr.includes("kemasan") ||
      typeStr.includes("box") ||
      nameStr.includes("packaging") ||
      nameStr.includes("kemasan") ||
      nameStr.includes("box") ||
      nameStr.includes("wadah");
    return activeTab === "packaging" ? isPackaging : !isPackaging;
  });

  const filterOptions = [
    {
      key: "category_id",
      label: "Kategori",
      options: filteredFilterCategories.map((t: any) => ({
        label: t.name,
        value: t.id,
      })),
    },
    {
      key: "status",
      label: "Tipe",
      options: status,
    },
  ];

  const handleDelete = (ingredient: Ingredients) => {
    confirm({
      title: `Hapus Bahan "${ingredient.name}"?`,
      description: "Data yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => deleteMutation.mutate(ingredient.id),
    });
  };

  const emptyMessage = search
    ? `Tidak ada ${activeTab === "packaging" ? "kemasan & wadah" : "bahan baku"} untuk "${search}"`
    : `Belum ada ${activeTab === "packaging" ? "kemasan & wadah" : "bahan baku"}.`;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={activeTab === "packaging" ? "Stock Kemasan & Wadah" : "Stock Bahan Baku"}
        subtitle={meta ? `${meta.total} item terdaftar` : undefined}
        actionLabel={activeTab === "packaging" ? "Tambah Kemasan" : "Tambah Bahan Baku"}
        onAction={modals.openAdd}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl self-start">
        {[
          { key: "ingredient", label: "Bahan Baku" },
          { key: "packaging", label: "Kemasan & Wadah" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as any)}
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

      <BannerBackground
        variant="subtle"
        className="flex flex-col gap-2 p-3 rounded-lg border"
      >
        {/* Toolbar Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={activeTab === "packaging" ? "Cari nama kemasan..." : "Cari nama bahan baku..."}
            className="w-full sm:max-w-sm"
          />

          <Button
            variant="outline-secondary"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => refetch()}
            title="Refresh data"
          >
            <RefreshCw size={13} className="text-white" />
          </Button>

          <FilterBar
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={setFilter}
            onReset={resetFilters}
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
        <CardList<Ingredients>
          rows={filteredRows}
          isLoading={isLoading}
          isError={isError}
          emptyMessage={emptyMessage}
          renderItem={(ingredient) => (
            <IngredientCard
              key={ingredient.id}
              data={ingredient}
              onEdit={modals.openEdit}
              onDelete={handleDelete}
              onStockIn={modals.openStockIn}
              onHistory={modals.openHistory}
            />
          )}
        />
      ) : (
        <IngredientsTabel
          rows={filteredRows}
          isLoading={isLoading}
          isError={isError}
          sort={sort}
          onSort={setSort}
          onEdit={modals.openEdit}
          onStockIn={modals.openStockIn}
          onDelete={handleDelete}
          onHistory={modals.openHistory}
          emptyMessage={emptyMessage}
          isPackaging={activeTab === "packaging"}
        />
      )}

      {/* ── Modals ─────────────────────────────────────────────── */}
      <FormModalCreateIngredient
        open={modals.showAdd}
        onClose={modals.closeAll}
        defaultCategoryType={activeTab}
      />

      <FormModalStockInIngredient
        open={modals.showStockIn}
        onClose={modals.closeAll}
        ingredientData={modals.selected}
      />

      <FormModalEditIngredient
        open={modals.showEdit}
        onClose={modals.closeAll}
        ingredientData={modals.selected}
      />

      <ModalHistoryIngredient
        open={modals.showHistory}
        onClose={modals.closeAll}
        ingredientData={modals.selected}
      />
    </div>
  );
}
