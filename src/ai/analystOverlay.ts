import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type { ClubMatchContext } from "../data/clubHistory.js";
import type { ClubBaseline } from "../core/clubBaseline.js";
import { loadEnv } from "../config/env.js";

const overlaySchema = z.object({
  reasoning: z.string().describe("Short analyst narrative explaining the outlook"),
  confidence: z.number().min(0).max(1).describe("Analyst confidence in the nudge direction"),
  nudges: z
    .object({
      home: z.number().min(-0.12).max(0.12).describe("Additive shift to home win probability"),
      draw: z.number().min(-0.12).max(0.12).describe("Additive shift to draw probability"),
      away: z.number().min(-0.12).max(0.12).describe("Additive shift to away win probability"),
    })
    .describe("Bounded corrections applied on top of the statistical baseline"),
});

export type AnalystOverlay = z.infer<typeof overlaySchema>;

export interface OverlayResult {
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  reasoning: string;
}

const FLOOR = 0.06;

function formatRecord(label: string, record: ClubMatchContext["homeRecord"]): string {
  if (record.played === 0) return `${label}: no matches in dataset`;
  return `${label}: ${record.played} matches, ${record.wins}W-${record.draws}D-${record.losses}L, goals ${record.goalsFor}-${record.goalsAgainst}`;
}

function buildPrompt(ctx: ClubMatchContext, baseline: ClubBaseline): string {
  return [
    "You are a club football analyst reviewing a pure statistical baseline.",
    "Do NOT replace the baseline wholesale. Return small nudges (-0.12 to +0.12) that reflect tactical context the stats miss.",
    `Fixture: ${ctx.homeTeam} (home) vs ${ctx.awayTeam} (away).`,
    `Resolved dataset names: home=${ctx.resolvedHome ?? "unknown"}, away=${ctx.resolvedAway ?? "unknown"}.`,
    formatRecord("Home record", ctx.homeRecord),
    formatRecord("Away record", ctx.awayRecord),
    ctx.headToHead.played > 0
      ? `Head-to-head: ${ctx.headToHead.played} matches (${ctx.headToHead.homeWins}-${ctx.headToHead.draws}-${ctx.headToHead.awayWins} from home perspective)`
      : "Head-to-head: none in dataset",
    `League draw rate: ${(ctx.leagueDrawRate * 100).toFixed(1)}%`,
    `Statistical baseline: home ${(baseline.homeWin * 100).toFixed(1)}%, draw ${(baseline.draw * 100).toFixed(1)}%, away ${(baseline.awayWin * 100).toFixed(1)}%`,
    `xG estimate: ${baseline.expectedGoals.home.toFixed(2)} - ${baseline.expectedGoals.away.toFixed(2)}`,
    "Nudges should sum near zero (zero-sum reallocation). Keep confidence lower when data is sparse.",
  ].join("\n");
}

function openAiProvider() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const baseURL = process.env.OPENAI_BASE_URL?.trim();
  return createOpenAI({
    apiKey: apiKey ?? "",
    baseURL: baseURL || undefined,
  });
}

export function isAnalystAvailable(): boolean {
  loadEnv();
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function analystSetupInstructions(): string {
  return [
    "AI analyst overlay requires OPENAI_API_KEY (use --no-ai for baseline-only).",
    "Setup:",
    "  1. cp .env.example .env",
    "  2. Set OPENAI_API_KEY=sk-... in .env",
    "  3. Optional: OPENAI_MODEL=gpt-4o-mini",
  ].join("\n");
}

/** Apply analyst nudges on top of the statistical anchor (overlay, not weighted fusion). */
export function applyAnalystOverlay(baseline: ClubBaseline, overlay: AnalystOverlay): OverlayResult {
  const homeWin = Math.max(FLOOR, baseline.homeWin + overlay.nudges.home);
  const draw = Math.max(FLOOR, baseline.draw + overlay.nudges.draw);
  const awayWin = Math.max(FLOOR, baseline.awayWin + overlay.nudges.away);
  const sum = homeWin + draw + awayWin;
  const confidence = Math.min(
    baseline.confidence,
    overlay.confidence,
    baseline.confidence * 0.7 + overlay.confidence * 0.3,
  );
  return {
    homeWin: homeWin / sum,
    draw: draw / sum,
    awayWin: awayWin / sum,
    confidence: Math.min(1, Math.max(0, confidence)),
    reasoning: overlay.reasoning,
  };
}

/** Request bounded analyst nudges from an LLM. */
export async function runAnalystOverlay(
  ctx: ClubMatchContext,
  baseline: ClubBaseline,
): Promise<AnalystOverlay> {
  loadEnv();
  if (!isAnalystAvailable()) {
    throw new Error(analystSetupInstructions());
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const { object } = await generateObject({
    model: openAiProvider()(model),
    schema: overlaySchema,
    prompt: buildPrompt(ctx, baseline),
  });
  return object;
}
