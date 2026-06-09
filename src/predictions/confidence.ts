export function calculateConfidence(
  modelAgreement: number,
  dataQuality: number,
  sampleSize: number
): number {
  const sampleFactor = Math.min(1, sampleSize / 10);
  const raw = 0.5 * modelAgreement + 0.3 * dataQuality + 0.2 * sampleFactor;
  return Math.round(Math.min(0.95, Math.max(0.1, raw)) * 100) / 100;
}

export function modelAgreement(probs: number[][]): number {
  if (probs.length < 2) return 0.5;
  const outcomes = ["home", "draw", "away"] as const;
  let agreement = 0;
  for (let i = 0; i < 3; i++) {
    const values = probs.map((p) => p[i]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
    agreement += 1 - Math.min(1, variance * 10);
  }
  return agreement / 3;
}
