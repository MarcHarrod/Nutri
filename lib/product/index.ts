import type { ProductProvider } from "./types";
import { MockProvider } from "./providers/mock";
import { OpenFoodFactsProvider } from "./providers/open-food-facts";

export function getProductProvider(): ProductProvider {
  const provider = process.env.PRODUCT_PROVIDER ?? "mock";
  switch (provider) {
    case "off":
    case "open-food-facts":
      return new OpenFoodFactsProvider();
    default:
      return new MockProvider();
  }
}

export type { ProductProvider } from "./types";
