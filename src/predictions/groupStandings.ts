import type { GroupStanding } from "./tournamentPredictor.js";

export function resolveHeadToHead(
  teams: GroupStanding[],
  tiedIds: string[]
): GroupStanding[] {
  const tied = teams.filter((t) => tiedIds.includes(t.teamId));
  return tied.sort((a, b) => (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
}

export function bestThirdPlace(
  allStandings: Record<string, GroupStanding[]>
): string[] {
  const thirds = Object.values(allStandings).map((g) => g[2]).filter(Boolean);
  return thirds
    .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
    .slice(0, 8)
    .map((s) => s.teamId);
}
