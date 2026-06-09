import type { MatchFixture } from "../types/match.js";

export const GROUP_FIXTURES: MatchFixture[] = [
  { id: "A1", stage: "group", group: "A", homeTeamId: "usa", awayTeamId: "sen", venueId: "metlife", kickoff: "2026-06-11T20:00:00Z" },
  { id: "A2", stage: "group", group: "A", homeTeamId: "mex", awayTeamId: "col", venueId: "azteca", kickoff: "2026-06-12T02:00:00Z" },
  { id: "B1", stage: "group", group: "B", homeTeamId: "arg", awayTeamId: "aus", venueId: "sofi", kickoff: "2026-06-13T00:00:00Z" },
  { id: "B2", stage: "group", group: "B", homeTeamId: "bra", awayTeamId: "jpn", venueId: "att", kickoff: "2026-06-13T20:00:00Z" },
  { id: "C1", stage: "group", group: "C", homeTeamId: "fra", awayTeamId: "can", venueId: "bmo", kickoff: "2026-06-14T18:00:00Z" },
  { id: "C2", stage: "group", group: "C", homeTeamId: "mar", awayTeamId: "kor", venueId: "metlife", kickoff: "2026-06-15T00:00:00Z" },
  { id: "D1", stage: "group", group: "D", homeTeamId: "eng", awayTeamId: "irn", venueId: "sofi", kickoff: "2026-06-15T20:00:00Z" },
  { id: "D2", stage: "group", group: "D", homeTeamId: "ger", awayTeamId: "uru", venueId: "att", kickoff: "2026-06-16T02:00:00Z" },
  { id: "E1", stage: "group", group: "E", homeTeamId: "esp", awayTeamId: "sui", venueId: "bbva", kickoff: "2026-06-16T20:00:00Z" },
  { id: "E2", stage: "group", group: "E", homeTeamId: "por", awayTeamId: "cro", venueId: "azteca", kickoff: "2026-06-17T02:00:00Z" },
  { id: "F1", stage: "group", group: "F", homeTeamId: "ned", awayTeamId: "den", venueId: "bmo", kickoff: "2026-06-17T20:00:00Z" },
  { id: "F2", stage: "group", group: "F", homeTeamId: "bel", awayTeamId: "ita", venueId: "metlife", kickoff: "2026-06-18T02:00:00Z" },
];

export function getFixturesByGroup(group: string): MatchFixture[] {
  return GROUP_FIXTURES.filter((f) => f.group === group);
}
