import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] active:scale-[0.98]",
  secondary: "bg-[var(--surface-2)] text-[var(--ink)] hover:opacity-80",
  ghost: "text-[var(--brand)] hover:bg-[var(--brand-tint)]",
  destructive: "bg-[var(--bad-tint)] text-[var(--bad)] hover:opacity-80",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-xl",
  md: "h-11 px-5 text-sm rounded-2xl",
  lg: "h-13 px-6 text-base rounded-2xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({ variant = "primary", size = "md", fullWidth, className, children, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn("inline-flex items-center justify-center gap-2 font-medium transition-all duration-100 disabled:opacity-40 disabled:cursor-not-allowed", variants[variant], sizes[size], fullWidth && "w-full", className)}>
      {children}
    </button>
  );
}
