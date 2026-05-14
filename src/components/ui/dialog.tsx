import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className
}: DialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => onOpenChange(false)}
        >
          <motion.div
            className={cn(
              "max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-navy",
              className
            )}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <h2 id="dialog-title" className="text-lg font-bold">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close dialog"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
