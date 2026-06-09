export interface ShotData {
  shots: number;
  shotsOnTarget: number;
  bigChances: number;
}

export function estimateXG(data: ShotData): number {
  const onTargetRate = data.shots > 0 ? data.shotsOnTarget / data.shots : 0;
  const base = data.shotsOnTarget * 0.32;
  const bonus = data.bigChances * 0.15;
  const quality = 0.8 + onTargetRate * 0.4;
  return Math.round((base + bonus) * quality * 100) / 100;
}

export function xgDifference(home: ShotData, away: ShotData): number {
  return estimateXG(home) - estimateXG(away);
}
