import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
