export type MatchStage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export interface MatchFixture {
  id: string;
  stage: MatchStage;
  group?: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  kickoff: string;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  winnerId: string | null;
  isDraw: boolean;
}
