import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SECTIONDOCS } from "@/constant/section-doc";
import { ROUTES } from "@/constant/routes";
import { HelpCircle, ChevronRight, BookOpen, ExternalLink } from "lucide-react";

export default function HelpGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(1);

  // Exclude help button on the login screen
  const isLoginPage = location.pathname === ROUTES.LOGIN;

  // Dynamically set the active guide section based on the current page route
  useEffect(() => {
    const matched = SECTIONDOCS.find((sec) => {
      if (!sec.pathPattern) return false;
      return location.pathname.startsWith(sec.pathPattern);
    });

    if (matched) {
      setActiveSection(matched.id);
    } else {
      // Default to Dashboard guide if on general settings / profile
      setActiveSection(1);
    }
  }, [location.pathname]);

  if (isLoginPage) return null;

  const currentGuide = SECTIONDOCS.find((s) => s.id === activeSection) || SECTIONDOCS[0];

  return (
    <>
      {/* Floating Action Button (FAB) for Help */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[98] flex items-center gap-2 px-3 py-2.5 rounded-full bg-gradient-to-r from-[var(--fandm-primary)] to-[#486b8b] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer border border-white/20 select-none"
        title="Bantuan & Panduan Fitur"
      >
        {/* Pulsing outer ring animation */}
        <span className="absolute -inset-0.5 rounded-full bg-[var(--fandm-primary)]/40  group-hover:hidden" />
        <HelpCircle size={17} className="animate-bounce group-hover:animate-none shrink-0" />
        <span className="text-xs font-bold tracking-wide pr-1 whitespace-nowrap">
          Panduan
        </span>
      </button>

      {/* Guide Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85dvh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-[var(--fandm-primary)]" />
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                PANDUAN PENGGUNAAN
              </span>
            </div>
            <DialogTitle className="text-slate-800 font-extrabold text-base flex items-center gap-2">
              Bantuan: {currentGuide.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Ikuti langkah-langkah di bawah untuk memahami cara kerja fitur ini.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-3 min-h-0 overflow-hidden flex-1">
            {/* Quick Section Switcher dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Pilih Topik Panduan Lain:
              </label>
              <Select
                value={String(activeSection)}
                onValueChange={(val) => setActiveSection(Number(val))}
              >
                <SelectTrigger className="w-full h-9 px-3 text-xs border rounded-lg bg-white border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--fandm-primary)] cursor-pointer">
                  <SelectValue placeholder="Pilih Topik Panduan Lain:" />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONDOCS.map((sec) => (
                    <SelectItem key={sec.id} value={String(sec.id)}>
                      Panduan {sec.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Steps Guide Layout */}
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
              {currentGuide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3.5 border border-slate-100 rounded-xl bg-slate-50/30 hover:bg-slate-50 transition-all duration-200"
                >
                  <div
                    className="flex items-center justify-center rounded-lg text-xs font-bold h-6 w-6 shrink-0"
                    style={{
                      background: currentGuide.bg,
                      color: currentGuide.color,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-700">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                  <ChevronRight size={13} className="text-slate-300 mt-1 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t border-slate-50 pt-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.DOCS);
              }}
              className="text-xs font-bold text-[var(--fandm-primary)] hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ExternalLink size={12} />
              Buka Semua Panduan Lengkap
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
