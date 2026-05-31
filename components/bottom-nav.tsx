"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanLine, History, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/scan", label: "Scan", icon: ScanLine },
  { href: "/history", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: ArrowLeftRight },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-xl border-t border-[var(--hairline)] pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(href + "/") ||
            (href === "/scan" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                active ? "text-[var(--brand)]" : "text-[var(--muted-2)]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
