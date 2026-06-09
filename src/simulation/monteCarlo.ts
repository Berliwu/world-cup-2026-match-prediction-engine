export function runMonteCarloBracket(
  trials: number,
  simulate: () => string
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (let i = 0; i < trials; i++) {
    const winner = simulate();
    counts[winner] = (counts[winner] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round((v / trials) * 1000) / 1000])
  );
}
