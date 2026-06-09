export interface OutcomeTriple { home: number; draw: number; away: number; }
export interface FixtureAnalysis {
  fixtureId: string;
  outcomes: OutcomeTriple;
  expectedGoals: { home: number; away: number };
  confidence: number;
  profile: string;
}
export interface GroupTableRow {
  nationId: string; played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; points: number;
}
