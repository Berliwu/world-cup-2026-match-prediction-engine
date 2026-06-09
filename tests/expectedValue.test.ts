import { describe, it, expect } from "vitest";
import { expectedValue, impliedProbability, calculateEdge } from "../src/utils/expectedValue.js";

describe("Expected value", () => {
  it("calculates positive EV", () => {
    expect(expectedValue(0.55, 2.0)).toBeGreaterThan(0);
  });

  it("derives implied probability", () => {
    expect(impliedProbability(2.0)).toBe(0.5);
  });

  it("calculates edge", () => {
    expect(calculateEdge(0.55, 0.45)).toBeCloseTo(0.1, 2);
  });
});
