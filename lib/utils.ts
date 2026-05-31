import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNutrient(value: number | null, unit: string): string {
  if (value == null) return "—";
  if (unit === "kcal") return `${Math.round(value)} kcal`;
  const rounded = Math.round(value * 10) / 10;
  return `${rounded % 1 === 0 ? rounded : rounded.toFixed(1)}${unit}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
