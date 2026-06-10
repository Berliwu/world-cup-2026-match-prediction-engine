import { describe, expect, it, vi } from "vitest";
import {
  buildClubContext,
  type ClubRow,
  resetClubHistoryCache,
} from "../src/data/clubHistory.js";
import { computeClubBaseline } from "../src/core/clubBaseline.js";
import * as overlay from "../src/ai/analystOverlay.js";
import { predictClubs } from "../src/engine/predictClubs.js";

const SAMPLE_ROWS: ClubRow[] = [
  { homeTeam: "Arsenal", awayTeam: "Chelsea", homeGoals: 2, awayGoals: 1 },
  { homeTeam: "Chelsea", awayTeam: "Arsenal", homeGoals: 1, awayGoals: 1 },
  { homeTeam: "Arsenal", awayTeam: "Liverpool", homeGoals: 3, awayGoals: 0 },
  { homeTeam: "Liverpool", awayTeam: "Arsenal", homeGoals: 0, awayGoals: 2 },
  { homeTeam: "Chelsea", awayTeam: "Liverpool", homeGoals: 1, awayGoals: 2 },
  { homeTeam: "Arsenal", awayTeam: "Chelsea", homeGoals: 1, awayGoals: 0 },
];

describe("clubHistory + clubBaseline", () => {
  it("builds context and normalized baseline from sample rows", () => {
    const ctx = buildClubContext("Arsenal", "Chelsea", SAMPLE_ROWS);
    expect(ctx.resolvedHome).toBe("Arsenal");
    expect(ctx.resolvedAway).toBe("Chelsea");
    expect(ctx.headToHead.played).toBeGreaterThan(0);

    const baseline = computeClubBaseline(ctx);
    expect(baseline.homeWin + baseline.draw + baseline.awayWin).toBeCloseTo(1, 5);
    expect(baseline.confidence).toBeGreaterThan(0);
    expect(baseline.expectedGoals.home).toBeGreaterThan(0);
  });
});

describe("analystOverlay", () => {
  it("applies bounded nudges without fusion weighting", () => {
    const baseline = {
      homeWin: 0.5,
      draw: 0.25,
      awayWin: 0.25,
      confidence: 0.7,
      expectedGoals: { home: 1.6, away: 1.1 },
    };
    const overlayResult = overlay.applyAnalystOverlay(baseline, {
      reasoning: "Home edge from recent form.",
      confidence: 0.65,
      nudges: { home: 0.05, draw: -0.02, away: -0.03 },
    });
    expect(overlayResult.homeWin + overlayResult.draw + overlayResult.awayWin).toBeCloseTo(1, 5);
    expect(overlayResult.homeWin).toBeGreaterThan(baseline.homeWin);
    expect(overlayResult.reasoning).toContain("Home edge");
  });
});

describe("predictClubs", () => {
  it("returns statistical-only prediction when useAi is false", async () => {
    resetClubHistoryCache();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(
        [
          "home_team,away_team,target__home_team__full_time_goals,target__away_team__full_time_goals",
          ...SAMPLE_ROWS.map(
            (r) => `${r.homeTeam},${r.awayTeam},${r.homeGoals},${r.awayGoals}`,
          ),
        ].join("\n"),
        { status: 200 },
      );

    try {
      const result = await predictClubs("Arsenal", "Chelsea", { useAi: false, useCache: false });
      expect(result.model).toBe("statistical");
      expect(result.homeWin + result.draw + result.awayWin).toBeCloseTo(1, 2);
      expect(result.resolvedHome).toBe("Arsenal");
      expect(result.resolvedAway).toBe("Chelsea");
    } finally {
      globalThis.fetch = originalFetch;
      resetClubHistoryCache();
    }
  });

  it("requires API key when useAi is true", async () => {
    vi.spyOn(overlay, "isAnalystAvailable").mockReturnValue(false);
    resetClubHistoryCache();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(
        "home_team,away_team,target__home_team__full_time_goals,target__away_team__full_time_goals\nArsenal,Chelsea,1,0",
        { status: 200 },
      );

    try {
      await expect(predictClubs("Arsenal", "Chelsea", { useAi: true, useCache: false })).rejects.toThrow(
        /OPENAI_API_KEY/,
      );
    } finally {
      vi.restoreAllMocks();
      globalThis.fetch = originalFetch;
      resetClubHistoryCache();
    }
  });
});
