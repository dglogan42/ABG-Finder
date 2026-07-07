export interface Snack {
  id: string;
  emoji: string;
  name: string;
  tier: number;
  label: string;
}

export const SNACKS: Snack[] = [
  { id: "rice", emoji: "🍚", name: "Plain Rice", tier: 1, label: "Nah" },
  { id: "ramen", emoji: "🍜", name: "Ramen", tier: 2, label: "Decent" },
  { id: "mochi", emoji: "🍡", name: "Mochi", tier: 3, label: "Sweet" },
  { id: "matcha", emoji: "🍵", name: "Matcha", tier: 4, label: "Refined" },
  { id: "bubble-tea", emoji: "🧋", name: "Bubble Tea", tier: 5, label: "Baddie" },
  { id: "dumplings", emoji: "🥟", name: "Dumplings", tier: 6, label: "Elite" },
];

export const SNACK_MAP = Object.fromEntries(SNACKS.map((s) => [s.id, s]));

export function snackFromId(id: string): Snack | undefined {
  return SNACK_MAP[id];
}

export function topSnackFromCounts(
  counts: Record<string, number>
): Snack | null {
  let best: Snack | null = null;
  let bestCount = 0;
  for (const snack of SNACKS) {
    const count = counts[snack.id] ?? 0;
    if (count > bestCount) {
      bestCount = count;
      best = snack;
    }
  }
  return best;
}

export function averageTier(counts: Record<string, number>): number {
  let total = 0;
  let count = 0;
  for (const snack of SNACKS) {
    const n = counts[snack.id] ?? 0;
    total += snack.tier * n;
    count += n;
  }
  return count === 0 ? 0 : Math.round((total / count) * 10) / 10;
}