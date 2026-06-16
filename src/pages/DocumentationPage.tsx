import { SECTIONDOCS } from "@/constant/section-doc";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, ListTodo, GitFork } from "lucide-react";
import Mermaid from "@/components/widget/Mermaid";

// Mermaid Flowcharts defined for each documentation section
const FLOW_DIAGRAMS: Record<number, string> = {
  1: `
  graph TD
    A[Bahan Baku Terpakai] --> B{Sisa Stok < Min. Stok?}
    B -->|Ya| C[Notifikasi Merah & Masuk Rencana Restock]
    B -->|Tidak| D[Status Aman]
    C --> E[Estimasi Belanja Dihitung Otomatis]
    F[HPP Resep / Harga Jual] --> G{Margin Keuntungan < 40%?}
    G -->|Ya| H[Masuk Evaluator Margin Kritis]
    G -->|Tidak| I[Status Sehat]
  `,
  2: `
  graph TD
    A[Order Ritel Masuk] --> B{Punya Item Made to Order?}
    B -->|Tidak| C[Order Langsung / Ritel]
    C --> D[Status DONE & LUNAS]
    D --> E[Stok Produk Ritel Langsung Terpotong]
    B -->|Ya| F[Order Pre-Order]
    F --> G[Status PENDING & Uang Muka DP]
    G --> H[Masuk Jadwal Produksi Dapur]
    H --> I[Produksi Selesai & Pelunasan Lunas]
  `,
  3: `
  graph LR
    A[Stok Bahan Baku] --> B(Sub-tab Bahan Baku)
    C[Kemasan & Wadah] --> D(Sub-tab Kemasan)
    E[Stok Masuk Baru] -->|Input Harga Terbaru| F(Update Estimasi HPP Otomatis)
    G[Jumlah Stok] -->|Di bawah batas| H[Peringatan Merah / Menipis]
  `,
  4: `
  graph TD
    A[Input Produk Baru] --> B{Tentukan Tipe}
    B --> C[Made to Stock - Ready]
    B --> D[Made to Order - Inden]
    B --> E[Resell - Beli Jadi]
    F[HPP Bahan: Tepung/Telur] --> H[Total HPP Gabungan]
    G[HPP Kemasan: Dus/Plastik] --> H
    H --> I[Aktivasi Versi Resep v1/v2]
  `,
  5: `
  graph TD
    A[Buat Produksi] --> B[Pilih Resep Aktif & Porsi]
    B --> C[Potong Bahan Baku Otomatis]
    C --> D[Proses Baking / Pembuatan]
    D --> E[Quality Control QC]
    E --> F[Kuantitas Sukses - Masuk Stok Jadi]
    E --> G[Kuantitas Gagal - Reject/Waste]
    F --> H[Hitung Overhead 20% & Harga Jual Margin 60%]
  `,
  6: `
  graph TD
    A[Order Kasir Selesai] -->|Pemasukan Otomatis| B(Arus Kas Masuk)
    C[Belanja/Operasional] -->|Tambah Pengeluaran| D(Arus Kas Keluar)
    B --> E[Grafik Keuangan & Laba Bersih]
    D --> E
  `,
};

