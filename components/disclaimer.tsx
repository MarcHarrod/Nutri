import { Info } from "lucide-react";

export function Disclaimer({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5 bg-[var(--surface-2)] rounded-xl p-3">
      <Info className="w-4 h-4 text-[var(--muted)] shrink-0 mt-0.5" />
      <p className="text-xs text-[var(--muted)] leading-relaxed">{text}</p>
    </div>
  );
}
