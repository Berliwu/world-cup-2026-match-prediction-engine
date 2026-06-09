import { describe, it, expect } from "vitest";
import { expectedScore, winDrawLossProbs, updateElo } from "../src/models/elo.js";

describe("Elo model", () => {
  it("calculates expected score for equal ratings", () => {
    expect(expectedScore(1500, 1500)).toBeCloseTo(0.5, 2);
  });

  it("favors higher rated team", () => {
    expect(expectedScore(1800, 1600)).toBeGreaterThan(0.6);
  });

  it("returns valid W/D/L probabilities", () => {
    const probs = winDrawLossProbs(1900, 1700);
    expect(probs.home + probs.draw + probs.away).toBeCloseTo(1, 2);
    expect(probs.home).toBeGreaterThan(probs.away);
  });

  it("updates ratings after win", () => {
    const { winnerNew, loserNew } = updateElo(1800, 1600, false);
    expect(winnerNew).toBeGreaterThan(1800);
    expect(loserNew).toBeLessThan(1600);
  });
});
