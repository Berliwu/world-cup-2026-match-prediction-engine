export interface MatchPrediction {
  matchId: string;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  confidence: number;
  model: string;
}

export interface TournamentPrediction {
  championId: string;
  championProb: number;
  semifinalists: string[];
  topScorer: string;
  groupWinners: Record<string, string>;
}

export interface ValueBet {
  matchId: string;
  outcome: "home" | "draw" | "away";
  modelProb: number;
  marketProb: number;
  edge: number;
  kellyFraction: number;
}
