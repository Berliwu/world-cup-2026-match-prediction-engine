export interface ResultLine { opponentId: string; goalsFor: number; goalsAgainst: number; }

const FORM_DB: Record<string, ResultLine[]> = {
  arg: [{ opponentId: "bra", goalsFor: 2, goalsAgainst: 0 }, { opponentId: "uru", goalsFor: 1, goalsAgainst: 1 }],
  bra: [{ opponentId: "arg", goalsFor: 0, goalsAgainst: 2 }, { opponentId: "col", goalsFor: 2, goalsAgainst: 1 }],
  usa: [{ opponentId: "mex", goalsFor: 2, goalsAgainst: 2 }, { opponentId: "can", goalsFor: 1, goalsAgainst: 0 }],
};

export const recentForm = (nationId: string) => FORM_DB[nationId] ?? [];

export function momentumScore(lines: ResultLine[]): number {
  if (!lines.length) return 0.5;
  let pts = 0;
  for (const l of lines) {
    if (l.goalsFor > l.goalsAgainst) pts += 3;
    else if (l.goalsFor === l.goalsAgainst) pts += 1;
  }
  return pts / (lines.length * 3);
}

export function attackDefense(lines: ResultLine[]) {
  if (!lines.length) return { attack: 1, defense: 1 };
  const gf = lines.reduce((s, l) => s + l.goalsFor, 0) / lines.length;
  const ga = lines.reduce((s, l) => s + l.goalsAgainst, 0) / lines.length;
  return { attack: Math.max(0.5, gf / 1.35), defense: Math.max(0.5, 1.35 / Math.max(0.5, ga)) };
}
