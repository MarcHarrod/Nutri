"use client";

import { useEffect, useState } from "react";
import type { HistoryEntry, ProductAnalysis } from "@/lib/types";
import { ComparePanel } from "@/components/compare-panel";
import { EmptyState } from "@/components/empty-state";
import { GitCompare } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [slotA, setSlotA] = useState<ProductAnalysis | null>(null);
  const [slotB, setSlotB] = useState<ProductAnalysis | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nutri:history");
      if (raw) {
        const entries: HistoryEntry[] = JSON.parse(raw);
        setHistory(entries);
        if (entries.length >= 1) setSlotA(entries[0].analysis);
        if (entries.length >= 2) setSlotB(entries[1].analysis);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (history.length < 2) {
    return (
      <EmptyState
        icon={<GitCompare className="w-8 h-8" />}
        title="Not enough scans"
        description="Scan at least two products to compare them."
        action={<Link href="/scan" className="text-sm font-medium text-[var(--brand)]">Scan a product</Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Compare</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Compare two products side by side</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(["A", "B"] as const).map((slot) => {
          const current = slot === "A" ? slotA : slotB;
          const setter = slot === "A" ? setSlotA : setSlotB;
          return (
            <div key={slot}>
              <p className="text-xs font-medium text-[var(--muted)] mb-1.5">Product {slot}</p>
              <select className="w-full text-xs bg-[var(--surface)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-[var(--ink)]" value={current?.product.id ?? ""} onChange={(e) => { const found = history.find((h) => h.analysis.product.id === e.target.value); setter(found?.analysis ?? null); }}>
                <option value="">Select product</option>
                {history.map((h) => (<option key={h.id} value={h.analysis.product.id}>{h.analysis.product.name}</option>))}
              </select>
            </div>
          );
        })}
      </div>
      {slotA && slotB && <ComparePanel a={slotA} b={slotB} />}
    </div>
  );
}
