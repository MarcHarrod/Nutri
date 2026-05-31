export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--brand-tint)] border-t-[var(--brand)] animate-spin" />
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
