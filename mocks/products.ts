import type { ProductData } from "@/lib/types";
import { buildNutrientProfile } from "@/lib/analysis/nutrients";

function mock(
  id: string,
  barcode: string,
  name: string,
  brand: string,
  categories: string[],
  image_url: string | null,
  ingredients_text: string,
  allergens: string[],
  raw: {
    energy_kcal?: number;
    fat?: number;
    saturated_fat?: number;
    carbohydrates?: number;
    sugars?: number;
    fibre?: number;
    protein?: number;
    salt?: number;
  },
  serving_size_g: number | null
): ProductData {
  return {
    id,
    barcode,
    name,
    brand,
    categories,
    image_url,
    ingredients_text,
    allergens,
    nutrients: buildNutrientProfile(raw, serving_size_g),
    serving_size_g,
    source: "mock",
    source_url: null,
    last_updated: "2025-01-01T00:00:00Z",
  };
}

export const MOCK_PRODUCTS: ProductData[] = [
  mock(
    "kelloggs-corn-flakes",
    "5000163058169",
    "Corn Flakes",
    "Kellogg's",
    ["Breakfast cereals", "Cereals"],
    null,
    "Maize (97%), Sugar, Salt, Barley malt flavouring, Vitamins and minerals: Niacin (B3), Iron, Vitamin B6, Riboflavin (B2), Thiamin (B1), Folic acid, Vitamin D, Vitamin B12.",
    ["Gluten (barley)"],
    { energy_kcal: 371, fat: 0.9, saturated_fat: 0.1, carbohydrates: 84, sugars: 8, fibre: 3, protein: 7, salt: 1.1 },
    30
  ),
  mock(
    "warburtons-wholemeal",
    "5010044006568",
    "Wholemeal Sliced Bread",
    "Warburtons",
    ["Breads", "Bakery"],
    null,
    "Wholemeal Wheat Flour (83%), Water, Yeast, Salt, Fermented Wheat Flour, Vegetable Oil (Rapeseed), Wheat Protein, Emulsifier: E471; Preservative: Calcium Propionate (added to inhibit mould).",
    ["Gluten (wheat)"],
    { energy_kcal: 217, fat: 2.5, saturated_fat: 0.4, carbohydrates: 38, sugars: 3.4, fibre: 6.2, protein: 9.8, salt: 1.0 },
    44
  ),
  mock(
    "haribo-starmix",
    "4001686319284",
    "Starmix",
    "Haribo",
    ["Confectionery", "Sweets"],
    null,
    "Glucose syrup, Sugar, Gelatine, Dextrose, Citric acid, Fruit and plant concentrates: Apple, Blackcurrant, Grape, Orange, Lemon, Spirulina; Glazing agents: Beeswax, Carnauba wax; Flavourings. Contains Gelatine.",
    [],
    { energy_kcal: 333, fat: 0.5, saturated_fat: 0.2, carbohydrates: 77, sugars: 46, fibre: 0, protein: 6.9, salt: 0.05 },
    100
  ),
  mock(
    "innocent-orange-juice",
    "5038862213000",
    "Smooth Orange Juice",
    "Innocent",
    ["Juices", "Drinks"],
    null,
    "Freshly squeezed orange juice (100%).",
    [],
    { energy_kcal: 41, fat: 0.1, saturated_fat: 0, carbohydrates: 9, sugars: 8.4, fibre: 0.2, protein: 0.5, salt: 0 },
    250
  ),
  mock(
    "pringles-original",
    "5053990103649",
    "Original Crisps",
    "Pringles",
    ["Crisps", "Snacks"],
    null,
    "Dried Potatoes, Vegetable Oils (Sunflower, Corn), Corn Flour, Wheat Starch, Rice Flour, Maltodextrin, Emulsifier (E471), Salt, Dextrose, Modified Wheat Starch, Natural Flavourings.",
    ["Gluten (wheat)"],
    { energy_kcal: 536, fat: 34, saturated_fat: 9, carbohydrates: 51, sugars: 2, fibre: 3.4, protein: 4, salt: 1.3 },
    30
  ),
  mock(
    "alpro-oat-original",
    "5411188119999",
    "Oat Drink Original",
    "Alpro",
    ["Plant-based drinks", "Oat drinks"],
    null,
    "Oat base (Water, Oat (9.7%)), Sunflower oil, Calcium (tri-calcium phosphate), Sea salt, Vitamins: Riboflavin (B2), B12, D2. Contains: Oat. Free from: Dairy, Soya.",
    ["Gluten (oat)"],
    { energy_kcal: 46, fat: 1.5, saturated_fat: 0.2, carbohydrates: 6.6, sugars: 4, fibre: 0.8, protein: 1, salt: 0.12 },
    200
  ),
  mock(
    "bisto-gravy-granules",
    "5000168003001",
    "Original Gravy Granules",
    "Bisto",
    ["Sauces", "Cooking"],
    null,
    "Potato Starch, Salt, Wheat Flour, Flavour Enhancers: Monosodium Glutamate, Disodium Guanylate, Disodium Inosinate; Vegetable Oil (Palm), Caramel Colour, Onion Powder, Dried Yeast, Natural Flavourings.",
    ["Gluten (wheat)", "May contain Celery, Mustard"],
    { energy_kcal: 361, fat: 7, saturated_fat: 3.5, carbohydrates: 67, sugars: 5, fibre: 2, protein: 5, salt: 16.5 },
    4
  ),
  mock(
    "mcvities-digestives",
    "5000168103013",
    "Original Digestive Biscuits",
    "McVitie's",
    ["Biscuits", "Bakery"],
    null,
    "Wholemeal Wheat Flour (35%), Sugar, Vegetable Oil (Sustainable Palm, Rapeseed), Partially Inverted Sugar Syrup, Raising Agents: Sodium Bicarbonate, Tartaric Acid; Salt, Glucose-fructose Syrup.",
    ["Gluten (wheat)"],
    { energy_kcal: 481, fat: 20.3, saturated_fat: 9.3, carbohydrates: 66, sugars: 16.6, fibre: 3.5, protein: 6.8, salt: 0.9 },
    2
  ),
];
