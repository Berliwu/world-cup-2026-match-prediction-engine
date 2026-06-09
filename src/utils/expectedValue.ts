export function expectedValue(modelProb: number, decimalOdds: number): number {
  return modelProb * (decimalOdds - 1) - (1 - modelProb);
}

export function impliedProbability(decimalOdds: number): number {
  return 1 / decimalOdds;
}

export function calculateEdge(modelProb: number, marketProb: number): number {
  return Math.round((modelProb - marketProb) * 1000) / 1000;
}
