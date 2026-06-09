import { describe, it, expect } from "vitest";
import { hostAdvantageBonus, crowdFactor } from "../src/models/hostAdvantage.js";

describe("Host advantage", () => {
  it("gives bonus to host playing at home venue", () => {
    expect(hostAdvantageBonus("MEX", "MEX")).toBe(100);
  });

  it("gives no bonus to non-host", () => {
    expect(hostAdvantageBonus("ARG", "USA")).toBe(0);
  });

  it("scales crowd factor with attendance", () => {
    expect(crowdFactor(80000, 80000)).toBeGreaterThan(1);
  });
});
