import type { ProductData } from "@/lib/types";

export interface ProductProvider {
  lookup(barcode: string): Promise<ProductData | null>;
  search(query: string): Promise<ProductData[]>;
}
