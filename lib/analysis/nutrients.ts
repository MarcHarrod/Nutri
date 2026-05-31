import type { NutrientLevel, TrafficLight, NutrientProfile } from "@/lib/types";

export type RawNutrients = {
  energy_kcal?: number | null;
  fat?: number | null;
  saturated_fat?: number | null;
  carbohydrates?: number | null;
  sugars?: number | null;
  fibre?: number | null;
  protein?: number | null;
  salt?: number | null;
};

function fatTL(v: number): TrafficLight {
  return v > 17.5 ? "red" : v > 3 ? "amber" : "green";
}
function satFatTL(v: number): TrafficLight {
  return v > 5 ? "red" : v > 1.5 ? "amber" : "green";
}
function sugarsTL(v: number): TrafficLight {
  return v > 22.5 ? "red" : v > 5 ? "amber" : "green";
}
function saltTL(v: number): TrafficLight {
  return v > 1.5 ? "red" : v > 0.3 ? "amber" : "green";
}
function tlToLevel(tl: TrafficLight): NutrientLevel {
  return tl === "red" ? "high" : tl === "amber" ? "medium" : "low";
}
function energyLevel(kcal: number): NutrientLevel {
  return kcal > 400 ? "high" : kcal > 150 ? "medium" : "low";
}
function fibreLevel(g: number): NutrientLevel {
  return g >= 6 ? "high" : g >= 3 ? "medium" : "low";
}

export function buildNutrientProfile(
  raw: RawNutrients,
  servingSizeG: number | null
): NutrientProfile {
  function ps(per100: number | null): number | null {
    if (per100 == null || servingSizeG == null) return null;
    return (per100 * servingSizeG) / 100;
  }

  const fat = raw.fat ?? null;
  const satFat = raw.saturated_fat ?? null;
  const sugars = raw.sugars ?? null;
  const salt = raw.salt ?? null;
  const kcal = raw.energy_kcal ?? null;
  const fibre = raw.fibre ?? null;

  const ftl = fat != null ? fatTL(fat) : null;
  const sftl = satFat != null ? satFatTL(satFat) : null;
  const stl = sugars != null ? sugarsTL(sugars) : null;
  const saltl = salt != null ? saltTL(salt) : null;

  return {
    energy_kcal: {
      per100g: kcal,
      perServing: ps(kcal),
      level: kcal != null ? energyLevel(kcal) : null,
      trafficLight: null,
      label: "Energy",
      unit: "kcal",
    },
    fat: {
      per100g: fat,
      perServing: ps(fat),
      level: ftl ? tlToLevel(ftl) : null,
      trafficLight: ftl,
      label: "Fat",
      unit: "g",
    },
    saturated_fat: {
      per100g: satFat,
      perServing: ps(satFat),
      level: sftl ? tlToLevel(sftl) : null,
      trafficLight: sftl,
      label: "Saturated fat",
      unit: "g",
    },
    carbohydrates: {
      per100g: raw.carbohydrates ?? null,
      perServing: ps(raw.carbohydrates ?? null),
      level: null,
      trafficLight: null,
      label: "Carbohydrates",
      unit: "g",
    },
    sugars: {
      per100g: sugars,
      perServing: ps(sugars),
      level: stl ? tlToLevel(stl) : null,
      trafficLight: stl,
      label: "Total sugars",
      unit: "g",
    },
    fibre: {
      per100g: fibre,
      perServing: ps(fibre),
      level: fibre != null ? fibreLevel(fibre) : null,
      trafficLight: null,
      label: "Fibre",
      unit: "g",
    },
    protein: {
      per100g: raw.protein ?? null,
      perServing: ps(raw.protein ?? null),
      level: null,
      trafficLight: null,
      label: "Protein",
      unit: "g",
    },
    salt: {
      per100g: salt,
      perServing: ps(salt),
      level: saltl ? tlToLevel(saltl) : null,
      trafficLight: saltl,
      label: "Salt",
      unit: "g",
    },
  };
}
