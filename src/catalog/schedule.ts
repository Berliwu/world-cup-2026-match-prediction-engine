export interface ScheduledMatch {
  id: string;
  group: string;
  homeId: string;
  awayId: string;
  stadiumId: string;
  kickoff: string;
}

export const OPENING_FIXTURES: ScheduledMatch[] = [
  { id: "A1", group: "A", homeId: "usa", awayId: "sen", stadiumId: "metlife", kickoff: "2026-06-11T20:00:00Z" },
  { id: "A2", group: "A", homeId: "mex", awayId: "col", stadiumId: "azteca", kickoff: "2026-06-12T02:00:00Z" },
  { id: "B1", group: "B", homeId: "arg", awayId: "aus", stadiumId: "sofi", kickoff: "2026-06-13T00:00:00Z" },
  { id: "B2", group: "B", homeId: "bra", awayId: "jpn", stadiumId: "att", kickoff: "2026-06-13T20:00:00Z" },
  { id: "C1", group: "C", homeId: "fra", awayId: "can", stadiumId: "bmo", kickoff: "2026-06-14T18:00:00Z" },
  { id: "C2", group: "C", homeId: "mar", awayId: "kor", stadiumId: "metlife", kickoff: "2026-06-15T00:00:00Z" },
  { id: "D1", group: "D", homeId: "eng", awayId: "irn", stadiumId: "sofi", kickoff: "2026-06-15T20:00:00Z" },
  { id: "D2", group: "D", homeId: "ger", awayId: "uru", stadiumId: "att", kickoff: "2026-06-16T02:00:00Z" },
  { id: "E1", group: "E", homeId: "esp", awayId: "sui", stadiumId: "bbva", kickoff: "2026-06-16T20:00:00Z" },
  { id: "E2", group: "E", homeId: "por", awayId: "cro", stadiumId: "azteca", kickoff: "2026-06-17T02:00:00Z" },
  { id: "F1", group: "F", homeId: "ned", awayId: "den", stadiumId: "bmo", kickoff: "2026-06-17T20:00:00Z" },
  { id: "F2", group: "F", homeId: "bel", awayId: "ita", stadiumId: "metlife", kickoff: "2026-06-18T02:00:00Z" },
];
