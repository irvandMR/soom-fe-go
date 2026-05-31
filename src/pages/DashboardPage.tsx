import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";

function DashboardPage() {
	const { isMobile } = useBreakpoint();

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
		</div>
	);
}

export default DashboardPage;
