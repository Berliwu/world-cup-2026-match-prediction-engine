export interface GroupAssignment {
  group: string;
  teamIds: string[];
}

export const GROUPS: GroupAssignment[] = [
  { group: "A", teamIds: ["usa", "mex", "col", "sen"] },
  { group: "B", teamIds: ["arg", "bra", "jpn", "aus"] },
  { group: "C", teamIds: ["fra", "mar", "kor", "can"] },
  { group: "D", teamIds: ["eng", "ger", "uru", "irn"] },
  { group: "E", teamIds: ["esp", "por", "cro", "sui"] },
  { group: "F", teamIds: ["ned", "bel", "ita", "den"] },
];

export function getGroupForTeam(teamId: string): string | undefined {
  return GROUPS.find((g) => g.teamIds.includes(teamId))?.group;
}
