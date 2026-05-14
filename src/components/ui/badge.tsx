import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "covered"
  | "warning"
  | "youth"
  | "adult"
  | "senior"
  | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary ring-primary/15",
  covered:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  warning:
    "bg-amber-500/15 text-amber-800 ring-amber-500/25 dark:text-amber-200",
  youth: "bg-sky-500/15 text-sky-800 ring-sky-500/20 dark:text-sky-200",
  adult:
    "bg-indigo-500/10 text-indigo-800 ring-indigo-500/20 dark:text-indigo-200",
  senior:
    "bg-coral-100 text-coral-900 ring-coral-400/20 dark:bg-coral-500/15 dark:text-coral-100",
  outline: "bg-card/70 text-foreground ring-border"
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
