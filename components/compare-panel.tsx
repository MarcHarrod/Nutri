import type { ProductAnalysis, NutrientProfile } from "@/lib/types";
import { formatNutrient } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

type NKey = keyof NutrientProfile;

const COMPARE_KEYS: NKey[] = [
  "energy_kcal",
  "fat",
  "saturated_fat",
  "sugars",
  "fibre",
  "protein",
  "salt",
];

const LOWER_BETTER: NKey[] = ["energy_kcal", "fat", "saturated_fat", "sugars", "salt"];

export function ComparePanel({
  a,
  b,
}: {
  a: ProductAnalysis;
  b: ProductAnalysis;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Product headers */}
      <div className="grid grid-cols-[1fr_40px_1fr] gap-1 text-center">
        <div className="bg-[var(--brand-tint)] rounded-xl px-3 py-2">
          <p className="text-xs font-semibold text-[var(--brand)] truncate">{a.product.name}</p>
          {a.product.brand && <p className="text-[10px] text-[var(--muted)] truncate">{a.product.brand}</p>}
        </div>
        <div className="flex items-center justify-center">
          <span className="text-[10px] font-bold text-[var(--muted-2)]">VS</span>
        </div>
        <div className="bg-[var(--surface-2)] rounded-xl px-3 py-2">
          <p className="text-xs font-semibold text-[var(--ink)] truncate">{b.product.name}</p>
          {b.product.brand && <p className="text-[10px] text-[var(--muted)] truncate">{b.product.brand}</p>}
        </div>
      </div>

      {/* Nutrient rows */}
      <div className="bg-[var(--surface)] rounded-2xl shadow-card divide-y divide-[var(--hairline-soft)]">
        {COMPARE_KEYS.map((key) => {
          const na = a.product.nutrients[key];
          const nb = b.product.nutrients[key];
          const va = na.per100g;
          const vb = nb.per100g;
          const lowerBetter = LOWER_BETTER.includes(key);

          let winner: "a" | "b" | "equal" = "equal";
          if (va != null && vb != null && va !== vb) {
            if (lowerBetter) winner = va < vb ? "a" : "b";
            else winner = va > vb ? "a" : "b";
          }

          return (
            <div key={key} className="grid grid-cols-[1fr_80px_1fr] items-center px-3 py-2.5 gap-2">
              <span
                className={cn(
                  "text-sm tabular-nums text-right",
                  winner === "a" ? "font-semibold text-[var(--good)]" : "text-[var(--ink)]"
                )}
              >
                {formatNutrient(va, na.unit)}
              </span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[var(--muted)] text-center leading-tight">{na.label}</span>
                {winner !== "equal" && (
                  <div className={cn("mt-0.5", winner === "a" ? "text-[var(--good)]" : "text-[var(--muted-2)]")}>
                    {winner === "a" ? (
                      lowerBetter ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />
                    ) : (
                      lowerBetter ? <TrendingUp className="w-3 h-3 rotate-180" /> : <TrendingDown className="w-3 h-3" />
                    )}
                  </div>
                )}
                {winner === "equal" && <Minus className="w-3 h-3 text-[var(--muted-2)] mt-0.5" />}
              </div>
              <span
                className={cn(
                  "text-sm tabular-nums",
                  winner === "b" ? "font-semibold text-[var(--good)]" : "text-[var(--ink)]"
                )}
              >
                {formatNutrient(vb, nb.unit)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--muted-2)] text-center">
        All values per 100g. Green = better for that nutrient (lower fat/sugar/salt, higher fibre/protein).
      </p>
    </div>
  );
}
