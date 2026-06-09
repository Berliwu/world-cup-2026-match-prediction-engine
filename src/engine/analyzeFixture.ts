import { nationById } from "../catalog/nations.js";
import type { ScheduledMatch } from "../catalog/schedule.js";
import type { FixtureAnalysis } from "../domain/types.js";
import { eloOutcomeProb } from "../core/ratings/eloModel.js";
import { goalExpectation, poissonOutcomes } from "../core/goals/poissonModel.js";
import { recentForm, momentumScore, attackDefense } from "../core/form/momentum.js";
import { mixModels, normalize } from "../core/blend/weightedMixer.js";

export function analyzeFixture(match: ScheduledMatch, profile = "balanced"): FixtureAnalysis {
  const home = nationById(match.homeId);
  const away = nationById(match.awayId);
  if (!home || !away) throw new Error(`Unknown nation in ${match.id}`);

  const elo = eloOutcomeProb(home.eloRating, away.eloRating, home.isHost ? 80 : 65);
  const hForm = recentForm(home.id);
  const aForm = recentForm(away.id);
  const hAD = attackDefense(hForm);
  const aAD = attackDefense(aForm);
  const poisson = poissonOutcomes(goalExpectation(hAD.attack, aAD.defense), goalExpectation(aAD.attack, hAD.defense));
  const hMom = momentumScore(hForm);
  const aMom = momentumScore(aForm);
  const total = hMom + aMom || 1;
  const form = normalize({
    home: hMom / total * 0.7 + 0.15,
    draw: 0.2,
    away: aMom / total * 0.7 + 0.15,
  });
  const outcomes = mixModels(elo, poisson, form);

  return {
    fixtureId: match.id,
    outcomes,
    expectedGoals: { home: poisson.xgHome, away: poisson.xgAway },
    confidence: 0.72,
    profile,
  };
}
