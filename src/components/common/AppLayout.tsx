import { BREADCRUMBMAP } from "@/constant/breadcrumb";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "./Topbar";

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
	);
}

export default AppLayout;
