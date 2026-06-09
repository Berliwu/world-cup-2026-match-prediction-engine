export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatOdds(prob: number): string {
  if (prob <= 0) return "N/A";
  const decimal = 1 / prob;
  return decimal.toFixed(2);
}

export function padTeam(name: string, width = 20): string {
  return name.padEnd(width);
}
