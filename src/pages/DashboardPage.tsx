import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constant/routes";
import { useActiveTenantStore, TENANT_OPTIONS } from "@/store/useActiveTenantStore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/utils/format";
import { statusConfig, TENANT_DATA_MAP } from "@/constant/tenantDashboard";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Clock,
  Activity,
  Plus,
} from "lucide-react";

const weeklyCashflowConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "var(--fandm-primary)",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#f43f5e",
  },
} satisfies ChartConfig;

const INGREDIENT_STOCK_PRICE_MAP: Record<string, { price: number; unit: string }> = {
  "tepung terigu": { price: 12000, unit: "kg" },
  "mentega": { price: 80000, unit: "kg" },
  "telur ayam": { price: 2000, unit: "butir" },
  "gula pasir": { price: 15000, unit: "kg" },
};

interface MarginItem {
  id: string;
  name: string;
  price: number;
  hpp: number;
  marginPct: number;
}

const TENANT_MARGIN_CRITICAL_MAP: Record<string, MarginItem[]> = {
  "ten-1": [
    { id: "mc-1", name: "Roti Maryam", price: 12000, hpp: 9600, marginPct: 20 },
    { id: "mc-2", name: "Croissant Almond", price: 22000, hpp: 16500, marginPct: 25 },
  ],
  "ten-2": [
    { id: "mc-3", name: "Cinnamon Roll", price: 18000, hpp: 13500, marginPct: 25 },
    { id: "mc-4", name: "Kopi Susu Aren", price: 15000, hpp: 9750, marginPct: 35 },
  ],
  "ten-3": [],
  "ten-4": [],
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeTenantId } = useActiveTenantStore();
  const isOwner = user?.role === "superadmin" || user?.role === "owner";

  // Get active tenant data context
  const activeTenant = TENANT_OPTIONS.find((t) => t.id === activeTenantId) || TENANT_OPTIONS[0];
  const tenantData = TENANT_DATA_MAP[activeTenantId] || TENANT_DATA_MAP["ten-1"];

  const summaryCards = [
    {
      label: "Pemasukan Outlet",
      value: formatRupiah(tenantData.pemasukan),
      subtext: tenantData.subtextPemasukan,
      icon: <TrendingUp size={18} className="text-emerald-600" />,
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      glowColor: "hover:border-emerald-400 hover:shadow-emerald-100/30",
      iconBg: "bg-emerald-50 border-emerald-100 text-emerald-700",
    },
    {
      label: "Pengeluaran Outlet",
      value: formatRupiah(tenantData.pengeluaran),
      subtext: tenantData.subtextPengeluaran,
      icon: <TrendingDown size={18} className="text-rose-600" />,
      bgGradient: "from-rose-500/10 via-orange-500/5 to-transparent",
      glowColor: "hover:border-rose-400 hover:shadow-rose-100/30",
      iconBg: "bg-rose-50 border-rose-100 text-rose-700",
    },
    {
      label: "Stok Kritis",
      value: `${tenantData.alerts.length} Bahan`,
      subtext: "Perlu restock segera",
      icon: <AlertTriangle size={18} className="text-amber-600" />,
      bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      glowColor: "hover:border-amber-400 hover:shadow-amber-100/30",
      iconBg: "bg-amber-50 border-amber-100 text-amber-700",
    },
    {
      label: tenantData.card4Label,
      value: tenantData.card4Value,
      subtext: tenantData.card4Subtext,
      icon: tenantData.card4Icon,
      bgGradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
      glowColor: "hover:border-indigo-400 hover:shadow-indigo-100/30",
      iconBg: "bg-indigo-50 border-indigo-100 text-indigo-700",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* ─── 1. Header Banner / Command Center ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 shadow-md">
        {/* Decorative background grid elements */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 text-[10px] font-mono tracking-widest uppercase">
                {activeTenant.code}
              </Badge>
              <span className={`h-1.5 w-1.5 rounded-full ${activeTenant.is_active ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              <span className="text-[10px] text-slate-300 font-medium">
                {activeTenant.is_active ? "Sistem Tenant Aktif" : "Sistem Non-Aktif"}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {activeTenant.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl font-medium">
              Dashboard Multi-Tenant Terisolasi. Menampilkan ringkasan data finansial, inventaris stok, dan hasil produksi dapur khusus untuk cabang **{activeTenant.name}**.
            </p>
          </div>

          {/* Quick Stats & Shortcuts */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="flex gap-4 border-r border-slate-700/50 pr-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Peran Anda</span>
                <span className="text-lg font-black text-white block capitalize">{user?.role ?? "Superadmin"}</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Status Dapur</span>
                <span className="text-lg font-black text-white block">
                  {activeTenant.id === "ten-3" ? "Sentral" : activeTenant.id === "ten-4" ? "Off" : "Outlet"}
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            {activeTenant.is_active && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(ROUTES.PRODUCTIONS)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus size={13} />
                  Dapur
                </button>
                <button
                  onClick={() => navigate(ROUTES.CASH_FLOW)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-indigo-500/20"
                >
                  <Plus size={13} />
                  Input Keuangan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. Premium Metrics Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <Card
            key={idx}
            className={`group border-[var(--fandm-border)] overflow-hidden bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-2xl flex flex-col justify-between ${card.glowColor}`}
          >
            <div className={`p-4 flex flex-col gap-3 relative bg-gradient-to-br ${card.bgGradient}`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-xs ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
              
              <div className="mt-1">
                <p className="text-xl font-black text-slate-800 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {card.subtext}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── 3. Charts Section (Tenant Specific Cashflow Area & Sales Breakdown Bar) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Tren Keuangan Mingguan */}
        <Card className="p-4 lg:col-span-2 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tren Aliran Kas Mingguan
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Statistik arus kas keluar & masuk tenant aktif</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded border border-slate-200">
              Juni 2026
            </span>
          </div>

          <ChartContainer config={weeklyCashflowConfig} className="h-[230px] w-full">
            <AreaChart data={tenantData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pemasukan)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-pemasukan)" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="gradPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pengeluaran)" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="var(--color-pengeluaran)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 9, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" formatter={(value) => formatRupiah(Number(value))} />}
              />
              <Area
                type="monotone"
                dataKey="pemasukan"
                name="Pemasukan"
                stroke="var(--color-pemasukan)"
                strokeWidth={2.5}
                fill="url(#gradPemasukan)"
                dot={{ stroke: "var(--color-pemasukan)", strokeWidth: 2, r: 3, fill: "#fff" }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="pengeluaran"
                name="Pengeluaran"
                stroke="var(--color-pengeluaran)"
                strokeWidth={2}
                fill="url(#gradPengeluaran)"
                dot={{ stroke: "var(--color-pengeluaran)", strokeWidth: 1.5, r: 2, fill: "#fff" }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        {/* Kinerja Kategori / Menu Terlaris di Tenant */}
        <Card className="p-4 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {tenantData.breakdownTitle}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Statistik segmentasi transaksi internal</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="text-[10px] text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Menu <ChevronRight size={10} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            {tenantData.breakdownData.length > 0 ? (
              <BarChart data={tenantData.breakdownData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 11 }}
                  formatter={(v: any) => [formatRupiah(v), "Sales"]}
                />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={16}>
                  {tenantData.breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 border border-dashed rounded-xl p-6">
                Tidak ada data aktivitas penjualan terekam.
              </div>
            )}
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ─── 4. Bottom Grid (Interactive Activity Log & Urgent Action Items) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Log and Order Cards */}
        <div className="flex flex-col gap-6">
          {/* 1. Order Terbaru Card */}
          <Card className="p-4 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-50">
              <div>
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Order Terbaru
                </h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Transaksi ritel terintegrasi kasir aktif
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Clock size={11} /> Live Feed
              </span>
            </div>

            <div className="min-h-[180px] max-h-[280px] overflow-y-auto pr-1 flex flex-col gap-1">
              {tenantData.orders.length > 0 ? (
                tenantData.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2.5 border-b border-slate-100/70 last:border-0 hover:bg-slate-50/50 transition-colors px-1 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-700 truncate">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono text-slate-500 font-semibold">{order.orderNumber}</span>
                        <span>•</span>
                        <span>{formatDate(order.orderDate)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={statusConfig[order.status].variant} className="text-[9px] px-2 py-0.5 font-bold">
                        {statusConfig[order.status].label}
                      </Badge>
                      <span className="text-xs font-extrabold text-slate-800 min-w-[80px] text-right">
                        {formatRupiah(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-slate-400 italic">
                  Tidak ada transaksi ritel di tenant ini.
                </div>
              )}
            </div>
          </Card>

          {/* 2. Log Aktivitas Tenant (Owner Only) */}
          {isOwner && (
            <Card className="p-4 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-50">
                <div>
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Log Aktivitas Tenant
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Histori aktivitas kru & produksi dapur cabang
                  </p>
                </div>
                <Badge variant="info" className="text-[9px] font-bold">Pemilik</Badge>
              </div>

              <div className="min-h-[180px] max-h-[280px] overflow-y-auto pr-1 flex flex-col gap-2">
                {tenantData.activities.length > 0 ? (
                  tenantData.activities.map((act) => {
                    let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                    if (act.type === "ALERT") badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
                    if (act.type === "PRODUCTION") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                    if (act.type === "TENANT") badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
                    
                    return (
                      <div
                        key={act.id}
                        className="flex items-start gap-3 p-2 border border-slate-100/50 rounded-xl hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                          <Activity size={13} className="text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-600 leading-normal">
                            {act.text}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={9} />
                            <span>{act.time}</span>
                            <span>•</span>
                            <span className="font-bold">{act.user}</span>
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-[8px] px-1 py-0 uppercase font-extrabold shrink-0 ${badgeColor}`}>
                          {act.type}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-xs text-slate-400 italic">
                    Tidak ada log aktivitas tercatat.
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Interactive Decision-Support Command Center Stack */}
        <div className="flex flex-col gap-6">
          {/* 1. Restock Budget Planner */}
          <Card className="p-4 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-50">
                <div>
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Rencana Restock & Kebutuhan Kas
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Konversi stok kritis ke rencana belanja estimasi
                  </p>
                </div>
                <Badge variant="warning" className="text-[9px] font-bold">Kebutuhan Kas</Badge>
              </div>

              <div className="flex flex-col gap-3">
                {tenantData.alerts.length > 0 ? (
                  tenantData.alerts.map((item) => {
                    const needed = Math.max(0, item.minimumStock - item.stockQuantity);
                    const stockPriceObj = INGREDIENT_STOCK_PRICE_MAP[item.name.toLowerCase()] || { price: 10000, unit: item.unitSymbol };
                    const estimatedCost = needed * stockPriceObj.price;
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                            Butuh: <span className="font-bold text-slate-600">{needed} {item.unitSymbol}</span> (Stok: {item.stockQuantity} / Min: {item.minimumStock})
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-slate-800">{formatRupiah(estimatedCost)}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5 font-medium">
                            Est. {formatRupiah(stockPriceObj.price)}/{stockPriceObj.unit}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50/50 border border-dashed rounded-xl p-4">
                    Semua stok berada di batas aman. Tidak ada rencana belanja.
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* 2. Margin Health Evaluator */}
          <Card className="p-4 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-50">
                <div>
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Evaluasi Margin Keuntungan
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    HPP mendekati harga jual (Target Margin Min. 40%)
                  </p>
                </div>
                <Badge variant="destructive" className="text-[9px] font-bold">Margin Kritis</Badge>
              </div>

              <div className="flex flex-col gap-3">
                {(TENANT_MARGIN_CRITICAL_MAP[activeTenantId] || []).length > 0 ? (
                  (TENANT_MARGIN_CRITICAL_MAP[activeTenantId] || []).map((item) => (
                    <div key={item.id} className="flex flex-col gap-1.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{item.name}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            Harga: <span className="font-bold text-slate-600">{formatRupiah(item.price)}</span> | HPP: {formatRupiah(item.hpp)}
                          </p>
                        </div>
                        <Badge variant={item.marginPct <= 20 ? "destructive" : "warning"} className="text-[9px] font-extrabold px-2 py-0.5 shrink-0">
                          Margin {item.marginPct}%
                        </Badge>
                      </div>
                      
                      {/* Margin visual bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-0.5">
                        <div
                          className={`h-1.5 rounded-full ${item.marginPct <= 20 ? "bg-red-500" : "bg-amber-500"}`}
                          style={{ width: `${item.marginPct}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50/50 border border-dashed rounded-xl p-4">
                    Semua margin produk berada di batas aman.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => navigate(ROUTES.PRODUCTS)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold border border-brand-primary text-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer flex items-center gap-1.5"
              >
                Kelola Harga & Resep
              </button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
