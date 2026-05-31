import type { ProductProvider } from "../types";
import type { ProductData } from "@/lib/types";
import { buildNutrientProfile } from "@/lib/analysis/nutrients";

const OFF_BASE = "https://world.openfoodfacts.org";
const USER_AGENT = process.env.OFF_USER_AGENT ?? "Nutri/0.1 (contact@example.com)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOFFProduct(barcode: string, p: any): ProductData {
  const n = p.nutriments ?? {};
  const servingG = p.serving_quantity ? Number(p.serving_quantity) : null;
  return {
    id: barcode,
    barcode,
    name: p.product_name_en ?? p.product_name ?? "Unknown product",
    brand: p.brands ?? null,
    categories: p.categories_tags?.slice(0, 5) ?? [],
    image_url: p.image_front_url ?? p.image_url ?? null,
    ingredients_text: p.ingredients_text_en ?? p.ingredients_text ?? null,
    allergens: p.allergens_tags ?? [],
    nutrients: buildNutrientProfile(
      {
        energy_kcal: n["energy-kcal_100g"] ?? null,
        fat: n["fat_100g"] ?? null,
        saturated_fat: n["saturated-fat_100g"] ?? null,
        carbohydrates: n["carbohydrates_100g"] ?? null,
        sugars: n["sugars_100g"] ?? null,
        fibre: n["fiber_100g"] ?? n["fibre_100g"] ?? null,
        protein: n["proteins_100g"] ?? null,
        salt: n["salt_100g"] ?? null,
      },
      servingG
    ),
    serving_size_g: servingG,
    source: "open-food-facts",
    source_url: `https://world.openfoodfacts.org/product/${barcode}`,
    last_updated: p.last_modified_t ? new Date(p.last_modified_t * 1000).toISOString() : null,
  };
}

export class OpenFoodFactsProvider implements ProductProvider {
  async lookup(barcode: string): Promise<ProductData | null> {
    try {
      const res = await fetch(
        `${OFF_BASE}/api/v2/product/${barcode}.json?fields=product_name,product_name_en,brands,categories_tags,image_front_url,image_url,ingredients_text,ingredients_text_en,allergens_tags,nutriments,serving_quantity,last_modified_t`,
        { headers: { "User-Agent": USER_AGENT }, next: { revalidate: 3600 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status !== 1 || !data.product) return null;
      return mapOFFProduct(barcode, data.product);
    } catch {
      return null;
    }
  }

  async search(query: string): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({ action: "process", search_terms: query, search_simple: "1", json: "1", page_size: "10", fields: "code,product_name,product_name_en,brands,image_front_url,nutriments,serving_quantity" });
      const res = await fetch(`${OFF_BASE}/cgi/search.pl?${params}`, { headers: { "User-Agent": USER_AGENT }, next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.products ?? []).map((p: { code: string }) => mapOFFProduct(p.code, p));
    } catch {
      return [];
    }
  }
}
