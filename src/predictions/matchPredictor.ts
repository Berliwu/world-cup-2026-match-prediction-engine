import { getTeamById } from "../data/teams.js";
import { getFormForTeam } from "../data/formHistory.js";
import { winDrawLossProbs } from "../models/elo.js";
import { expectedGoals, outcomeProbsFromMatrix, scoreMatrix } from "../models/poisson.js";
import { attackDefenseFromForm, calculateFormScore, type RecentResult } from "../models/formScore.js";
import { ensemblePredict } from "../models/ensemble.js";
import { calculateConfidence, modelAgreement } from "./confidence.js";
import type { MatchFixture } from "../types/match.js";
import type { MatchPrediction } from "../types/prediction.js";

export interface PredictorInput {
  fixture: MatchFixture;
  homeForm?: RecentResult[];
  awayForm?: RecentResult[];
}

export function predictMatch(input: PredictorInput): MatchPrediction {
  const home = getTeamById(input.fixture.homeTeamId);
  const away = getTeamById(input.fixture.awayTeamId);
  if (!home || !away) throw new Error(`Unknown team in fixture ${input.fixture.id}`);

  const homeForm = input.homeForm ?? getFormForTeam(home.id);
  const awayForm = input.awayForm ?? getFormForTeam(away.id);

  const elo = winDrawLossProbs(home.eloRating, away.eloRating, home.isHost ? 80 : 65);
  const homeAD = attackDefenseFromForm(homeForm);
  const awayAD = attackDefenseFromForm(awayForm);
  const homeLambda = expectedGoals(homeAD.attack, awayAD.defense);
  const awayLambda = expectedGoals(awayAD.attack, homeAD.defense);
  const matrix = scoreMatrix(homeLambda, awayLambda);
  const poisson = outcomeProbsFromMatrix(matrix);
  poisson.expectedHomeGoals = homeLambda;
  poisson.expectedAwayGoals = awayLambda;

  const homeFormScore = calculateFormScore(homeForm);
  const awayFormScore = calculateFormScore(awayForm);
  const formTotal = homeFormScore + awayFormScore || 1;
  const form = {
    home: homeFormScore / formTotal * 0.7 + 0.15,
    away: awayFormScore / formTotal * 0.7 + 0.15,
    draw: 0.2,
  };

  const ensemble = ensemblePredict({ elo, poisson, form });
  const agreement = modelAgreement([
    [elo.home, elo.draw, elo.away],
    [poisson.home, poisson.draw, poisson.away],
    [form.home, form.draw, form.away],
  ]);

  return {
    matchId: input.fixture.id,
    homeWinProb: Math.round(ensemble.home * 1000) / 1000,
    drawProb: Math.round(ensemble.draw * 1000) / 1000,
    awayWinProb: Math.round(ensemble.away * 1000) / 1000,
    expectedHomeGoals: Math.round((ensemble.expectedHomeGoals ?? homeLambda) * 100) / 100,
    expectedAwayGoals: Math.round((ensemble.expectedAwayGoals ?? awayLambda) * 100) / 100,
    confidence: calculateConfidence(agreement, 0.8, homeForm.length + awayForm.length),
    model: "ensemble-v1",
  };
}
