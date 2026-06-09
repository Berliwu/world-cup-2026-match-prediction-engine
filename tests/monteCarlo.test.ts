import { describe, it, expect } from "vitest";
import { runMonteCarloBracket } from "../src/simulation/monteCarlo.js";

describe("Monte Carlo bracket", () => {
  it("returns winner frequencies", () => {
    const r = runMonteCarloBracket(50, () => "arg");
    expect(r.arg).toBe(1);
  });
});
