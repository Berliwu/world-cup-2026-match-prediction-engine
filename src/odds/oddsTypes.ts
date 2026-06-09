export interface MarketOdds {
  matchId: string;
  homeAmerican: number;
  drawAmerican: number;
  awayAmerican: number;
  source: string;
  fetchedAt: string;
}

export interface NormalizedOdds {
  matchId: string;
  homeDecimal: number;
  drawDecimal: number;
  awayDecimal: number;
  homeImplied: number;
  drawImplied: number;
  awayImplied: number;
}
