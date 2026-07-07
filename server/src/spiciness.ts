export interface SpiceLevel {
  id: string;
  level: number;
  emoji: string;
  label: string;
  shortLabel: string;
  color: string;
}

export const SPICE_LEVELS: SpiceLevel[] = [
  { id: "mild", level: 1, emoji: "🥒", label: "Mild", shortLabel: "Mild", color: "#86efac" },
  { id: "medium", level: 2, emoji: "🌶️", label: "Medium", shortLabel: "Medium", color: "#fbbf24" },
  { id: "spicy", level: 3, emoji: "🔥", label: "Spicy", shortLabel: "Spicy", color: "#f97316" },
  { id: "extra-spicy", level: 4, emoji: "🥵", label: "Extra Spicy", shortLabel: "Extra", color: "#ef4444" },
  { id: "korean-fire", level: 5, emoji: "🍗", label: "Korean Fire Chicken", shortLabel: "K-Fire", color: "#dc2626" },
  {
    id: "nuclear",
    level: 6,
    emoji: "☢️",
    label: "Nuclear Bell Pepper Korean Overload Spicy",
    shortLabel: "NUCLEAR",
    color: "#7f1d1d",
  },
];

export const SPICE_MAP = Object.fromEntries(SPICE_LEVELS.map((s) => [s.id, s]));

export function spiceFromId(id: string): SpiceLevel | undefined {
  return SPICE_MAP[id];
}

export function spiceFromLevel(level: number): SpiceLevel | undefined {
  return SPICE_LEVELS.find((s) => s.level === level);
}

export function topSpiceFromCounts(
  counts: Record<string, number>
): SpiceLevel | null {
  let best: SpiceLevel | null = null;
  let bestCount = 0;
  for (const spice of SPICE_LEVELS) {
    const count = counts[spice.id] ?? 0;
    if (count > bestCount) {
      bestCount = count;
      best = spice;
    }
  }
  return best;
}

export function averageSpiceLevel(counts: Record<string, number>): number {
  let total = 0;
  let count = 0;
  for (const spice of SPICE_LEVELS) {
    const n = counts[spice.id] ?? 0;
    total += spice.level * n;
    count += n;
  }
  return count === 0 ? 0 : Math.round((total / count) * 10) / 10;
}