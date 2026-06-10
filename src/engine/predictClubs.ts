import {
  buildClubContext,
  loadClubHistory,
  type LoadClubHistoryOptions,
} from "../data/clubHistory.js";
import { computeClubBaseline } from "../core/clubBaseline.js";
import {
  applyAnalystOverlay,
  analystSetupInstructions,
  isAnalystAvailable,
  runAnalystOverlay,
} from "../ai/analystOverlay.js";

export interface PredictClubsOptions extends LoadClubHistoryOptions {
  useAi?: boolean;
}

export interface ClubPrediction {
  homeTeam: string;
  awayTeam: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  reasoning: string;
  model: "statistical" | "statistical+overlay";
  resolvedHome: string | null;
  resolvedAway: string | null;
  baseline: {
    homeWin: number;
    draw: number;
    awayWin: number;
    confidence: number;
    expectedGoals: { home: number; away: number };
  };
}

function roundRate(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/**
 * catalog/data → core/baseline → ai/overlay pipeline for two club names.
 * Overlay applies bounded nudges; it does not fuse independent AI probabilities.
 */
export async function predictClubs(
  homeTeam: string,
  awayTeam: string,
  options: PredictClubsOptions = {},
): Promise<ClubPrediction> {
  if (!homeTeam?.trim() || !awayTeam?.trim()) {
    throw new Error("predictClubs requires both home and away club names.");
  }

  const rows = await loadClubHistory(options);
  const ctx = buildClubContext(homeTeam, awayTeam, rows);
  const baseline = computeClubBaseline(ctx);

  const useAi = options.useAi !== false;
  let homeWin = baseline.homeWin;
  let draw = baseline.draw;
  let awayWin = baseline.awayWin;
  let confidence = baseline.confidence;
  let reasoning = "Statistical baseline only (Poisson xG + record form blend).";
  let model: ClubPrediction["model"] = "statistical";

  if (useAi && !isAnalystAvailable()) {
    throw new Error(analystSetupInstructions());
  }

  if (useAi) {
    const overlay = await runAnalystOverlay(ctx, baseline);
    const applied = applyAnalystOverlay(baseline, overlay);
    homeWin = applied.homeWin;
    draw = applied.draw;
    awayWin = applied.awayWin;
    confidence = applied.confidence;
    reasoning = applied.reasoning;
    model = "statistical+overlay";
  }

  return {
    homeTeam: homeTeam.trim(),
    awayTeam: awayTeam.trim(),
    homeWin: roundRate(homeWin),
    draw: roundRate(draw),
    awayWin: roundRate(awayWin),
    confidence: roundRate(confidence),
    reasoning,
    model,
    resolvedHome: ctx.resolvedHome,
    resolvedAway: ctx.resolvedAway,
    baseline: {
      homeWin: roundRate(baseline.homeWin),
      draw: roundRate(baseline.draw),
      awayWin: roundRate(baseline.awayWin),
      confidence: roundRate(baseline.confidence),
      expectedGoals: {
        home: roundRate(baseline.expectedGoals.home),
        away: roundRate(baseline.expectedGoals.away),
      },
    },
  };
}
