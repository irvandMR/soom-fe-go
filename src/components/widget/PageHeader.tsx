import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	actionLabel?: string;
	onAction?: () => void;
}

export default function PageHeader({
	title,
	actionLabel,
	onAction,
	subtitle,
}: PageHeaderProps) {
	const { isMobile } = useBreakpoint();

	return (
		<div className="flex items-center justify-between gap-3 mb-5">
			<div>
				<div className="text-sm md:text-base font-semibold text-[var(--fandm-text)]">
					{title}
				</div>

				{subtitle && (
					<div className="text-xs text-[var(--fandm-text-muted)]">
						{subtitle}
					</div>
				)}
			</div>

			{actionLabel && onAction && (
				<Button onClick={onAction}>
					<Plus size={14} />
					{!isMobile && actionLabel}
				</Button>
			)}
		</div>
	);
}
