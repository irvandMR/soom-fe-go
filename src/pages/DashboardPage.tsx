import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { confirm } from "@/store/useConfirmStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { toast } from "sonner";

function DashboardPage() {
  const { isMobile } = useBreakpoint();

  const { show, hide } = useLoadingStore();

  // Simulasi loading table/request 2 detik
  const testLoading = () => {
    show();
    setTimeout(() => {
      hide();
      toast.success("Data berhasil dimuat!", {
        description: "10 unit ditemukan",
      });
    }, 2000);
  };

  const testError = () => {
    show();
    setTimeout(() => {
      hide();
      toast.error("Gagal memuat data", {
        description: "Server tidak merespons",
      });
    }, 1500);
  };

  const testConfirm = () => {
    confirm({
      title: "Hapus unit ini?",
      description: "Data yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      variant: "danger",
      onConfirm: () => toast.success("Unit berhasil dihapus!"),
      onCancel: () => toast.info("Dibatalkan"),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <div>
        <div
          className={cn(
            "font-semibold text-[var(--fandm-text)] mb-1",
            isMobile ? "text-base" : "text-lg",
          )}
        >
          Selamat datang, Rizky 👋
        </div>

        <div className="text-sm text-[var(--fandm-text-muted)]">
          Pantau order, stok, dan keuangan usahamu hari ini.
        </div>
      </div>

      {/* Tombol testing — hapus ini setelah selesai */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={testLoading}>Test Loading (2s)</Button>
        <Button variant="destructive" onClick={testError}>
          Test Error Toast
        </Button>
        <Button variant="outline" onClick={testConfirm}>
          Test Confirm Dialog
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            toast.warning("Peringatan!", {
              description: "Stok hampir habis",
            })
          }
        >
          Test Warn Toast
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
