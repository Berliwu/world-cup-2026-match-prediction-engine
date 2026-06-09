type Triple = { home: number; draw: number; away: number };

function fact(n: number): number { return n <= 1 ? 1 : n * fact(n - 1); }
function pmf(k: number, lambda: number) { return Math.pow(lambda, k) * Math.exp(-lambda) / fact(k); }

export function goalExpectation(attack: number, defense: number, avg = 1.35) {
  return Math.max(0.3, attack * defense * avg);
}

export function poissonOutcomes(hLambda: number, aLambda: number, max = 8): Triple & { xgHome: number; xgAway: number } {
  let home = 0, draw = 0, away = 0;
  for (let h = 0; h <= max; h++) {
    for (let a = 0; a <= max; a++) {
      const p = pmf(h, hLambda) * pmf(a, aLambda);
      if (h > a) home += p; else if (h === a) draw += p; else away += p;
    }
  }
  return { home, draw, away, xgHome: hLambda, xgAway: aLambda };
}
