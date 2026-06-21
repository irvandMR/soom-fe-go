import { useState } from "react";
import BannerBackground from "@/components/common/BannerBackground";
import ProductTable from "@/components/features/product/ProductTable";
import ProductCard from "@/components/features/product/ProductCard";
import CardList from "@/components/widget/CardList";
import FilterBar from "@/components/widget/FilterBar";
import PageHeader from "@/components/widget/PageHeader";
import Pagination from "@/components/widget/Pagination";
import SearchInput from "@/components/widget/SearchInput";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { confirm } from "@/store/useConfirmStore";
import type { Product } from "@/types/product.type";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { SortState } from "@/hooks/useDataQuery";
import FormModalCreateProduct from "@/components/features/product/FormModalCreateProduct";
import DetailProductModal from "@/components/features/product/DetailProductModal";
import RecipeManageModal, { MOCK_RECIPE_HISTORY } from "@/components/features/product/RecipeManageModal";
import { useProductQuery } from "@/components/features/product/useProductQuery";
import { useGetCategoryAll } from "@/components/features/categories/useCategoriesQuery";



export default function ProductPage() {
  const { isMobile } = useBreakpoint();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    resetFilters, } = useProductQuery()

  const { data: categoryOption = [] } = useGetCategoryAll();


  const filterOptions = [
    {
      key: "category_id",
      label: "Kategori",
      options: categoryOption.map((t: any) => ({
        label: t.name,
        value: t.id,
      })),
    },
    {
      key: "type",
      label: "Tipe",
      options: [
        { label: "Made to Order", value: "MADE_TO_ORDER" },
        { label: "Made to Stock", value: "MADE_TO_STOCK" },
        { label: "Resell", value: "RESELL" },
      ],
    },
  ];


  // ── Handlers ────────────────────────────────────────────────────────────────
  // const handleFilterChange = (key: string, val: string) => {
  //   setActiveFilters((prev) => {
  //     const next = { ...prev };
  //     if (!val) {
  //       delete next[key];
  //     } else {
  //       next[key] = val;
  //     }
  //     return next;
  //   });
  //   setPage(1);
  // };

  // const handleResetFilters = () => {
  //   setActiveFilters({});
  //   setPage(1);
  // };

  // const handleSort = (key: string) => {
  //   setSort((prev) => {
  //     if (prev?.key === key) {
  //       return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
  //     }
  //     return { key, dir: "asc" };
  //   });
  // };

  // const handleRefresh = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     toast.success("Data produk berhasil diperbarui! (Mock)");
  //   }, 500);
  // };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  const handleDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleRecipe = (product: Product) => {
    setSelectedProduct(product);
    setShowRecipeModal(true);
  };

  const handleActivateVersion = (productId: string, version: number) => {
    const history = MOCK_RECIPE_HISTORY[productId] || [];
    const recipe = history.find((h) => h.version === version);
    const cost = recipe ? recipe.cost : undefined;

    // setProducts((prev) =>
    //   prev.map((p) =>
    //     p.id === productId
    //       ? {
    //         ...p,
    //         active_recipe_version: version,
    //         ...(cost !== undefined ? { estimated_cost: cost } : {}),
    //       }
    //       : p
    //   )
    // );
    // setSelectedProduct((prev) =>
    //   prev
    //     ? {
    //       ...prev,
    //       active_recipe_version: version,
    //       ...(cost !== undefined ? { estimated_cost: cost } : {}),
    //     }
    //     : null
    // );
  };

  const handleDelete = (product: Product) => {
    confirm({
      title: `Hapus Produk "${product.name}"?`,
      description: "Data yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => {
        toast.success(`Produk "${product.name}" berhasil dihapus! (Mock)`);
      },
    });
  };






  const emptyMessage = search
    ? `Tidak ada produk untuk "${search}"`
    : "Belum ada produk terdaftar.";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Produk & Resep"
        subtitle={meta ? `${meta.total} produk terdaftar` : undefined}
        actionLabel="Tambah Produk"
        onAction={() => {
          setSelectedProduct(null);
          setShowCreateModal(true);
        }}
      />

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
            placeholder="Cari nama produk..."
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
        <CardList<Product>
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          emptyMessage={emptyMessage}
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              data={product}
              onEdit={handleEdit}
              onDetail={handleDetail}
              onRecipe={handleRecipe}
              onDelete={handleDelete}
            />
          )}
        />
      ) : (
        <ProductTable
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          sort={sort}
          onSort={setSort}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onRecipe={handleRecipe}
          onDelete={handleDelete}
          emptyMessage={emptyMessage}
        />
      )}

      <FormModalCreateProduct
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        editData={selectedProduct}
      />

      <DetailProductModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={selectedProduct}
        onManageRecipe={() => {
          setShowDetailModal(false);
          setShowRecipeModal(true);
        }}
      />

      <RecipeManageModal
        open={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        product={selectedProduct}
        onActivateVersion={(v) => handleActivateVersion(selectedProduct!.id, v)}
      />
    </div>
  );
}
