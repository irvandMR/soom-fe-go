import { cn } from "@/lib/utils";
import type React from "react";
import { DotPattern } from "./Decorations";

interface BannerBackgroundProps {
	variant?: "full" | "subtle";
	className?: string;
	children?: React.ReactNode;
	showDotTopRight?: boolean;
	showRingTopRight?: boolean;
}

function BannerBackground({
	variant = "full",
	className,
	children,
	showDotTopRight = true,
	showRingTopRight = true,
}: BannerBackgroundProps) {
	return (
		<div
			className={cn(
				"relative [background-image:var(--fandm-primary-gradient)] overflow-hidden",
				className,
			)}
		>
			{/* Dot grid — hanya di variant full */}
			{variant === "full" && showDotTopRight && <DotPattern />}

			{/* Dekorasi lingkaran — pojok kanan atas */}
			{showRingTopRight && (
				<>
					<div className="absolute -top-20 -right-16 w-64 h-64 rounded-full border border-white/[0.07] pointer-events-none" />
					<div className="absolute -top-10 -right-8  w-44 h-44 rounded-full border border-white/[0.07] pointer-events-none" />
				</>
			)}

			{/* Dekorasi lingkaran — pojok kiri bawah */}
			<div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full border border-white/[0.07] pointer-events-none" />
			<div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full border border-white/[0.07] pointer-events-none" />

			{/* Konten */}
			<div className="relative z-10 h-full flex flex-col">{children}</div>
		</div>
	);
}

export default BannerBackground;
