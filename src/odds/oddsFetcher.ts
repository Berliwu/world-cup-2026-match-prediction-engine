import type { MarketOdds, NormalizedOdds } from "./oddsTypes.js";
import { americanToDecimal } from "../utils/kellyCriterion.js";
import { impliedProbability } from "../utils/expectedValue.js";

const MOCK_ODDS: MarketOdds[] = [
  { matchId: "A1", homeAmerican: -150, drawAmerican: 280, awayAmerican: 400, source: "mock", fetchedAt: new Date().toISOString() },
  { matchId: "B1", homeAmerican: -200, drawAmerican: 320, awayAmerican: 550, source: "mock", fetchedAt: new Date().toISOString() },
  { matchId: "C1", homeAmerican: -180, drawAmerican: 300, awayAmerican: 480, source: "mock", fetchedAt: new Date().toISOString() },
];

export async function fetchOdds(matchId?: string): Promise<MarketOdds[]> {
  await new Promise((r) => setTimeout(r, 10));
  return matchId ? MOCK_ODDS.filter((o) => o.matchId === matchId) : MOCK_ODDS;
}

export function normalizeOdds(odds: MarketOdds): NormalizedOdds {
  const homeDecimal = americanToDecimal(odds.homeAmerican);
  const drawDecimal = americanToDecimal(odds.drawAmerican);
  const awayDecimal = americanToDecimal(odds.awayAmerican);
  return {
    matchId: odds.matchId,
    homeDecimal, drawDecimal, awayDecimal,
    homeImplied: impliedProbability(homeDecimal),
    drawImplied: impliedProbability(drawDecimal),
    awayImplied: impliedProbability(awayDecimal),
  };
}
