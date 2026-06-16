import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // Pakai brand primary → background biru tua, teks putih
        default:
          "bg-[var(--fandm-primary)] text-[var(--fandm-text-secondary)] [a]:hover:bg-[var(--fandm-primary-dark)]",

        // Aksen emas → untuk highlight / label sekunder
        secondary:
          "bg-[var(--fandm-accent)] text-white [a]:hover:bg-[var(--fandm-accent)]/85",

        // Destructive → pakai status danger
        destructive:
          "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)] [a]:hover:bg-[var(--status-danger-bg)]/80",

        // Outline → border tipis, teks muted, bg transparan
        outline:
          "border-[var(--fandm-border)] text-[var(--fandm-text-muted)] bg-transparent [a]:hover:bg-[var(--fandm-bg)]",

        // Ghost → background subtle, teks muted
        ghost:
          "bg-[var(--fandm-bg)] text-[var(--fandm-text-muted)] border-[var(--fandm-border)] [a]:hover:bg-[var(--fandm-border)]",

        // Link → teks brand dengan underline
        link: "text-[var(--fandm-primary)] underline-offset-4 hover:underline",

        // ── Status variants ─────────────────────────────────────────────────
        warning:
          "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
        info:    "bg-[var(--status-info-bg)] text-[var(--status-info-text)]",
        success: "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
        danger:  "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
        muted:   "bg-[var(--status-muted-bg)] text-[var(--status-muted-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
