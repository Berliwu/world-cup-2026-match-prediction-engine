import { describe, it, expect } from "vitest";
import { predictMatch } from "../src/predictions/matchPredictor.js";
import { GROUP_FIXTURES } from "../src/data/fixtures.js";

describe("Match predictor", () => {
  it("predicts a group match", () => {
    const pred = predictMatch({ fixture: GROUP_FIXTURES[0] });
    expect(pred.homeWinProb + pred.drawProb + pred.awayWinProb).toBeCloseTo(1, 2);
    expect(pred.confidence).toBeGreaterThan(0);
    expect(pred.expectedHomeGoals).toBeGreaterThan(0);
  });

  it("throws for unknown teams", () => {
    expect(() =>
      predictMatch({
        fixture: { ...GROUP_FIXTURES[0], homeTeamId: "unknown" },
      })
    ).toThrow();
  });
});
