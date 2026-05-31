import { NextRequest, NextResponse } from "next/server";
import { getProductProvider } from "@/lib/product";
import { analyseProduct } from "@/lib/analysis";

export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get("barcode");
  if (!barcode) {
    return NextResponse.json({ error: "barcode is required" }, { status: 400 });
  }

  const provider = getProductProvider();
  const product = await provider.lookup(barcode.trim());

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const analysis = analyseProduct(product);
  return NextResponse.json(analysis);
}
