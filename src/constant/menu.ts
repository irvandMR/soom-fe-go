
import {Archive, Banknote, Factory, Grid, LayoutDashboard, Package, ShoppingCart, Store, Tags, Users} from 'lucide-react'
import { ROUTES } from './routes'

export const MENUS = [
  {
    label: 'Main Menu',
    permission: 'all',
    items: [
      { label: 'Dashboard',      path: ROUTES.DASHBOARD,   icon: LayoutDashboard, exact: true },
      { label: 'Order',          path: ROUTES.ORDERS,      icon: ShoppingCart },
      { label: 'Stok Bahan Baku',path: ROUTES.INGREDIENTS, icon: Package },
      { label: 'Produk & Resep', path: ROUTES.PRODUCTS,    icon: Archive },
      { label: 'Produksi',       path: ROUTES.PRODUCTIONS, icon: Factory },
      { label: 'Keuangan',       path: ROUTES.CASH_FLOW,   icon: Banknote },
    ],
  },
  {
    label: 'Settings',
    permission: 'all',
    items: [
      { label: 'Units',    path: ROUTES.UNITS,       icon: Grid },
      { label: 'Kategori', path: ROUTES.CATEGORIES,  icon: Tags },
    ],
  },
  {
    label: 'Administrator',
    permission: 'admin',
    items: [
      { label: 'User Management',   path: ROUTES.USERS,   icon: Users },
      { label: 'Tenant Management', path: ROUTES.TENANT,  icon: Store },
    ],
  },
]