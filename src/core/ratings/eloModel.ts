const HOME_EDGE = 65;

export function eloOutcomeProb(homeElo: number, awayElo: number, hostBoost = HOME_EDGE): OutcomeTriple {
  type OutcomeTriple = { home: number; draw: number; away: number };
  const adj = homeElo + hostBoost;
  const pHome = 1 / (1 + Math.pow(10, (awayElo - adj) / 400));
  const pAway = 1 / (1 + Math.pow(10, (adj - awayElo) / 400));
  const draw = Math.max(0.15, Math.min(0.35, 1 - pHome - pAway));
  const rem = 1 - draw;
  const t = pHome + pAway || 1;
  return { home: rem * pHome / t, draw, away: rem * pAway / t };
}

export function applyEloUpdate(winner: number, loser: number, draw: boolean, k = 32) {
  const exp = 1 / (1 + Math.pow(10, (loser - winner) / 400));
  const delta = k * ((draw ? 0.5 : 1) - exp);
  return { winner: winner + delta, loser: loser - delta };
}
