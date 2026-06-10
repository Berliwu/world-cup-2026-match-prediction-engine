import type { ClubMatchContext, TeamRecord } from "../data/clubHistory.js";
import { goalExpectation, poissonOutcomes } from "./goals/poissonModel.js";
import { mixModels, normalize } from "./blend/weightedMixer.js";

export interface ClubBaseline {
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  expectedGoals: { home: number; away: number };
}

type Triple = { home: number; draw: number; away: number };

const PRIOR: Triple = { home: 0.42, draw: 0.26, away: 0.32 };
const FLOOR = 0.08;

function teamRates(record: TeamRecord): Triple {
  if (record.played === 0) return { home: 1 / 3, draw: 1 / 3, away: 1 / 3 };
  return {
    home: record.wins / record.played,
    draw: record.draws / record.played,
    away: record.losses / record.played,
  };
}

function attackDefense(record: TeamRecord): { attack: number; defense: number } {
  if (record.played === 0) return { attack: 1, defense: 1 };
  const gf = record.goalsFor / record.played;
  const ga = record.goalsAgainst / record.played;
  return {
    attack: Math.max(0.5, gf / 1.35),
    defense: Math.max(0.5, 1.35 / Math.max(0.5, ga)),
  };
}

function recordTriple(home: TeamRecord, away: TeamRecord, drawRate: number): Triple {
  const h = teamRates(home);
  const a = teamRates(away);
  return normalize({
    home: h.home * 0.45 + a.away * 0.35,
    draw: ((h.draw + a.draw) / 2) * 0.5 + drawRate * 0.5,
    away: a.home * 0.45 + h.away * 0.35,
  });
}

function sampleConfidence(ctx: ClubMatchContext): number {
  const samples =
    ctx.homeRecord.played + ctx.awayRecord.played + ctx.headToHead.played * 2;
  const knownTeams = Number(Boolean(ctx.resolvedHome)) + Number(Boolean(ctx.resolvedAway));
  return Math.min(0.92, Math.max(0.18, (samples / 18) * (knownTeams / 2)));
}

function applyPrior(triple: Triple, weight: number): Triple {
  return normalize({
    home: triple.home * (1 - weight) + PRIOR.home * weight,
    draw: triple.draw * (1 - weight) + PRIOR.draw * weight,
    away: triple.away * (1 - weight) + PRIOR.away * weight,
  });
}

function applyHeadToHead(triple: Triple, ctx: ClubMatchContext): Triple {
  if (ctx.headToHead.played === 0) return triple;
  const w = Math.min(0.3, ctx.headToHead.played / 10);
  const h2h = normalize({
    home: ctx.headToHead.homeWins / ctx.headToHead.played,
    draw: ctx.headToHead.draws / ctx.headToHead.played,
    away: ctx.headToHead.awayWins / ctx.headToHead.played,
  });
  return normalize({
    home: triple.home * (1 - w) + h2h.home * w,
    draw: triple.draw * (1 - w) + h2h.draw * w,
    away: triple.away * (1 - w) + h2h.away * w,
  });
}

function toRates(triple: Triple, confidence: number, expectedGoals: { home: number; away: number }): ClubBaseline {
  const homeWin = Math.max(FLOOR, triple.home);
  const draw = Math.max(FLOOR, triple.draw);
  const awayWin = Math.max(FLOOR, triple.away);
  const sum = homeWin + draw + awayWin;
  return {
    homeWin: homeWin / sum,
    draw: draw / sum,
    awayWin: awayWin / sum,
    confidence,
    expectedGoals,
  };
}

/** Pure statistical baseline: Poisson xG + record form via weightedMixer. */
export function computeClubBaseline(ctx: ClubMatchContext): ClubBaseline {
  const hAD = attackDefense(ctx.homeRecord);
  const aAD = attackDefense(ctx.awayRecord);
  const poisson = poissonOutcomes(
    goalExpectation(hAD.attack, aAD.defense),
    goalExpectation(aAD.attack, hAD.defense),
  );

  const record = recordTriple(ctx.homeRecord, ctx.awayRecord, ctx.leagueDrawRate);
  const priorWeight = Math.max(0.2, 1 - sampleConfidence(ctx));
  const adjustedRecord = applyPrior(record, priorWeight);
  const withH2H = applyHeadToHead(adjustedRecord, ctx);

  const mixed = mixModels(
    withH2H,
    { home: poisson.home, draw: poisson.draw, away: poisson.away },
    withH2H,
    { elo: 0.25, poisson: 0.45, form: 0.3 },
  );

  return toRates(mixed, sampleConfidence(ctx), {
    home: poisson.xgHome,
    away: poisson.xgAway,
  });
}
