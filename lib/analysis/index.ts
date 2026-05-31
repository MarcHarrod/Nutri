import type { ProductData, ProductAnalysis, Confidence } from "@/lib/types";
import { flagIngredients } from "./ingredients";

const DISCLAIMER =
  "Educational information only — not medical or dietary advice. Always check the product label. If you have allergies or a health condition, consult a healthcare professional.";

function assessConfidence(product: ProductData): Confidence {
  const n = product.nutrients;
  const nullCount = [n.energy_kcal.per100g, n.fat.per100g, n.saturated_fat.per100g, n.sugars.per100g, n.salt.per100g].filter((v) => v == null).length;
  if (nullCount >= 3) return "insufficient";
  if (nullCount >= 1 || !product.ingredients_text) return "low";
  if (product.source === "ocr") return "medium";
  return "high";
}

function summarise(product: ProductData): string {
  const n = product.nutrients;
  const red = [n.fat.trafficLight === "red" ? "high fat" : null, n.saturated_fat.trafficLight === "red" ? "high saturated fat" : null, n.sugars.trafficLight === "red" ? "high sugar" : null, n.salt.trafficLight === "red" ? "high salt" : null].filter(Boolean) as string[];
  const green = [n.fat.trafficLight === "green" ? "low fat" : null, n.saturated_fat.trafficLight === "green" ? "low saturated fat" : null, n.sugars.trafficLight === "green" ? "low sugar" : null, n.salt.trafficLight === "green" ? "low salt" : null, n.fibre.level === "high" ? "high fibre" : null].filter(Boolean) as string[];
  if (!red.length && !green.length) return `${product.name} has a broadly balanced nutritional profile per 100g.`;
  if (red.length && !green.length) return `${product.name} is ${red.join(", ")} per 100g — fine as an occasional choice; worth being aware of portion size.`;
  if (!red.length && green.length) return `${product.name} is ${green.join(", ")} per 100g, making it a reasonable everyday option.`;
  return `${product.name} is ${green.join(", ")} but also ${red.join(", ")} per 100g.`;
}

function goodToKnow(product: ProductData): string[] {
  const points: string[] = [];
  const n = product.nutrients;
  if (n.fibre.level === "high") points.push(`Good source of fibre (${n.fibre.per100g}g/100g), which supports digestive health.`);
  else if (n.fibre.level === "medium") points.push(`Moderate fibre content (${n.fibre.per100g}g/100g) — contributes to your 30g daily target.`);
  if (n.protein.per100g != null && n.protein.per100g >= 10) points.push(`Contains ${n.protein.per100g}g protein per 100g.`);
  if (n.sugars.trafficLight === "green") points.push("Low in total sugars per 100g.");
  if (n.fat.trafficLight === "green") points.push("Low in fat per 100g.");
  if (n.salt.trafficLight === "green") points.push("Low in salt per 100g.");
  if (n.saturated_fat.trafficLight === "green") points.push("Low in saturated fat per 100g.");
  if (n.energy_kcal.per100g != null && n.energy_kcal.per100g < 100) points.push(`Low energy density at ${n.energy_kcal.per100g} kcal per 100g.`);
  return points.slice(0, 4);
}

function worthWatching(product: ProductData, flags: ReturnType<typeof flagIngredients>): string[] {
  const points: string[] = [];
  const n = product.nutrients;
  if (n.sugars.trafficLight === "red") points.push(`High in total sugars: ${n.sugars.per100g}g/100g. NHS guidance recommends no more than 30g of free sugars per day.`);
  else if (n.sugars.trafficLight === "amber") points.push(`Medium sugar content (${n.sugars.per100g}g/100g) — check your serving size.`);
  if (n.salt.trafficLight === "red") points.push(`High in salt: ${n.salt.per100g}g/100g. Adults should aim for no more than 6g of salt per day.`);
  else if (n.salt.trafficLight === "amber") points.push(`Medium salt content (${n.salt.per100g}g/100g).`);
  if (n.saturated_fat.trafficLight === "red") points.push(`High in saturated fat: ${n.saturated_fat.per100g}g/100g.`);
  if (n.fibre.level === "low" && n.fibre.per100g != null) points.push(`Low fibre at ${n.fibre.per100g}g/100g. Most UK adults fall short of the 30g daily target.`);
  if (n.energy_kcal.level === "high") points.push(`High energy density at ${n.energy_kcal.per100g} kcal/100g.`);
  const s6 = flags.filter((f) => f.category === "colour" && ["E102","E110","E122","E129","E104","E124"].includes(f.e_number ?? ""));
  if (s6.length > 0) points.push(`Contains ${s6.map((f) => f.name).join(", ")} — artificial colours that carry a UK advisory label about effects on children's activity and attention.`);
  return points.slice(0, 5);
}

function whyItMatters(product: ProductData): string | null {
  const n = product.nutrients;
  const highSugar = n.sugars.trafficLight === "red";
  const highSalt = n.salt.trafficLight === "red";
  const highSatFat = n.saturated_fat.trafficLight === "red";
  const count = [highSugar, highSalt, highSatFat].filter(Boolean).length;
  if (count >= 2) return "This product scores high on two or more of sugar, salt, and saturated fat — not unusual for snacks or ready meals, but worth keeping an eye on portion size.";
  if (highSugar) return "High sugar is the main watch-out here. The UK 30g free-sugars limit adds up quickly across drinks, sauces, and snacks throughout the day.";
  if (highSalt) return "High salt is the main watch-out. It's often hidden in savoury processed foods; a typical diet can exceed 6g/day through multiple small contributions.";
  if (highSatFat) return "Saturated fat is the main watch-out. It tends to raise LDL cholesterol when eaten in excess.";
  return null;
}

export function analyseProduct(product: ProductData): ProductAnalysis {
  const flags = flagIngredients(product.ingredients_text);
  return {
    id: crypto.randomUUID(),
    product,
    confidence: assessConfidence(product),
    summary: summarise(product),
    good_to_know: goodToKnow(product),
    worth_watching: worthWatching(product, flags),
    why_it_matters: whyItMatters(product),
    ingredient_flags: flags,
    disclaimer: DISCLAIMER,
    analysed_at: new Date().toISOString(),
  };
}
