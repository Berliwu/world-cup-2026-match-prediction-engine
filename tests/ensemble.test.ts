import { describe, it, expect } from "vitest";
import { ensemblePredict } from "../src/models/ensemble.js";

describe("Ensemble model", () => {
  it("combines model outputs with weights", () => {
    const result = ensemblePredict({
      elo: { home: 0.6, draw: 0.2, away: 0.2 },
      poisson: { home: 0.5, draw: 0.25, away: 0.25 },
      form: { home: 0.4, draw: 0.3, away: 0.3 },
    });
    expect(result.home + result.draw + result.away).toBeCloseTo(1, 2);
    expect(result.home).toBeGreaterThan(0.4);
  });
});
