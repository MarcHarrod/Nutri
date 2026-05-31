import type { IngredientFlag, IngredientFlagCategory } from "@/lib/types";

type Pattern = {
  category: IngredientFlagCategory;
  pattern: RegExp;
  name: string;
  e_number: string | null;
  explanation: string;
};

const PATTERNS: Pattern[] = [
  { category: "added-sugar", pattern: /\b(glucose[- ]?syrup|high[- ]fructose[- ]corn[- ]syrup|corn[- ]syrup|invert[- ]sugar|fruit[- ]juice[- ]concentrate|dextrose|maltose)\b/i, name: "Added sugars", e_number: null, explanation: "A form of added sugar. Like table sugar, it contributes to total sugar intake without adding other nutrients." },
  { category: "added-sugar", pattern: /\b(glucose-fructose[- ]syrup|isoglucose)\b/i, name: "Glucose-fructose syrup", e_number: null, explanation: "A liquid sweetener made from processed starch, often used in soft drinks and confectionery." },
  { category: "sweetener", pattern: /\b(aspartame|e951)\b/i, name: "Aspartame", e_number: "E951", explanation: "An intense artificial sweetener. Carries a PKU warning label. Provides sweetness without calories." },
  { category: "sweetener", pattern: /\b(acesulfame[- ]?k|acesulfame[- ]potassium|e950)\b/i, name: "Acesulfame K", e_number: "E950", explanation: "A zero-calorie artificial sweetener, often used alongside aspartame." },
  { category: "sweetener", pattern: /\b(sucralose|e955)\b/i, name: "Sucralose", e_number: "E955", explanation: "A no-calorie sweetener made from sugar. Generally well tolerated." },
  { category: "sweetener", pattern: /\b(stevia|steviol|stevioside|rebaudioside|e960)\b/i, name: "Stevia", e_number: "E960", explanation: "A plant-derived sweetener with zero calories." },
  { category: "sweetener", pattern: /\b(sorbitol|e420)\b/i, name: "Sorbitol", e_number: "E420", explanation: "A sugar alcohol sweetener. Can have a laxative effect in large amounts." },
  { category: "sweetener", pattern: /\b(xylitol|e967)\b/i, name: "Xylitol", e_number: "E967", explanation: "A sugar alcohol with fewer calories than sugar. Toxic to dogs." },
  { category: "sweetener", pattern: /\b(maltitol|e965)\b/i, name: "Maltitol", e_number: "E965", explanation: "A sugar alcohol used in 'sugar-free' products. Still contributes some calories." },
  { category: "preservative", pattern: /\b(sodium[- ]benzoate|e211)\b/i, name: "Sodium benzoate", e_number: "E211", explanation: "A common preservative in drinks and sauces." },
  { category: "preservative", pattern: /\b(potassium[- ]sorbate|e202)\b/i, name: "Potassium sorbate", e_number: "E202", explanation: "A widely used preservative to prevent mould and yeast. Generally considered low-risk." },
  { category: "preservative", pattern: /\b(sodium[- ]nitrite|sodium[- ]nitrate|e250|e251)\b/i, name: "Sodium nitrite/nitrate", e_number: "E250/E251", explanation: "Used to cure and preserve processed meats. There is ongoing research into their role in health." },
  { category: "preservative", pattern: /\b(sulphur[- ]dioxide|sulfur[- ]dioxide|sulphites|sulfites|e220|e221|e222|e223|e224|e225|e226|e227|e228)\b/i, name: "Sulphites", e_number: "E220-E228", explanation: "Preservatives in dried fruits and wine. Must be declared on UK labels above 10mg/kg." },
  { category: "emulsifier", pattern: /\b(lecithin|e322)\b/i, name: "Lecithin", e_number: "E322", explanation: "An emulsifier that helps fats and water mix. Commonly from soya or sunflower." },
  { category: "emulsifier", pattern: /\b(mono[- ]and[- ]diglycerides|e471)\b/i, name: "Mono- and diglycerides", e_number: "E471", explanation: "Emulsifiers that improve texture in baked goods and spreads." },
  { category: "emulsifier", pattern: /\b(xanthan[- ]gum|e415)\b/i, name: "Xanthan gum", e_number: "E415", explanation: "A widely used thickener from fermentation. Generally well tolerated." },
  { category: "emulsifier", pattern: /\b(carrageenan|e407)\b/i, name: "Carrageenan", e_number: "E407", explanation: "A seaweed-derived thickener used in dairy alternatives and processed foods." },
  { category: "emulsifier", pattern: /\b(polysorbate|e432|e433|e434|e435|e436)\b/i, name: "Polysorbates", e_number: "E432-E436", explanation: "Synthetic emulsifiers in ice cream and baked goods." },
  { category: "colour", pattern: /\b(tartrazine|e102)\b/i, name: "Tartrazine", e_number: "E102", explanation: "A yellow artificial colour. One of the Southampton Six with a UK advisory label about children's activity and attention." },
  { category: "colour", pattern: /\b(sunset[- ]yellow|e110)\b/i, name: "Sunset Yellow", e_number: "E110", explanation: "An orange-yellow artificial colour. Part of the Southampton Six group." },
  { category: "colour", pattern: /\b(allura[- ]red|e129)\b/i, name: "Allura Red", e_number: "E129", explanation: "A red artificial colour. Part of the Southampton Six group." },
  { category: "colour", pattern: /\b(quinoline[- ]yellow|e104)\b/i, name: "Quinoline Yellow", e_number: "E104", explanation: "A yellow-green artificial colour. Part of the Southampton Six group." },
  { category: "colour", pattern: /\b(ponceau|e124)\b/i, name: "Ponceau 4R", e_number: "E124", explanation: "A red artificial colour. Part of the Southampton Six group." },
  { category: "flavouring", pattern: /\bnatural[- ]flavour(?:ing)?s?\b/i, name: "Natural flavourings", e_number: null, explanation: "Flavourings derived from natural sources. 'Natural' does not specify which source or quantities." },
  { category: "flavouring", pattern: /\bartificial[- ]flavour(?:ing)?s?\b/i, name: "Artificial flavourings", e_number: null, explanation: "Synthetically produced flavour compounds. Functionally similar to natural equivalents at the doses used." },
  { category: "flavouring", pattern: /\b(monosodium[- ]glutamate|\bmsg\b|e621)\b/i, name: "MSG", e_number: "E621", explanation: "A flavour enhancer. The glutamate it contains also occurs naturally in tomatoes and cheese." },
  { category: "refined-oil", pattern: /\bpalm[- ]oil\b/i, name: "Palm oil", e_number: null, explanation: "A widely used vegetable oil. Associated with deforestation in some supply chains." },
  { category: "refined-oil", pattern: /\bpartially[- ]hydrogenated\b/i, name: "Partially hydrogenated oils", e_number: null, explanation: "A source of artificial trans fats, effectively banned in the UK and EU." },
  { category: "caffeine", pattern: /\b(caffeine|guarana|green[- ]tea[- ]extract|matcha)\b/i, name: "Caffeine source", e_number: null, explanation: "Contains caffeine. NHS advises a maximum of 200mg/day during pregnancy." },
  { category: "processing-indicator", pattern: /\bmodified[- ](starch|maize[- ]starch|tapioca[- ]starch|wheat[- ]starch)\b/i, name: "Modified starch", e_number: null, explanation: "Starch processed to change its properties. A common indicator of a processed product." },
  { category: "processing-indicator", pattern: /\bmaltodextrin\b/i, name: "Maltodextrin", e_number: null, explanation: "A processed carbohydrate used as a filler or thickener. High glycaemic index." },
  { category: "processing-indicator", pattern: /\bsoy[a]?[- ]?protein[- ](isolate|concentrate)\b/i, name: "Isolated soya protein", e_number: null, explanation: "A heavily refined protein extract used in processed foods." },
];

export function flagIngredients(ingredientsText: string | null): IngredientFlag[] {
  if (!ingredientsText) return [];
  const seen = new Set<string>();
  return PATTERNS.filter((p) => {
    if (p.pattern.test(ingredientsText) && !seen.has(p.name)) {
      seen.add(p.name);
      return true;
    }
    return false;
  }).map(({ category, name, e_number, explanation }) => ({ category, name, e_number, explanation }));
}
