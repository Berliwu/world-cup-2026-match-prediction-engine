import { describe, it, expect } from "vitest";
import { analyzeFixture } from "../src/engine/analyzeFixture.js";
import { OPENING_FIXTURES } from "../src/catalog/schedule.js";

describe("analyzeFixture", () => {
  it("returns normalized outcomes", () => {
    const r = analyzeFixture(OPENING_FIXTURES[0]);
    const s = r.outcomes.home + r.outcomes.draw + r.outcomes.away;
    expect(s).toBeCloseTo(1, 2);
  });
});
