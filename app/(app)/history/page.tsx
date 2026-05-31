"use client";

import { useEffect, useState } from "react";
import type { HistoryEntry } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { History, Trash2 } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nutri:history");
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  function clear() {
    localStorage.removeItem("nutri:history");
    setEntries([]);
  }

  if (!loaded) return null;

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<History className="w-8 h-8" />}
        title="No recent scans"
        description="Products you scan will appear here."
        action={<Link href="/scan" className="text-sm font-medium text-[var(--brand)]">Scan something</Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Recent scans</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{entries.length} product{entries.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={clear} className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--bad)] transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <Link key={entry.id} href={`/result?barcode=${entry.barcode ?? ""}`} className="flex items-center gap-3 bg-[var(--surface)] rounded-2xl p-4 shadow-card hover:shadow-card-elevated transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-tint)] flex items-center justify-center shrink-0">
              <History className="w-5 h-5 text-[var(--brand)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] truncate">{entry.product_name}</p>
              <p className="text-xs text-[var(--muted)] truncate">{entry.brand ? `${entry.brand} · ` : ""}{timeAgo(entry.scanned_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
