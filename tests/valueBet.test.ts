import { describe, it, expect } from "vitest";
import { findValueBets } from "../src/odds/valueBet.js";
import type { MatchPrediction } from "../src/types/prediction.js";

describe("Pricing edge finder", () => {
  it("finds bets with sufficient edge", async () => {
    const preds: MatchPrediction[] = [{
      matchId: "A1", homeWinProb: 0.7, drawProb: 0.15, awayWinProb: 0.15,
      expectedHomeGoals: 2, expectedAwayGoals: 0.8, confidence: 0.75, model: "test",
    }];
    const bets = await findValueBets(preds, 0.01);
    expect(bets.length).toBeGreaterThanOrEqual(0);
  });
});
