import React from "react";
import { Factory, Store, ShieldCheck } from "lucide-react";

export const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "default" }
> = {
  DONE: { label: "Selesai", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  CANCELLED: { label: "Batal", variant: "destructive" },
  CANCEL: { label: "Batal", variant: "destructive" },
};

export const TENANT_DATA_MAP: Record<string, {
  pemasukan: number;
  pengeluaran: number;
  subtextPemasukan: string;
  subtextPengeluaran: string;
  chartData: { day: string; pemasukan: number; pengeluaran: number }[];
  breakdownTitle: string;
  breakdownData: { name: string; sales: number; color: string }[];
  orders: { id: string; customerName: string; orderNumber: string; orderDate: string; status: string; totalAmount: number }[];
  activities: { id: string; time: string; text: string; type: string; user: string }[];
  expiring: { id: string; productName: string; productionDate: string; expiryDate: string; quantity: number; unit: string }[];
  alerts: { id: string; name: string; stockQuantity: number; minimumStock: number; unitSymbol: string }[];
  card4Label: string;
  card4Value: string;
  card4Subtext: string;
  card4Icon: React.ReactNode;
}> = {
  "ten-1": {
    pemasukan: 12500000,
    pengeluaran: 8900000,
    subtextPemasukan: "+14.2% vs bulan lalu (Sudirman)",
    subtextPengeluaran: "-3.5% efisiensi bahan kue",
    chartData: [
      { day: "Sen", pemasukan: 1800000, pengeluaran: 800000 },
      { day: "Sel", pemasukan: 2500000, pengeluaran: 1200000 },
      { day: "Rab", pemasukan: 1500000, pengeluaran: 900000 },
      { day: "Kam", pemasukan: 3200000, pengeluaran: 1500000 },
      { day: "Jum", pemasukan: 2100000, pengeluaran: 1100000 },
      { day: "Sab", pemasukan: 3800000, pengeluaran: 1800000 },
      { day: "Min", pemasukan: 2900000, pengeluaran: 1300000 },
    ],
    breakdownTitle: "Menu Terlaris (Kuantitas)",
    breakdownData: [
      { name: "Roti Tawar Kupas", sales: 6200000, color: "#6366f1" },
      { name: "Sourdough Plain", sales: 3800000, color: "#10b981" },
      { name: "Croissant Almond", sales: 2500000, color: "#f59e0b" },
    ],
    orders: [
      { id: "1", customerName: "Rizky Irvandi", orderNumber: "ORD-SUD-001", orderDate: "2026-06-13T09:12:00Z", status: "DONE", totalAmount: 125000 },
      { id: "2", customerName: "Jane Doe", orderNumber: "ORD-SUD-002", orderDate: "2026-06-13T08:30:00Z", status: "PENDING", totalAmount: 45000 },
      { id: "3", customerName: "John Smith", orderNumber: "ORD-SUD-003", orderDate: "2026-06-12T17:45:00Z", status: "DONE", totalAmount: 89000 },
    ],
    activities: [
      { id: "act-1", time: "15 menit lalu", text: "Siti Rahma menyelesaikan batch produksi Croissant Almond #prd-3.", type: "PRODUCTION", user: "Siti" },
      { id: "act-2", time: "1 jam lalu", text: "Budi Santoso memasukkan transaksi pengeluaran listrik Rp 450.000.", type: "FINANCE", user: "Budi" },
      { id: "act-3", time: "2 jam lalu", text: "Sistem mendeteksi sisa stok Mentega di bawah batas minimum.", type: "ALERT", user: "System" },
    ],
    expiring: [
      { id: "1", productName: "Roti Maryam", productionDate: "2026-06-10", expiryDate: "2026-06-13", quantity: 20, unit: "pcs" },
      { id: "2", productName: "Croissant", productionDate: "2026-06-11", expiryDate: "2026-06-14", quantity: 15, unit: "pcs" },
    ],
    alerts: [
      { id: "1", name: "Tepung Terigu", stockQuantity: 2, minimumStock: 10, unitSymbol: "kg" },
      { id: "2", name: "Mentega", stockQuantity: 1, minimumStock: 5, unitSymbol: "kg" },
    ],
    card4Label: "Batch Produksi Dapur",
    card4Value: "8 Batch",
    card4Subtext: "100% lolos kontrol kualitas",
    card4Icon: <Factory size={18} className="text-indigo-600" />,
  },
  "ten-2": {
    pemasukan: 9300000,
    pengeluaran: 5200000,
    subtextPemasukan: "+8.5% promo kopi susu (Dago)",
    subtextPengeluaran: "-5.0% sewa blender cafe",
    chartData: [
      { day: "Sen", pemasukan: 1200000, pengeluaran: 400000 },
      { day: "Sel", pemasukan: 1800000, pengeluaran: 700000 },
      { day: "Rab", pemasukan: 1100000, pengeluaran: 500000 },
      { day: "Kam", pemasukan: 2300000, pengeluaran: 1200000 },
      { day: "Jum", pemasukan: 1600000, pengeluaran: 700000 },
      { day: "Sab", pemasukan: 2700000, pengeluaran: 1000000 },
      { day: "Min", pemasukan: 2000000, pengeluaran: 700000 },
    ],
    breakdownTitle: "Kategori Terlaris (Kopi/Bites)",
    breakdownData: [
      { name: "Kopi Susu Aren", sales: 5500000, color: "#6366f1" },
      { name: "Cemilan & Pastry", sales: 2300000, color: "#10b981" },
      { name: "Minuman Non-Kopi", sales: 1500000, color: "#f59e0b" },
    ],
    orders: [
      { id: "1", customerName: "Andi Wijaya", orderNumber: "ORD-DAG-001", orderDate: "2026-06-13T07:45:00Z", status: "DONE", totalAmount: 75000 },
      { id: "2", customerName: "Rina Marlina", orderNumber: "ORD-DAG-002", orderDate: "2026-06-12T19:30:00Z", status: "DONE", totalAmount: 112000 },
      { id: "3", customerName: "Eko Prasetyo", orderNumber: "ORD-DAG-003", orderDate: "2026-06-12T11:20:00Z", status: "DONE", totalAmount: 310000 },
    ],
    activities: [
      { id: "act-1", time: "10 menit lalu", text: "Kasir Dago mencatat transaksi harian kasir Rp 1.250.000.", type: "FINANCE", user: "Budi" },
      { id: "act-2", time: "2 jam lalu", text: "Rizky Irvandi memperbarui detail jam buka SOOM Express - Dago.", type: "TENANT", user: "Rizky" },
    ],
    expiring: [
      { id: "1", productName: "Pain au Chocolat", productionDate: "2026-06-11", expiryDate: "2026-06-16", quantity: 24, unit: "pcs" },
    ],
    alerts: [
      { id: "1", name: "Telur Ayam", stockQuantity: 5, minimumStock: 20, unitSymbol: "butir" },
      { id: "2", name: "Gula Pasir", stockQuantity: 3, minimumStock: 8, unitSymbol: "kg" },
    ],
    card4Label: "Efisiensi Operasional",
    card4Value: "94.2%",
    card4Subtext: "Indeks kepuasan pelanggan",
    card4Icon: <ShieldCheck size={18} className="text-indigo-600" />,
  },
  "ten-3": {
    pemasukan: 3600000,
    pengeluaran: 8500000,
    subtextPemasukan: "Wholesale internal transfer dapur",
    subtextPengeluaran: "Pembelian terigu bulk 25kg",
    chartData: [
      { day: "Sen", pemasukan: 500000, pengeluaran: 1500000 },
      { day: "Sel", pemasukan: 800000, pengeluaran: 2100000 },
      { day: "Rab", pemasukan: 400000, pengeluaran: 1200000 },
      { day: "Kam", pemasukan: 900000, pengeluaran: 1800000 },
      { day: "Jum", pemasukan: 600000, pengeluaran: 1000000 },
      { day: "Sab", pemasukan: 1100000, pengeluaran: 2500000 },
      { day: "Min", pemasukan: 800000, pengeluaran: 900000 },
    ],
    breakdownTitle: "Tujuan Pengiriman Dapur",
    breakdownData: [
      { name: "Kirim ke Sudirman", sales: 2100000, color: "#6366f1" },
      { name: "Kirim ke Dago", sales: 1500000, color: "#10b981" },
    ],
    orders: [], // Kitchen has no customer retail orders
    activities: [
      { id: "act-1", time: "1 jam lalu", text: "Siti Rahma menyelesaikan batch produksi Baguette Parisienne v2.", type: "PRODUCTION", user: "Siti" },
      { id: "act-2", time: "3 jam lalu", text: "Pengeluaran pembelian terigu segitiga biru 25kg Rp 285.000.", type: "FINANCE", user: "Siti" },
    ],
    expiring: [
      { id: "1", productName: "Kue Bolu Coklat", productionDate: "2026-06-12", expiryDate: "2026-06-15", quantity: 8, unit: "loyang" },
    ],
    alerts: [
      { id: "1", name: "Mentega", stockQuantity: 1, minimumStock: 5, unitSymbol: "kg" },
    ],
    card4Label: "Batch Terdistribusi",
    card4Value: "15 Cabang",
    card4Subtext: "Distribusi logistik lancar",
    card4Icon: <Store size={18} className="text-indigo-600" />,
  },
  "ten-4": {
    pemasukan: 0,
    pengeluaran: 0,
    subtextPemasukan: "Outlet dibekukan sementara",
    subtextPengeluaran: "Operasional dinonaktifkan",
    chartData: [
      { day: "Sen", pemasukan: 0, pengeluaran: 0 },
      { day: "Sel", pemasukan: 0, pengeluaran: 0 },
      { day: "Rab", pemasukan: 0, pengeluaran: 0 },
      { day: "Kam", pemasukan: 0, pengeluaran: 0 },
      { day: "Jum", pemasukan: 0, pengeluaran: 0 },
      { day: "Sab", pemasukan: 0, pengeluaran: 0 },
      { day: "Min", pemasukan: 0, pengeluaran: 0 },
    ],
    breakdownTitle: "Kontribusi Penjualan",
    breakdownData: [],
    orders: [],
    activities: [
      { id: "act-1", time: "1 bulan lalu", text: "Tenant SOOM Margonda dinonaktifkan sementara oleh platform.", type: "TENANT", user: "System" },
    ],
    expiring: [],
    alerts: [],
    card4Label: "Status Operasional",
    card4Value: "TUTUP",
    card4Subtext: "Kontak admin untuk reaktivasi",
    card4Icon: <Store size={18} className="text-slate-400" />,
  },
};
