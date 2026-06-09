import { GROUP_DRAW } from "../catalog/groups.js";
import { OPENING_FIXTURES, type ScheduledMatch } from "../catalog/schedule.js";
import type { GroupTableRow } from "../domain/types.js";
import { analyzeFixture } from "./analyzeFixture.js";

export function simulateGroupTables(fixtures: ScheduledMatch[] = OPENING_FIXTURES): Record<string, GroupTableRow[]> {
  const tables: Record<string, GroupTableRow[]> = {};
  for (const [g, ids] of Object.entries(GROUP_DRAW)) {
    tables[g] = ids.map((id) => ({
      nationId: id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0,
    }));
  }
  for (const f of fixtures) {
    const a = analyzeFixture(f);
    const row = tables[f.group];
    const home = row.find((r) => r.nationId === f.homeId)!;
    const away = row.find((r) => r.nationId === f.awayId)!;
    const hg = Math.round(a.expectedGoals.home);
    const ag = Math.round(a.expectedGoals.away);
    home.played++; away.played++;
    home.goalsFor += hg; home.goalsAgainst += ag;
    away.goalsFor += ag; away.goalsAgainst += hg;
    if (hg > ag) { home.won++; home.points += 3; away.lost++; }
    else if (hg < ag) { away.won++; away.points += 3; home.lost++; }
    else { home.drawn++; away.drawn++; home.points++; away.points++; }
  }
  for (const g of Object.keys(tables)) {
    tables[g].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
  }
  return tables;
}
