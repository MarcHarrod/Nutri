import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "bg-[var(--surface)] rounded-2xl shadow-card p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
