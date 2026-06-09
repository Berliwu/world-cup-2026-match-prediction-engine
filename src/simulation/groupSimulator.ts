import type { MatchFixture } from "../types/match.js";

export function totalGroupMatches(fixtures: MatchFixture[]): number {
  const groups = new Set(fixtures.map((f) => f.group).filter(Boolean));
  return groups.size * 6;
}
