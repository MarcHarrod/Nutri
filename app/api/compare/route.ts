import { NextRequest, NextResponse } from "next/server";
import { getProductProvider } from "@/lib/product";
import { analyseProduct } from "@/lib/analysis";
import type { CompareResult } from "@/lib/types";

function fv(v: number | null, unit: string) {
  if (v == null) return "—";
  if (unit === "kcal") return `${Math.round(v)} kcal`;
  return `${Math.round(v * 10) / 10}${unit}`;
}

export async function GET(req: NextRequest) {
  const a = req.nextUrl.searchParams.get("a");
  const b = req.nextUrl.searchParams.get("b");
  if (!a || !b) return NextResponse.json({ error: "Both 'a' and 'b' barcode params are required" }, { status: 400 });
  const provider = getProductProvider();
  const [prodA, prodB] = await Promise.all([provider.lookup(a), provider.lookup(b)]);
  if (!prodA || !prodB) return NextResponse.json({ error: `Product not found: ${!prodA ? a : b}` }, { status: 404 });
  const analysisA = analyseProduct(prodA);
  const analysisB = analyseProduct(prodB);
  type NKey = keyof typeof prodA.nutrients;
  const keys: NKey[] = ["energy_kcal", "fat", "saturated_fat", "sugars", "fibre", "salt"];
  const result: CompareResult = {
    product_a: analysisA,
    product_b: analysisB,
    differences: keys.map((key) => {
      const na = prodA.nutrients[key]; const nb = prodB.nutrients[key];
      const va = na.per100g; const vb = nb.per100g;
      let winner: "a" | "b" | "equal" = "equal";
      if (va != null && vb != null) { const lib = key !== "fibre" && key !== "protein"; if (va < vb) winner = lib ? "a" : "b"; else if (vb < va) winner = lib ? "b" : "a"; }
      return { key, label: na.label, a_value: fv(va, na.unit), b_value: fv(vb, nb.unit), winner, note: null };
    }),
  };
  return NextResponse.json(result);
}
