import { MODEL_WEIGHTS } from "../constants.js";

export interface ModelOutput {
  home: number;
  draw: number;
  away: number;
  expectedHomeGoals?: number;
  expectedAwayGoals?: number;
}

export function ensemblePredict(outputs: {
  elo: ModelOutput;
  poisson: ModelOutput;
  form: ModelOutput;
  squad?: ModelOutput;
}): ModelOutput {
  const w = MODEL_WEIGHTS;
  const squad = outputs.squad ?? { home: 0.33, draw: 0.34, away: 0.33 };
  const squadWeight = outputs.squad ? w.squad : 0;
  const totalWeight = w.elo + w.poisson + w.form + squadWeight;
  const norm = (v: number) => v / totalWeight;

  const home =
    norm(w.elo) * outputs.elo.home +
    norm(w.poisson) * outputs.poisson.home +
    norm(w.form) * outputs.form.home +
    norm(squadWeight) * squad.home;

  const draw =
    norm(w.elo) * outputs.elo.draw +
    norm(w.poisson) * outputs.poisson.draw +
    norm(w.form) * outputs.form.draw +
    norm(squadWeight) * squad.draw;

  const away =
    norm(w.elo) * outputs.elo.away +
    norm(w.poisson) * outputs.poisson.away +
    norm(w.form) * outputs.form.away +
    norm(squadWeight) * squad.away;

  return {
    home,
    draw,
    away,
    expectedHomeGoals: outputs.poisson.expectedHomeGoals,
    expectedAwayGoals: outputs.poisson.expectedAwayGoals,
  };
}
