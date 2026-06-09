import type { Team } from "../types/team.js";

export const TEAMS: Team[] = [
  { id: "usa", name: "United States", code: "USA", fifaRank: 11, confederation: "CONCACAF", eloRating: 1780, isHost: true },
  { id: "mex", name: "Mexico", code: "MEX", fifaRank: 14, confederation: "CONCACAF", eloRating: 1765, isHost: true },
  { id: "can", name: "Canada", code: "CAN", fifaRank: 41, confederation: "CONCACAF", eloRating: 1680, isHost: true },
  { id: "arg", name: "Argentina", code: "ARG", fifaRank: 1, confederation: "CONMEBOL", eloRating: 1985 },
  { id: "fra", name: "France", code: "FRA", fifaRank: 2, confederation: "UEFA", eloRating: 1960 },
  { id: "bra", name: "Brazil", code: "BRA", fifaRank: 3, confederation: "CONMEBOL", eloRating: 1945 },
  { id: "eng", name: "England", code: "ENG", fifaRank: 4, confederation: "UEFA", eloRating: 1920 },
  { id: "esp", name: "Spain", code: "ESP", fifaRank: 5, confederation: "UEFA", eloRating: 1910 },
  { id: "ger", name: "Germany", code: "GER", fifaRank: 6, confederation: "UEFA", eloRating: 1895 },
  { id: "por", name: "Portugal", code: "POR", fifaRank: 7, confederation: "UEFA", eloRating: 1885 },
  { id: "ned", name: "Netherlands", code: "NED", fifaRank: 8, confederation: "UEFA", eloRating: 1875 },
  { id: "bel", name: "Belgium", code: "BEL", fifaRank: 9, confederation: "UEFA", eloRating: 1865 },
  { id: "ita", name: "Italy", code: "ITA", fifaRank: 10, confederation: "UEFA", eloRating: 1855 },
  { id: "cro", name: "Croatia", code: "CRO", fifaRank: 12, confederation: "UEFA", eloRating: 1840 },
  { id: "uru", name: "Uruguay", code: "URU", fifaRank: 13, confederation: "CONMEBOL", eloRating: 1835 },
  { id: "mar", name: "Morocco", code: "MAR", fifaRank: 15, confederation: "CAF", eloRating: 1820 },
  { id: "col", name: "Colombia", code: "COL", fifaRank: 16, confederation: "CONMEBOL", eloRating: 1815 },
  { id: "jpn", name: "Japan", code: "JPN", fifaRank: 17, confederation: "AFC", eloRating: 1805 },
  { id: "sui", name: "Switzerland", code: "SUI", fifaRank: 18, confederation: "UEFA", eloRating: 1800 },
  { id: "sen", name: "Senegal", code: "SEN", fifaRank: 19, confederation: "CAF", eloRating: 1795 },
  { id: "irn", name: "Iran", code: "IRN", fifaRank: 20, confederation: "AFC", eloRating: 1790 },
  { id: "den", name: "Denmark", code: "DEN", fifaRank: 21, confederation: "UEFA", eloRating: 1785 },
  { id: "kor", name: "South Korea", code: "KOR", fifaRank: 22, confederation: "AFC", eloRating: 1775 },
  { id: "aus", name: "Australia", code: "AUS", fifaRank: 23, confederation: "AFC", eloRating: 1770 },
];

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function getTeamByCode(code: string): Team | undefined {
  return TEAMS.find((t) => t.code === code);
}
