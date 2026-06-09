import { fetchOdds, normalizeOdds } from "./oddsFetcher.js";
import { calculateEdge } from "../utils/expectedValue.js";
import { calculateKellyCriterion } from "../utils/kellyCriterion.js";
import type { MatchPrediction, ValueBet } from "../types/prediction.js";

export async function findValueBets(
  predictions: MatchPrediction[],
  minEdge = 0.03
): Promise<ValueBet[]> {
  const valueBets: ValueBet[] = [];
  for (const pred of predictions) {
    const market = await fetchOdds(pred.matchId);
    if (market.length === 0) continue;
    const normalized = normalizeOdds(market[0]);
    const outcomes: Array<{ outcome: "home" | "draw" | "away"; modelProb: number; marketProb: number; american: number }> = [
      { outcome: "home", modelProb: pred.homeWinProb, marketProb: normalized.homeImplied, american: market[0].homeAmerican },
      { outcome: "draw", modelProb: pred.drawProb, marketProb: normalized.drawImplied, american: market[0].drawAmerican },
      { outcome: "away", modelProb: pred.awayWinProb, marketProb: normalized.awayImplied, american: market[0].awayAmerican },
    ];
    for (const o of outcomes) {
      const edge = calculateEdge(o.modelProb, o.marketProb);
      if (edge >= minEdge) {
        valueBets.push({
          matchId: pred.matchId,
          outcome: o.outcome,
          modelProb: o.modelProb,
          marketProb: o.marketProb,
          edge,
          kellyFraction: calculateKellyCriterion(o.american, o.modelProb),
        });
      }
    }
  }
  return valueBets.sort((a, b) => b.edge - a.edge);
}