function DocumentationPage() {
  const [activeSection, setActiveSection] = useState(1);
  const [activeTab, setActiveTab] = useState<"steps" | "flow">("steps");
  const { isMobile } = useBreakpoint();

  const current = SECTIONDOCS.find((s) => s.id === activeSection);

  const handleSectionChange = (sectionId: number) => {
    setActiveSection(sectionId);
    // Preserves the tab selection but resets the scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!current) return null;

  return (
    <div
      className={cn(
        "flex",
        isMobile ? "flex-col" : "flex-row",
        "gap-5 items-start",
      )}
    >
      {/* Left Nav */}
      <Card
        className={cn(isMobile ? "w-full" : "w-[240px] sticky top-0", "p-0 shrink-0 border-[var(--fandm-border)]")}
      >
        <CardContent className="p-2">
          {/* Header */}
          <div
            className={cn(
              "flex items-center gap-2 px-3",
              isMobile ? "py-2 border-b" : "pt-1.5 pb-3 border-b border-slate-100",
            )}
          >
            <BookOpen size={14} className="text-[var(--fandm-primary)]" />
            <span className="text-xs font-bold text-[var(--fandm-text)]">
              Panduan FANDM
            </span>
          </div>

          {/* Menu */}
          <div
            className={cn(
              isMobile ? "flex overflow-x-auto gap-2 px-1 py-2" : "space-y-1 mt-2",
            )}
          >
            {SECTIONDOCS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <Button
                  key={sec.id}
                  onClick={() => handleSectionChange(sec.id)}
                  className={cn(
                    "relative flex rounded-md text-xs transition-all w-full px-3 py-2.5 whitespace-normal justify-start text-left items-start gap-2 h-auto",
                    isMobile
                      ? "px-3 py-2 whitespace-nowrap items-center h-8"
                      : "w-full",
                    isActive
                      ? "font-semibold"
                      : "text-[var(--fandm-text)] hover:bg-black/5",
                  )}
                  style={{
                    background: isActive ? sec.bg : "transparent",
                    color: isActive ? sec.color : undefined,
                  }}
                >
                  <div className={cn("w-5 flex justify-center shrink-0", !isMobile && "mt-0.5")}>
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  {!isMobile ? (
                    <span className="flex-1 text-left leading-normal break-words">
                      Section {sec.id}: {sec.title}
                    </span>
                  ) : (
                    <span>Section {sec.id}</span>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className={cn(
                        "absolute bg-current",
                        isMobile
                          ? "bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-6"
                          : "right-0 top-0 h-full w-[3px] rounded-l-md",
                      )}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Right Content Area */}
      <div className="flex-1 w-full space-y-4">
        {/* Active Section Header */}
        <Card className="border-[var(--fandm-border)]">
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                background: current.bg,
                color: current.color,
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
              }}
            >
              <current.icon size={18} />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Section {current.id}
              </div>
              <div className="text-sm md:text-base font-extrabold text-slate-800 mt-0.5">
                {current.title}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Selector (Steps vs Flowchart) */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/50">
          <button
            onClick={() => setActiveTab("steps")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "steps"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ListTodo size={13} />
            Langkah Panduan
          </button>
          <button
            onClick={() => setActiveTab("flow")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "flow"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <GitFork size={13} />
            Bagan Alur Proses
          </button>
        </div>

        {/* Content Rendering based on Active Tab */}
        {activeTab === "steps" ? (
          /* Step-by-Step Guide list */
          <div className="space-y-3">
            {current.steps.map((step, i) => (
              <Card
                key={i}
                className="transition border-[var(--fandm-border)] hover:shadow-sm hover:border-slate-300 rounded-xl"
              >
                <CardContent className="flex gap-4 p-4">
                  {/* Step Number Badge */}
                  <div
                    className="flex items-center justify-center rounded-lg text-xs font-black h-6 w-6 shrink-0"
                    style={{
                      background: current.bg,
                      color: current.color,
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {step.desc}
                    </div>
                  </div>

                  {!isMobile && (
                    <ChevronRight size={13} className="text-slate-300 mt-1 shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Mermaid Flowchart Display */
          <div className="space-y-3">
            <Card className="border-[var(--fandm-border)] rounded-xl">
              <CardContent className="p-4 md:p-5 flex flex-col gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-700">Skema Alur Kerja: {current.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Bagan di bawah ini menggambarkan urutan langkah, hubungan data, dan hasil akhir dari fitur ini secara visual.
                  </p>
                </div>
                {FLOW_DIAGRAMS[current.id] ? (
                  <Mermaid chart={FLOW_DIAGRAMS[current.id]} />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-dashed">
                    Bagan alur proses untuk bagian ini belum tersedia.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            onClick={() => handleSectionChange(Math.max(1, activeSection - 1))}
            disabled={activeSection === 1}
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
          >
            {isMobile ? "← Prev" : "← Section sebelumnya"}
          </Button>
          <span className="text-xs font-semibold text-slate-500 px-2">
            {activeSection} / {SECTIONDOCS.length}
          </span>
          <Button
            onClick={() => handleSectionChange(Math.min(SECTIONDOCS.length, activeSection + 1))}
            disabled={activeSection === SECTIONDOCS.length}
            size="sm"
            className="flex-1 text-xs"
          >
            {isMobile ? "Next →" : "Section berikutnya →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DocumentationPage;
