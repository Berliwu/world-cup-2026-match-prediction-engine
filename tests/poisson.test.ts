import { describe, it, expect } from "vitest";
import { poissonPmf, outcomeProbsFromMatrix, scoreMatrix, expectedGoals } from "../src/models/poisson.js";

describe("Poisson model", () => {
  it("computes valid PMF values", () => {
    const p = poissonPmf(2, 1.5);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });

  it("score matrix sums to ~1", () => {
    const matrix = scoreMatrix(1.4, 1.1);
    let total = 0;
    for (const row of matrix) for (const cell of row) total += cell;
    expect(total).toBeCloseTo(1, 1);
  });

  it("derives outcome probabilities", () => {
    const matrix = scoreMatrix(1.5, 1.0);
    const probs = outcomeProbsFromMatrix(matrix);
    expect(probs.home + probs.draw + probs.away).toBeCloseTo(1, 2);
  });

  it("estimates expected goals", () => {
    expect(expectedGoals(1.2, 0.9)).toBeGreaterThan(0.3);
  });
});
