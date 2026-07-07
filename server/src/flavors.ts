export type FlavorDimension = "sweetness" | "spicy" | "unique";

export interface FlavorLevel {
  id: string;
  level: number;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
}

export interface FlavorDimensionConfig {
  id: FlavorDimension;
  snackEmoji: string;
  snackName: string;
  title: string;
  description: string;
  gradient: string;
  levels: FlavorLevel[];
}

export const SWEETNESS_LEVELS: FlavorLevel[] = [
  { id: "unsweetened", level: 1, label: "Unsweetened", shortLabel: "Plain", emoji: "🧊", color: "#bae6fd" },
  { id: "light", level: 2, label: "Light Sweet", shortLabel: "Light", emoji: "💧", color: "#fbcfe8" },
  { id: "classic", level: 3, label: "Classic 50%", shortLabel: "50%", emoji: "🧋", color: "#f9a8d4" },
  { id: "full-sugar", level: 4, label: "Full Sugar", shortLabel: "Full", emoji: "🍬", color: "#f472b6" },
  { id: "brown-sugar", level: 5, label: "Brown Sugar Boba", shortLabel: "Brown", emoji: "🟤", color: "#ec4899" },
  { id: "coma", level: 6, label: "Diabetic Coma Sweet", shortLabel: "COMA", emoji: "🍯", color: "#be185d" },
];

export const SPICY_LEVELS: FlavorLevel[] = [
  { id: "mild", level: 1, label: "Mild", shortLabel: "Mild", emoji: "🥒", color: "#86efac" },
  { id: "medium", level: 2, label: "Medium", shortLabel: "Medium", emoji: "🌶️", color: "#fbbf24" },
  { id: "spicy", level: 3, label: "Spicy", shortLabel: "Spicy", emoji: "🔥", color: "#f97316" },
  { id: "extra-spicy", level: 4, label: "Extra Spicy", shortLabel: "Extra", emoji: "🥵", color: "#ef4444" },
  { id: "korean-fire", level: 5, label: "Korean Fire Chicken", shortLabel: "K-Fire", emoji: "🍗", color: "#dc2626" },
  {
    id: "nuclear",
    level: 6,
    label: "Nuclear Bell Pepper Korean Overload Spicy",
    shortLabel: "NUCLEAR",
    emoji: "☢️",
    color: "#7f1d1d",
  },
];

export const UNIQUE_LEVELS: FlavorLevel[] = [
  { id: "basic", level: 1, label: "Basic", shortLabel: "Basic", emoji: "😐", color: "#d1d5db" },
  { id: "familiar", level: 2, label: "Familiar", shortLabel: "Famil.", emoji: "✨", color: "#86efac" },
  { id: "interesting", level: 3, label: "Interesting", shortLabel: "Intrig.", emoji: "🌿", color: "#4ade80" },
  { id: "distinctive", level: 4, label: "Distinctive", shortLabel: "Distinct", emoji: "🍵", color: "#2dd4bf" },
  { id: "rare", level: 5, label: "Rare Find", shortLabel: "Rare", emoji: "💎", color: "#8b5cf6" },
  { id: "unicorn", level: 6, label: "Once-in-a-Lifetime Unicorn", shortLabel: "UNICORN", emoji: "🦄", color: "#7c3aed" },
];

export const FLAVOR_DIMENSIONS: FlavorDimensionConfig[] = [
  {
    id: "sweetness",
    snackEmoji: "🧋",
    snackName: "Bubble Tea",
    title: "Sweetness",
    description: "How sweet is she?",
    gradient: "linear-gradient(90deg, #bae6fd, #fbcfe8, #f472b6, #be185d)",
    levels: SWEETNESS_LEVELS,
  },
  {
    id: "spicy",
    snackEmoji: "🍜",
    snackName: "Ramen",
    title: "Spiciness",
    description: "How hot is she?",
    gradient: "linear-gradient(90deg, #86efac, #fbbf24, #f97316, #ef4444, #dc2626, #7f1d1d)",
    levels: SPICY_LEVELS,
  },
  {
    id: "unique",
    snackEmoji: "🍵",
    snackName: "Matcha",
    title: "Unique Flavor",
    description: "How one-of-a-kind is she?",
    gradient: "linear-gradient(90deg, #d1d5db, #86efac, #2dd4bf, #8b5cf6, #7c3aed)",
    levels: UNIQUE_LEVELS,
  },
];

const LEVEL_MAP: Record<FlavorDimension, Record<string, FlavorLevel>> = {
  sweetness: Object.fromEntries(SWEETNESS_LEVELS.map((l) => [l.id, l])),
  spicy: Object.fromEntries(SPICY_LEVELS.map((l) => [l.id, l])),
  unique: Object.fromEntries(UNIQUE_LEVELS.map((l) => [l.id, l])),
};

export function levelFromId(
  dimension: FlavorDimension,
  id: string
): FlavorLevel | undefined {
  return LEVEL_MAP[dimension][id];
}

export function dimensionConfig(
  dimension: FlavorDimension
): FlavorDimensionConfig | undefined {
  return FLAVOR_DIMENSIONS.find((d) => d.id === dimension);
}

export function topLevelFromCounts(
  dimension: FlavorDimension,
  counts: Record<string, number>
): FlavorLevel | null {
  const config = dimensionConfig(dimension);
  if (!config) return null;

  let best: FlavorLevel | null = null;
  let bestCount = 0;
  for (const level of config.levels) {
    const count = counts[level.id] ?? 0;
    if (count > bestCount) {
      bestCount = count;
      best = level;
    }
  }
  return best;
}

export function averageLevel(
  dimension: FlavorDimension,
  counts: Record<string, number>
): number {
  const config = dimensionConfig(dimension);
  if (!config) return 0;

  let total = 0;
  let count = 0;
  for (const level of config.levels) {
    const n = counts[level.id] ?? 0;
    total += level.level * n;
    count += n;
  }
  return count === 0 ? 0 : Math.round((total / count) * 10) / 10;
}