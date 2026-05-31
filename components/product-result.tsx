"use client";

import { useEffect, useState } from "react";
import type { ProductAnalysis, HistoryEntry, NutrientProfile } from "@/lib/types";
import { ConfidenceBadge } from "./confidence-badge";
import { NutrientBar } from "./nutrient-bar";
import { IngredientFlagItem } from "./ingredient-flag";
import { Disclaimer } from "./disclaimer";
import { Card } from "./card";
import { CheckCircle2, AlertTriangle, ChevronDown, BarChart2, Flag, GitCompare, RotateCcw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Section = "nutrients" | "ingredients" | "allergens";

const NUTRIENT_KEYS: (keyof NutrientProfile)[] = [
  "energy_kcal",
  "fat",
  "saturated_fat",
  "carbohydrates",
  "sugars",
  "fibre",
  "protein",
  "salt",
];

export function ProductResult({
  analysis,
  barcode,
}: {
  analysis: ProductAnalysis;
  barcode: string | null;
}) {
  const [expanded, setExpanded] = useState<Section | null>(null);
  const [showServing, setShowServing] = useState(false);
  const hasServing = Object.values(analysis.product.nutrients).some(
    (n) => n.perServing != null
  );

  // Persist to history in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nutri:history");
      const prev: HistoryEntry[] = raw ? JSON.parse(raw) : [];
      const entry: HistoryEntry = {
        id: analysis.id,
        barcode,
        product_name: analysis.product.name,
        brand: analysis.product.brand,
        scanned_at: new Date().toISOString(),
        analysis,
      };
      // Deduplicate by barcode, keep most recent
      const filtered = prev.filter(
        (e) => !(e.barcode && e.barcode === barcode)
      );
      const updated = [entry, ...filtered].slice(0, 20);
      localStorage.setItem("nutri:history", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }, [analysis, barcode]);

  function toggle(s: Section) {
    setExpanded((prev) => (prev === s ? null : s));
  }

  async function handleReport() {
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          product_name: analysis.product.name,
          issue_type: "incorrect_data",
          details: "",
        }),
      });
      toast.success("Report submitted — thanks!");
    } catch {
      toast.error("Couldn't submit report. Try again.");
    }
  }

  const { product } = analysis;

  return (
    <div className="flex flex-col gap-4 rise">
      {/* Header */}
      <Card className="gap-3 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-[var(--ink)] leading-snug">{product.name}</h1>
            {product.brand && (
              <p className="text-sm text-[var(--muted)] mt-0.5">{product.brand}</p>
            )}
          </div>
          <ConfidenceBadge confidence={analysis.confidence} className="shrink-0 mt-1" />
        </div>
        <p className="text-sm text-[var(--ink-2)] leading-relaxed">{analysis.summary}</p>
        {analysis.why_it_matters && (
          <p className="text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--hairline-soft)] pt-3">
            {analysis.why_it_matters}
          </p>
        )}
      </Card>

      {/* Good to know */}
      {analysis.good_to_know.length > 0 && (
        <Card className="flex flex-col gap-2.5 rise-2">
          <p className="text-xs font-semibold text-[var(--good)] uppercase tracking-wide">Good to know</p>
          <div className="flex flex-col gap-2">
            {analysis.good_to_know.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--good)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--ink-2)] leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Worth watching */}
      {analysis.worth_watching.length > 0 && (
        <Card className="flex flex-col gap-2.5 rise-3">
          <p className="text-xs font-semibold text-[var(--warn)] uppercase tracking-wide">Worth watching</p>
          <div className="flex flex-col gap-2">
            {analysis.worth_watching.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--warn)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--ink-2)] leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Nutrients */}
      <div className="bg-[var(--surface)] rounded-2xl shadow-card rise-4">
        <button
          onClick={() => toggle("nutrients")}
          className="w-full flex items-center gap-2 px-4 py-3.5"
        >
          <BarChart2 className="w-4 h-4 text-[var(--muted)]" />
          <span className="flex-1 text-sm font-medium text-left">Nutrition per 100g</span>
          {hasServing && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowServing((v) => !v); }}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full mr-1 transition-colors",
                showServing
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              )}
            >
              Per serving
            </button>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-[var(--muted-2)] transition-transform",
              expanded === "nutrients" && "rotate-180"
            )}
          />
        </button>
        {expanded === "nutrients" && (
          <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[var(--hairline-soft)]">
            <div className="pt-3 flex flex-col gap-2.5">
              {NUTRIENT_KEYS.map((key) => (
                <NutrientBar
                  key={key}
                  nutrientKey={key}
                  nutrient={product.nutrients[key]}
                  showServing={showServing && hasServing}
                />
              ))}
            </div>
            {product.serving_size_g && (
              <p className="text-xs text-[var(--muted-2)] text-right">
                Serving size: {product.serving_size_g}g
              </p>
            )}
            <p className="text-xs text-[var(--muted-2)]">
              UK traffic-light thresholds (FSA) applied per 100g.
            </p>
          </div>
        )}
      </div>

      {/* Ingredient flags */}
      {analysis.ingredient_flags.length > 0 && (
        <div className="bg-[var(--surface)] rounded-2xl shadow-card">
          <button
            onClick={() => toggle("ingredients")}
            className="w-full flex items-center gap-2 px-4 py-3.5"
          >
            <Flag className="w-4 h-4 text-[var(--muted)]" />
            <span className="flex-1 text-sm font-medium text-left">
              Ingredient notes
              <span className="ml-2 text-xs text-[var(--muted-2)] font-normal">
                {analysis.ingredient_flags.length} flagged
              </span>
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[var(--muted-2)] transition-transform",
                expanded === "ingredients" && "rotate-180"
              )}
            />
          </button>
          {expanded === "ingredients" && (
            <div className="px-4 pb-4 flex flex-col gap-2 border-t border-[var(--hairline-soft)] pt-3">
              {analysis.ingredient_flags.map((flag, i) => (
                <IngredientFlagItem key={i} flag={flag} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Allergens */}
      {product.allergens.length > 0 && (
        <div className="bg-[var(--surface)] rounded-2xl shadow-card">
          <button
            onClick={() => toggle("allergens")}
            className="w-full flex items-center gap-2 px-4 py-3.5"
          >
            <AlertTriangle className="w-4 h-4 text-[var(--muted)]" />
            <span className="flex-1 text-sm font-medium text-left">Allergens</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[var(--muted-2)] transition-transform",
                expanded === "allergens" && "rotate-180"
              )}
            />
          </button>
          {expanded === "allergens" && (
            <div className="px-4 pb-4 border-t border-[var(--hairline-soft)] pt-3">
              <p className="text-xs text-[var(--bad)] font-medium mb-2">
                Allergen information is derived from the product label only. Always verify from the physical packaging — formulations change.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.allergens.map((a, i) => (
                  <span key={i} className="text-xs bg-[var(--bad-tint)] text-[var(--bad)] px-2.5 py-1 rounded-full font-medium">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Source */}
      {(product.source_url || product.source !== "mock") && (
        <p className="text-xs text-[var(--muted-2)] text-center">
          Data source:{" "}
          {product.source_url ? (
            <a href={product.source_url} target="_blank" rel="noopener noreferrer" className="underline">
              {product.source === "open-food-facts" ? "Open Food Facts" : product.source}
            </a>
          ) : (
            product.source
          )}
          {product.last_updated && (
            <> · updated {new Date(product.last_updated).toLocaleDateString("en-GB")}</>
          )}
        </p>
      )}

      <Disclaimer text={analysis.disclaimer} />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/scan"
          className="flex items-center justify-center gap-2 h-11 bg-[var(--surface)] rounded-2xl text-sm font-medium text-[var(--ink)] shadow-card hover:shadow-card-elevated transition-shadow"
        >
          <RotateCcw className="w-4 h-4" />
          Scan again
        </Link>
        <Link
          href="/compare"
          className="flex items-center justify-center gap-2 h-11 bg-[var(--brand-tint)] rounded-2xl text-sm font-medium text-[var(--brand)] shadow-card hover:shadow-card-elevated transition-shadow"
        >
          <GitCompare className="w-4 h-4" />
          Compare
        </Link>
      </div>

      <button
        onClick={handleReport}
        className="text-xs text-[var(--muted-2)] self-center hover:text-[var(--bad)] transition-colors"
      >
        Report incorrect data
      </button>
    </div>
  );
}
