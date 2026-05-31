import type { Nutrient, TrafficLight } from "@/lib/types";
import { formatNutrient } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TL_STYLES: Record<TrafficLight, { dot: string; bar: string }> = {
  green: { dot: "bg-[var(--tl-green)]", bar: "bg-[var(--tl-green)]" },
  amber: { dot: "bg-[var(--tl-amber)]", bar: "bg-[var(--tl-amber)]" },
  red: { dot: "bg-[var(--tl-red)]", bar: "bg-[var(--tl-red)]" },
};

const REFERENCE: Partial<Record<string, number>> = {
  energy_kcal: 2000,
  fat: 70,
  saturated_fat: 20,
  carbohydrates: 260,
  sugars: 90,
  fibre: 30,
  protein: 50,
  salt: 6,
};

interface Props {
  nutrientKey: string;
  nutrient: Nutrient;
  showServing?: boolean;
}

export function NutrientBar({ nutrientKey, nutrient, showServing }: Props) {
  const value = showServing ? nutrient.perServing : nutrient.per100g;
  const ref = REFERENCE[nutrientKey];
  const pct = value != null && ref ? Math.min((value / ref) * 100, 100) : null;
  const tl = nutrient.trafficLight;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-36 shrink-0">
        {tl ? (
          <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", TL_STYLES[tl].dot)} />
        ) : (
          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[var(--muted-2)]" />
        )}
        <span className="text-xs text-[var(--muted)] truncate">{nutrient.label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        {pct != null ? (
          <div className="flex-1 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                tl ? TL_STYLES[tl].bar : "bg-[var(--muted-2)]"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <span className="text-xs font-medium text-[var(--ink)] w-20 text-right tabular-nums">
          {formatNutrient(value, nutrient.unit)}
        </span>
      </div>
    </div>
  );
}
