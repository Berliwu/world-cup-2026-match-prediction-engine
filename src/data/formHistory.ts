import type { RecentResult } from "../models/formScore.js";

export const FORM_HISTORY: Record<string, RecentResult[]> = {
  arg: [
    { opponentId: "bra", goalsFor: 2, goalsAgainst: 0, isHome: true },
    { opponentId: "uru", goalsFor: 1, goalsAgainst: 1, isHome: false },
    { opponentId: "chi", goalsFor: 3, goalsAgainst: 0, isHome: true },
  ],
  bra: [
    { opponentId: "arg", goalsFor: 0, goalsAgainst: 2, isHome: false },
    { opponentId: "col", goalsFor: 2, goalsAgainst: 1, isHome: true },
    { opponentId: "per", goalsFor: 4, goalsAgainst: 0, isHome: true },
  ],
  usa: [
    { opponentId: "mex", goalsFor: 2, goalsAgainst: 2, isHome: true },
    { opponentId: "can", goalsFor: 1, goalsAgainst: 0, isHome: false },
    { opponentId: "jpn", goalsFor: 2, goalsAgainst: 1, isHome: true },
  ],
};

export function getFormForTeam(teamId: string): RecentResult[] {
  return FORM_HISTORY[teamId] ?? [];
}
