export type Confidence = "high" | "medium" | "low" | "insufficient";
export type NutrientLevel = "high" | "medium" | "low";
export type TrafficLight = "red" | "amber" | "green";

export type Nutrient = {
  per100g: number | null;
  perServing: number | null;
  level: NutrientLevel | null;
  trafficLight: TrafficLight | null;
  label: string;
  unit: string;
};

export type NutrientProfile = {
  energy_kcal: Nutrient;
  fat: Nutrient;
  saturated_fat: Nutrient;
  carbohydrates: Nutrient;
  sugars: Nutrient;
  fibre: Nutrient;
  protein: Nutrient;
  salt: Nutrient;
};

export type IngredientFlagCategory =
  | "added-sugar"
  | "sweetener"
  | "preservative"
  | "emulsifier"
  | "colour"
  | "flavouring"
  | "refined-oil"
  | "caffeine"
  | "processing-indicator";

export type IngredientFlag = {
  category: IngredientFlagCategory;
  name: string;
  e_number: string | null;
  explanation: string;
};

export type ProductData = {
  id: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  categories: string[];
  image_url: string | null;
  ingredients_text: string | null;
  allergens: string[];
  nutrients: NutrientProfile;
  serving_size_g: number | null;
  source: "open-food-facts" | "mock" | "ocr";
  source_url: string | null;
  last_updated: string | null;
};

export type ProductAnalysis = {
  id: string;
  product: ProductData;
  confidence: Confidence;
  summary: string;
  good_to_know: string[];
  worth_watching: string[];
  why_it_matters: string | null;
  ingredient_flags: IngredientFlag[];
  disclaimer: string;
  analysed_at: string;
};

export type HistoryEntry = {
  id: string;
  barcode: string | null;
  product_name: string;
  brand: string | null;
  scanned_at: string;
  analysis: ProductAnalysis;
};

export type ComparisonDiff = {
  key: keyof NutrientProfile;
  label: string;
  a_value: string;
  b_value: string;
  winner: "a" | "b" | "equal";
  note: string | null;
};

export type CompareResult = {
  product_a: ProductAnalysis;
  product_b: ProductAnalysis;
  differences: ComparisonDiff[];
};
