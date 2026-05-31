import { SECTIONDOCS } from "@/constant/section-doc";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";

function DocumentationPage() {
	const [activeSection, setActiveSection] = useState(1);
	const { isMobile } = useBreakpoint();

	const current = SECTIONDOCS.find((s) => s.id === activeSection);
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
				className={cn(isMobile ? "w-full" : "w-[220px] sticky top-0", "p-0")}
			>
				<CardContent className="p-2">
					{/* Header */}
					<div
						className={cn(
							"flex items-center gap-2 px-3",
							isMobile ? "py-2 border-b" : "pt-1 pb-3",
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
							isMobile ? "flex overflow-x-auto gap-2 px-1 py-2" : "space-y-1",
						)}
					>
						{SECTIONDOCS.map((sec) => {
							const Icon = sec.icon;
							const isActive = activeSection === sec.id;
							return (
								<Button
									key={sec.id}
									onClick={() => setActiveSection(sec.id)}
									className={cn(
										"relative flex items-center gap-2 rounded-md text-xs transition-all",
										isMobile
											? "px-3 py-2 whitespace-nowrap"
											: "w-full px-3 py-2",
										isActive
											? "font-semibold"
											: "text-[var(--fandm-text)] hover:bg-black/5",
									)}
									style={{
										background: isActive ? sec.bg : "transparent",
										color: isActive ? sec.color : undefined,
									}}
								>
									<div className="w-5 flex justify-center">
										<Icon size={16} strokeWidth={1.5} />
									</div>
									{!isMobile ? (
										<span className="flex-1 text-left">
											Section {sec.id}:{" "}
											{sec.title.split(" ").slice(2).join(" ") || sec.title}
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

			{/* Content */}
			<div className="flex-1 w-full space-y-4">
				{/* Header */}
				<Card>
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
							<div className="text-[10px] font-semibold text-[var(--fandm-text-muted)] uppercase">
								Section {current.id}
							</div>
							<div className="text-sm md:text-base font-bold text-[var(--fandm-text-dark)]">
								{current.title}
							</div>
						</div>
					</CardContent>
				</Card>
				{/* Steps */}
				<div className="space-y-3">
					{current.steps.map((step, i) => {
						return (
							<Card
								key={i}
								className="transition hover:shadow-md hover:-translate-y-[1px]"
							>
								<CardContent className="flex gap-4 p-4">
									{/* Number */}
									<div
										className="flex items-center justify-center rounded-md text-xs font-bold"
										style={{
											background: current.bg,
											color: current.color,
											width: 24,
											height: 24,
										}}
									>
										{i + 1}
									</div>

									{/* Text */}
									<div className="flex-1">
										<div className="text-xs font-semibold text-[var(--fandm-text-dark)]">
											{step.title}
										</div>
										<div className="text-xs text-[var(--fandm-text-muted)] leading-relaxed">
											{step.desc}
										</div>
									</div>

									{!isMobile && (
										<ChevronRight size={14} className="opacity-50 mt-1" />
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Navigation */}
				<div className="flex items-center gap-2 mt-4">
					<Button
						onClick={() => setActiveSection((s) => Math.max(1, s - 1))}
						disabled={activeSection === 1}
						className="flex-1 border rounded-md px-3 py-2 text-xs disabled:opacity-40"
					>
						{isMobile ? "← Prev" : "← Section sebelumnya"}
					</Button>
					<span className="text-xs text-[var(--fandm-text-muted)]">
						{activeSection} / {SECTIONDOCS.length}
					</span>
					<button
						onClick={() =>
							setActiveSection((s) => Math.min(SECTIONDOCS.length, s + 1))
						}
						disabled={activeSection === SECTIONDOCS.length}
						className="flex-1 bg-[var(--fandm-primary)] text-white rounded-md px-3 py-2 text-xs disabled:opacity-40"
					>
						{isMobile ? "Next →" : "Section berikutnya →"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default DocumentationPage;
