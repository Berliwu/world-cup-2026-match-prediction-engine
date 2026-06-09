import type { SquadPlayer } from "../types/team.js";

export function squadMarketValue(players: SquadPlayer[]): number {
  return players.reduce((sum, p) => sum + p.marketValue, 0);
}

export function squadStrengthScore(players: SquadPlayer[]): number {
  if (players.length === 0) return 0.5;
  const total = squadMarketValue(players);
  const avg = total / players.length;
  const normalized = Math.min(1, avg / 50_000_000);
  return 0.3 + normalized * 0.7;
}

export function squadWinBias(homeValue: number, awayValue: number): {
  home: number; draw: number; away: number;
} {
  const total = homeValue + awayValue || 1;
  const homeShare = homeValue / total;
  return {
    home: homeShare * 0.7 + 0.1,
    away: (1 - homeShare) * 0.7 + 0.1,
    draw: 0.2,
  };
}
