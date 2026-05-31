"use client";

import type { IngredientFlag, IngredientFlagCategory } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<IngredientFlagCategory, { label: string; color: string }> = {
  "added-sugar": { label: "Added sugar", color: "text-[var(--tl-amber)] bg-[var(--tl-amber-tint)]" },
  sweetener: { label: "Sweetener", color: "text-[var(--info)] bg-[var(--info-tint)]" },
  preservative: { label: "Preservative", color: "text-[var(--muted)] bg-[var(--surface-2)]" },
  emulsifier: { label: "Emulsifier", color: "text-[var(--muted)] bg-[var(--surface-2)]" },
  colour: { label: "Colour", color: "text-purple-600 bg-purple-50" },
  flavouring: { label: "Flavouring", color: "text-[var(--muted)] bg-[var(--surface-2)]" },
  "refined-oil": { label: "Refined oil", color: "text-[var(--tl-amber)] bg-[var(--tl-amber-tint)]" },
  caffeine: { label: "Caffeine", color: "text-[var(--info)] bg-[var(--info-tint)]" },
  "processing-indicator": { label: "Processing", color: "text-[var(--muted)] bg-[var(--surface-2)]" },
};

export function IngredientFlagItem({ flag }: { flag: IngredientFlag }) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORY_LABELS[flag.category];
  return (
    <button onClick={() => setOpen((o) => !o)} className="w-full text-left bg-[var(--surface)] rounded-xl px-3 py-2.5 hover:bg-[var(--surface-2)] transition-colors">
      <div className="flex items-center gap-2">
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0", cat.color)}>{cat.label}</span>
        <span className="text-sm font-medium text-[var(--ink)] flex-1">{flag.name}</span>
        {flag.e_number && <span className="text-[10px] text-[var(--muted-2)] font-mono">{flag.e_number}</span>}
        <ChevronDown className={cn("w-4 h-4 text-[var(--muted-2)] transition-transform shrink-0", open && "rotate-180")} />
      </div>
      {open && <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed text-left">{flag.explanation}</p>}
    </button>
  );
}
