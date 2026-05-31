import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--bg)]">
      <main className="flex-1 mx-auto w-full max-w-md pb-24 pt-4 px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
