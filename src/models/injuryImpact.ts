export interface InjuryReport {
  playerId: string;
  severity: "minor" | "major" | "out";
  position: string;
}

export function injurySeverityScore(reports: InjuryReport[]): number {
  if (reports.length === 0) return 0;
  const weights = { minor: 0.1, major: 0.4, out: 1.0 };
  const total = reports.reduce((s, r) => s + weights[r.severity], 0);
  return Math.min(1, total / 3);
}

export function ratingPenaltyFromInjuries(reports: InjuryReport[]): number {
  return injurySeverityScore(reports) * 80;
}
