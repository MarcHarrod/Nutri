import type { ProductProvider } from "../types";
import type { ProductData } from "@/lib/types";
import { MOCK_PRODUCTS } from "@/mocks/products";

export class MockProvider implements ProductProvider {
  async lookup(barcode: string): Promise<ProductData | null> {
    return MOCK_PRODUCTS.find((p) => p.barcode === barcode) ?? null;
  }

  async search(query: string): Promise<ProductData[]> {
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q)
    );
  }
}
