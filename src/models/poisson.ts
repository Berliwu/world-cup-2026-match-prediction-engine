import { POISSON_MAX_GOALS } from "../constants.js";

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export function poissonPmf(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

export function scoreMatrix(
  homeLambda: number,
  awayLambda: number,
  maxGoals = POISSON_MAX_GOALS
): number[][] {
  const matrix: number[][] = [];
  for (let h = 0; h <= maxGoals; h++) {
    matrix[h] = [];
    for (let a = 0; a <= maxGoals; a++) {
      matrix[h][a] = poissonPmf(h, homeLambda) * poissonPmf(a, awayLambda);
    }
  }
  return matrix;
}

export function outcomeProbsFromMatrix(matrix: number[][]): {
  home: number;
  draw: number;
  away: number;
} {
  let home = 0, draw = 0, away = 0;
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      const p = matrix[h][a];
      if (h > a) home += p;
      else if (h === a) draw += p;
      else away += p;
    }
  }
  return { home, draw, away };
}

export function expectedGoals(attack: number, defense: number, leagueAvg = 1.35): number {
  return Math.max(0.3, attack * defense * leagueAvg);
}
