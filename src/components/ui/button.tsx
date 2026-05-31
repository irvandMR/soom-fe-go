import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Variant & Size ─────────────────────────────────────────────────────────── */
const buttonVariants = cva(
	[
		"inline-flex shrink-0 items-center justify-center gap-1.5",
		"rounded-lg border border-transparent text-sm font-medium whitespace-nowrap",
		"transition-all duration-150 select-none outline-none",
		"focus-visible:ring-2 focus-visible:ring-[var(--fandm-primary)]/40 focus-visible:ring-offset-1",
		"disabled:pointer-events-none disabled:opacity-50",
		"active:translate-y-px",
		'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
	].join(" "),
	{
		variants: {
			variant: {
				// Tombol utama — background brand biru FANDM
				default:
					"bg-[var(--fandm-primary)] text-white hover:bg-[var(--fandm-primary-dark)] active:bg-[var(--fandm-primary-dark)]",

				// Tombol outline — border & teks brand, isi transparan
				outline:
					"border-[var(--fandm-primary)] text-[var(--fandm-primary)] bg-transparent hover:bg-[var(--fandm-primary)]/8",

				// Tombol sekunder aksen emas — untuk highlight / aksi sekunder
				secondary:
					"bg-[var(--fandm-accent)] text-white hover:bg-[var(--fandm-accent)]/85 active:bg-[var(--fandm-accent)]/75",

				// Tombol ghost — minimal, hanya teks
				ghost:
					"text-[var(--fandm-text-muted)] bg-transparent hover:bg-[var(--fandm-bg)] hover:text-[var(--fandm-text)]",

				// Tombol destructive — untuk aksi hapus / bahaya
				destructive:
					"border-[var(--fandm-border)] text-destructive bg-transparent hover:bg-destructive/8 hover:border-destructive/30",

				// Tombol link — teks brand dengan underline
				link: "text-[var(--fandm-primary)] underline-offset-4 hover:underline bg-transparent",
			},

			size: {
				default: "h-8 px-3 text-sm",
				xs: "h-6 px-2 text-xs rounded-md",
				sm: "h-7 px-2.5 text-xs",
				lg: "h-10 px-4 text-sm",
				icon: "size-8",
				"icon-sm": "size-7",
				"icon-xs": "size-6 rounded-md",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

/* ── Props ──────────────────────────────────────────────────────────────────── */
interface ButtonProps
	extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	icon?: React.ReactNode;
	iconOnly?: boolean;
	loading?: boolean;
}

/* ── Component ──────────────────────────────────────────────────────────────── */
function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	icon,
	iconOnly = false,
	loading = false,
	disabled,
	children,
	title,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot.Root : "button";

	const resolvedSize = iconOnly
		? size === "sm"
			? "icon-sm"
			: size === "xs"
				? "icon-xs"
				: size === "lg"
					? "icon-lg"
					: "icon"
		: size;

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={resolvedSize}
			title={
				iconOnly
					? (title ?? (typeof children === "string" ? children : undefined))
					: title
			}
			className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
			disabled={disabled || loading}
			{...props}
		>
			{loading ? <Loader2 className="size-4 animate-spin" /> : icon}
			{iconOnly ? (
				<span className="sr-only">{children}</span>
			) : (
				!loading && children
			)}
		</Comp>
	);
}

export { Button, buttonVariants };
