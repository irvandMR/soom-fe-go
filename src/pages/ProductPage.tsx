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

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Roti Tawar Kupas",
    type: "MADE_TO_STOCK",
    category_name: "Roti",
    unit_name: "Pack",
    unit_symbol: "pack",
    stock_qty: 45,
    estimated_cost: 8500,
    active_recipe_version: 1,
    is_active: true,
  },
  {
    id: "prod-2",
    name: "Baguette Parisienne",
    type: "MADE_TO_STOCK",
    category_name: "Roti",
    unit_name: "Pcs",
    unit_symbol: "pcs",
    stock_qty: 12,
    estimated_cost: 11000,
    active_recipe_version: 2,
    is_active: true,
  },
  {
    id: "prod-3",
    name: "Croissant Almond",
    type: "MADE_TO_STOCK",
    category_name: "Roti",
    unit_name: "Pcs",
    unit_symbol: "pcs",
    stock_qty: 24,
    estimated_cost: 14500,
    active_recipe_version: 1,
    is_active: true,
  },
  {
    id: "prod-4",
    name: "Custom Birthday Cake Choco 20cm",
    type: "MADE_TO_ORDER",
    category_name: "Kue Basah",
    unit_name: "Loyang",
    unit_symbol: "lyg",
    stock_qty: 0,
    estimated_cost: 75000,
    active_recipe_version: 1,
    is_active: true,
  },
  {
    id: "prod-5",
    name: "Kopi Susu Gula Aren 1L",
    type: "MADE_TO_STOCK",
    category_name: "Minuman",
    unit_name: "Botol",
    unit_symbol: "btl",
    stock_qty: 80,
    estimated_cost: 9500,
    active_recipe_version: null,
    is_active: true,
  },
  {
    id: "prod-6",
    name: "Selai Coklat Hazelnut Jar 250g",
    type: "RESELL",
    category_name: "Bahan Pembantu",
    unit_name: "Jar",
    unit_symbol: "jar",
    stock_qty: 15,
    estimated_cost: 22000,
    active_recipe_version: null,
    is_active: true,
  },
  {
    id: "prod-7",
    name: "Matcha Latte Bottle 250ml",
    type: "MADE_TO_STOCK",
    category_name: "Minuman",
    unit_name: "Botol",
    unit_symbol: "btl",
    stock_qty: 60,
    estimated_cost: 7000,
    active_recipe_version: 1,
    is_active: false,
  },
];

const filterOptions = [
  {
    key: "category",
    label: "Kategori",
    options: [
      { label: "Roti", value: "Roti" },
      { label: "Kue Basah", value: "Kue Basah" },
      { label: "Minuman", value: "Minuman" },
      { label: "Bahan Pembantu", value: "Bahan Pembantu" },
    ],
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

export default function ProductPage() {
  const { isMobile } = useBreakpoint();

  // ── States ──────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>({ key: "name", dir: "asc" });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      toast.success("Data produk berhasil diperbarui! (Mock)");
    }, 500);
  };

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

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              active_recipe_version: version,
              ...(cost !== undefined ? { estimated_cost: cost } : {}),
            }
          : p
      )
    );
    setSelectedProduct((prev) =>
      prev
        ? {
            ...prev,
            active_recipe_version: version,
            ...(cost !== undefined ? { estimated_cost: cost } : {}),
          }
        : null
    );
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

  // ── Data Processing ──────────────────────────────────────────────────────────
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Category filter
    if (activeFilters.category && product.category_name !== activeFilters.category) {
      return false;
    }
    // Type filter
    if (activeFilters.type && product.type !== activeFilters.type) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key as keyof Product];
    const bValue = b[sort.key as keyof Product];

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
  const totalPages = Math.ceil(sortedProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + limit);

  const meta = {
    total: sortedProducts.length,
    page,
    limit,
    total_pages: totalPages || 1,
  };

  const emptyMessage = search
    ? `Tidak ada produk untuk "${search}"`
    : "Belum ada produk terdaftar.";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Produk & Resep"
        subtitle={`${products.length} produk terdaftar`}
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
        <CardList<Product>
          rows={paginatedProducts}
          isLoading={isLoading}
          isError={false}
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
          rows={paginatedProducts}
          isLoading={isLoading}
          isError={false}
          sort={sort}
          onSort={handleSort}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onRecipe={handleRecipe}
          onDelete={handleDelete}
          emptyMessage={emptyMessage}
        />
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}
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
