import type { Confidence } from "@/lib/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<Confidence, { label: string; classes: string }> = {
  high: { label: "High confidence", classes: "bg-[var(--good-tint)] text-[var(--good)]" },
  medium: { label: "Medium confidence", classes: "bg-[var(--warn-tint)] text-[var(--warn)]" },
  low: { label: "Low confidence", classes: "bg-[var(--bad-tint)] text-[var(--bad)]" },
  insufficient: { label: "Insufficient data", classes: "bg-[var(--surface-2)] text-[var(--muted)]" },
};

export function ConfidenceBadge({ confidence, className }: { confidence: Confidence; className?: string }) {
  const { label, classes } = CONFIG[confidence];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full", classes, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
