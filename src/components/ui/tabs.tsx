import { cn } from "@/lib/utils";

export type TabItem = {
  value: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export function Tabs({ items, value, onValueChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-2xl border border-border/80 bg-card/70 p-1 shadow-sm backdrop-blur",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onValueChange(item.value)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition",
            value === item.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
