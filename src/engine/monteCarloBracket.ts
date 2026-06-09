import { GROUP_DRAW } from "../catalog/groups.js";
import { nationById } from "../catalog/nations.js";
import { simulateGroupTables } from "./simulateGroups.js";

export function runMonteCarlo(trials = 500): Record<string, number> {
  const counts: Record<string, number> = {};
  for (let i = 0; i < trials; i++) {
    const tables = simulateGroupTables();
    const winners = Object.values(tables).map((t) => t[0].nationId);
    const best = winners.reduce((a, b) =>
      (nationById(a)?.eloRating ?? 0) >= (nationById(b)?.eloRating ?? 0) ? a : b
    );
    counts[best] = (counts[best] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, Math.round(v / trials * 1000) / 1000]));
}
