import { describe, it, expect } from "vitest";
import { americanToDecimal, calculateKellyCriterion } from "../src/utils/kellyCriterion.js";

describe("Kelly criterion", () => {
  it("converts positive American odds", () => {
    expect(americanToDecimal(200)).toBe(2);
  });

  it("converts negative American odds", () => {
    expect(americanToDecimal(-150)).toBeCloseTo(0.67, 1);
  });

  it("returns positive Kelly for pricing edge", () => {
    expect(calculateKellyCriterion(150, 0.5)).toBeGreaterThan(0);
  });

  it("returns zero for negative EV bet", () => {
    expect(calculateKellyCriterion(-300, 0.3)).toBe(0);
  });
});
