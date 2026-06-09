export interface RecentResult {
  opponentId: string;
  goalsFor: number;
  goalsAgainst: number;
  isHome: boolean;
}

export function calculateFormScore(results: RecentResult[], window = 5): number {
  if (results.length === 0) return 0.5;
  const recent = results.slice(-window);
  let points = 0;
  for (const r of recent) {
    if (r.goalsFor > r.goalsAgainst) points += 3;
    else if (r.goalsFor === r.goalsAgainst) points += 1;
  }
  const maxPoints = recent.length * 3;
  return maxPoints > 0 ? points / maxPoints : 0.5;
}

export function attackDefenseFromForm(
  results: RecentResult[]
): { attack: number; defense: number } {
  if (results.length === 0) return { attack: 1, defense: 1 };
  const goalsFor = results.reduce((s, r) => s + r.goalsFor, 0) / results.length;
  const goalsAgainst = results.reduce((s, r) => s + r.goalsAgainst, 0) / results.length;
  return {
    attack: Math.max(0.5, goalsFor / 1.35),
    defense: Math.max(0.5, 1.35 / Math.max(0.5, goalsAgainst)),
  };
}
