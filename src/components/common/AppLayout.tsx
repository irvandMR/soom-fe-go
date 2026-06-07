import { BREADCRUMBMAP } from "@/constant/breadcrumb";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "./Topbar";
import { Toaster } from "sonner";
import OverlayLoading from "./OverlayLoading";
import ConfirmDialog from "./ConfirmDialog";

function AppLayout() {
  const { collapsed } = useSidebarStore();
  const { isMobile } = useBreakpoint();
  const location = useLocation();

  const breadcrumb = BREADCRUMBMAP[location.pathname] ?? ["Main Menu"];

  // Sidebar width: mobile tidak pakai margin (overlay), desktop pakai margin
  const sidebarWidth = isMobile ? 0 : collapsed ? 60 : 220;
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  };
  return (
    <>
      <OverlayLoading />
      <ConfirmDialog />
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            borderRadius: "12px",
          },
          classNames: {
            success: "border-green-200 bg-green-50 text-green-800",
            error: "border-red-200 bg-red-50 text-red-800",
            warning: "border-amber-200 bg-amber-50 text-amber-800",
            info: "border-blue-200 bg-blue-50 text-blue-800",
          },
        }}
      />
      <div className="flex h-screen overflow-hidden bg-gray-50 text-left">
        <Sidebar />

        {/* Main area — geser kanan sesuai lebar sidebar */}
        <div
          className="flex flex-col flex-1 h-screen overflow-hidden transition-[margin] duration-200 ease-in-out"
          style={{ marginLeft: sidebarWidth }}
        >
          <Topbar breadcrumb={breadcrumb} />

          <main className="flex-1 overflow-y-auto mt-14 bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="p-4 lg:p-6 min-h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

export default AppLayout;
