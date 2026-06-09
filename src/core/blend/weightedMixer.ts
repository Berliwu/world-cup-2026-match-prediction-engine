type Triple = { home: number; draw: number; away: number };

export function normalize(t: Triple): Triple {
  const s = t.home + t.draw + t.away;
  return { home: t.home / s, draw: t.draw / s, away: t.away / s };
}

export function mixModels(
  elo: Triple, poisson: Triple, form: Triple,
  weights = { elo: 0.35, poisson: 0.30, form: 0.35 }
): Triple {
  return normalize({
    home: weights.elo * elo.home + weights.poisson * poisson.home + weights.form * form.home,
    draw: weights.elo * elo.draw + weights.poisson * poisson.draw + weights.form * form.draw,
    away: weights.elo * elo.away + weights.poisson * poisson.away + weights.form * form.away,
  });
}
