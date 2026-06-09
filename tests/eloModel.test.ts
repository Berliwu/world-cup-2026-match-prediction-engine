import { describe, it, expect } from "vitest";
import { eloOutcomeProb } from "../src/core/ratings/eloModel.js";

describe("eloModel", () => {
  it("favors stronger home side", () => {
    const r = eloOutcomeProb(2000, 1600);
    expect(r.home).toBeGreaterThan(r.away);
    expect(r.home + r.draw + r.away).toBeCloseTo(1, 2);
  });
});
