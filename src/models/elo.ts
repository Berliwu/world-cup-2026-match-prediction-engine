import { ELO_HOME_ADVANTAGE, ELO_K_FACTOR } from "../constants.js";

export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function winDrawLossProbs(
  homeElo: number,
  awayElo: number,
  homeAdvantage = ELO_HOME_ADVANTAGE
): { home: number; draw: number; away: number } {
  const adjustedHome = homeElo + homeAdvantage;
  const homeWin = expectedScore(adjustedHome, awayElo);
  const awayWin = expectedScore(awayElo, adjustedHome);
  const draw = 1 - homeWin - awayWin;
  const drawClamped = Math.max(0.15, Math.min(0.35, draw));
  const remaining = 1 - drawClamped;
  const total = homeWin + awayWin;
  return {
    home: remaining * (homeWin / total),
    draw: drawClamped,
    away: remaining * (awayWin / total),
  };
}

export function updateElo(
  winnerElo: number,
  loserElo: number,
  isDraw: boolean,
  k = ELO_K_FACTOR
): { winnerNew: number; loserNew: number } {
  const expected = expectedScore(winnerElo, loserElo);
  const actual = isDraw ? 0.5 : 1;
  const delta = k * (actual - expected);
  return { winnerNew: winnerElo + delta, loserNew: loserElo - delta };
}
