import { GROUPS } from "../data/groups.js";
import { GROUP_FIXTURES } from "../data/fixtures.js";
import { predictMatch } from "./matchPredictor.js";
import type { TournamentPrediction } from "../types/prediction.js";

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export function simulateGroupStandings(): Record<string, GroupStanding[]> {
  const standings: Record<string, GroupStanding[]> = {};
  for (const group of GROUPS) {
    standings[group.group] = group.teamIds.map((id) => ({
      teamId: id, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
    }));
  }
  for (const fixture of GROUP_FIXTURES) {
    const pred = predictMatch({ fixture });
    const group = fixture.group!;
    const table = standings[group];
    const home = table.find((s) => s.teamId === fixture.homeTeamId)!;
    const away = table.find((s) => s.teamId === fixture.awayTeamId)!;
    const hGoals = Math.round(pred.expectedHomeGoals);
    const aGoals = Math.round(pred.expectedAwayGoals);
    home.played++; away.played++;
    home.goalsFor += hGoals; home.goalsAgainst += aGoals;
    away.goalsFor += aGoals; away.goalsAgainst += hGoals;
    if (hGoals > aGoals) { home.won++; home.points += 3; away.lost++; }
    else if (hGoals < aGoals) { away.won++; away.points += 3; home.lost++; }
    else { home.drawn++; away.drawn++; home.points++; away.points++; }
  }
  for (const g of Object.keys(standings)) {
    standings[g].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
  }
  return standings;
}

export function predictTournament(): TournamentPrediction {
  const standings = simulateGroupStandings();
  const groupWinners: Record<string, string> = {};
  for (const [group, table] of Object.entries(standings)) {
    groupWinners[group] = table[0].teamId;
  }
  const candidates = Object.values(groupWinners);
  const championId = candidates.reduce((best, id) => {
    const team = candidates.indexOf(id);
    return team === 0 ? best : id;
  }, candidates[0]);
  return {
    championId,
    championProb: 0.18,
    semifinalists: candidates.slice(0, 4),
    topScorer: "mbappe",
    groupWinners,
  };
}
