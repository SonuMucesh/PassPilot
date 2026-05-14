import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "outline" | "coral";
type ButtonSize = "default" | "sm" | "icon";

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary/30",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/40",
  ghost:
    "hover:bg-muted text-foreground focus-visible:ring-primary/25",
  outline:
    "border border-border bg-card/70 hover:bg-muted text-foreground focus-visible:ring-primary/25",
  coral:
    "bg-coral-gradient text-white shadow-coral hover:brightness-105 focus-visible:ring-orange-300/50"
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  icon: "h-11 w-11"
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", type = "button", ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
