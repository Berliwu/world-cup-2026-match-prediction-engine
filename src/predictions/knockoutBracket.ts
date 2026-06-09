export interface KnockoutMatch {
  id: string;
  round: string;
  homeSlot: string;
  awaySlot: string;
  winnerSlot?: string;
}

export function buildRoundOf32Bracket(groupWinners: Record<string, string>): KnockoutMatch[] {
  const groups = Object.keys(groupWinners).sort();
  const matches: KnockoutMatch[] = [];
  for (let i = 0; i < groups.length; i += 2) {
    if (i + 1 < groups.length) {
      matches.push({
        id: `R32-${i / 2 + 1}`,
        round: "round-of-32",
        homeSlot: `1${groups[i]}`,
        awaySlot: `2${groups[i + 1]}`,
        winnerSlot: `R16-${i / 2 + 1}`,
      });
    }
  }
  return matches;
}
