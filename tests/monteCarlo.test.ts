import { describe, it, expect } from "vitest";
import { runMonteCarlo } from "../src/engine/monteCarloBracket.js";

describe("monteCarlo", () => {
  it("returns champion frequencies", () => {
    expect(Object.keys(runMonteCarlo(20)).length).toBeGreaterThan(0);
  });
});
