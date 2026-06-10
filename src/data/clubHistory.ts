import { parse } from "csv-parse/sync";

export const CLUB_HISTORY_URL =
  "https://raw.githubusercontent.com/georgedouzas/sports-betting/data/data/soccer/modelling/{league}_{division}_{year}.csv";

export interface ClubRow {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
}

export interface TeamRecord {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface HeadToHeadRecord {
  played: number;
  homeWins: number;
  draws: number;
  awayWins: number;
}

export interface ClubMatchContext {
  homeTeam: string;
  awayTeam: string;
  resolvedHome: string | null;
  resolvedAway: string | null;
  homeRecord: TeamRecord;
  awayRecord: TeamRecord;
  headToHead: HeadToHeadRecord;
  leagueDrawRate: number;
}

export interface LoadClubHistoryOptions {
  league?: string;
  division?: number;
  year?: number;
  useCache?: boolean;
}

let cachedRows: ClubRow[] | null = null;
let cachedKey = "";

function historyUrl(opts: LoadClubHistoryOptions): string {
  const league = opts.league ?? "England";
  const division = String(opts.division ?? 1);
  const year = String(opts.year ?? 2020);
  return CLUB_HISTORY_URL.replace("{league}", league)
    .replace("{division}", division)
    .replace("{year}", year);
}

function normalizeTeam(name: string): string {
  return name.trim().toLowerCase();
}

export function teamsMatch(a: string, b: string): boolean {
  const left = normalizeTeam(a);
  const right = normalizeTeam(b);
  return left === right || left.includes(right) || right.includes(left);
}

function emptyRecord(): TeamRecord {
  return { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
}

function emptyH2H(): HeadToHeadRecord {
  return { played: 0, homeWins: 0, draws: 0, awayWins: 0 };
}

function resolveTeamName(query: string, candidates: string[]): string | null {
  const exact = candidates.find((c) => normalizeTeam(c) === normalizeTeam(query));
  if (exact) return exact;
  return candidates.find((c) => teamsMatch(c, query)) ?? null;
}

function parseRows(text: string): ClubRow[] {
  const records = parse(text, { columns: true, skip_empty_lines: true, trim: true }) as Record<
    string,
    string
  >[];
  const rows: ClubRow[] = [];
  for (const row of records) {
    const homeTeam = row.home_team?.trim();
    const awayTeam = row.away_team?.trim();
    const homeGoals = Number(row.target__home_team__full_time_goals);
    const awayGoals = Number(row.target__away_team__full_time_goals);
    if (!homeTeam || !awayTeam || Number.isNaN(homeGoals) || Number.isNaN(awayGoals)) continue;
    rows.push({ homeTeam, awayTeam, homeGoals, awayGoals });
  }
  return rows;
}

/** Download club match history from the sports-betting data repository. */
export async function loadClubHistory(options: LoadClubHistoryOptions = {}): Promise<ClubRow[]> {
  const key = historyUrl(options);
  if (options.useCache !== false && cachedRows && cachedKey === key) return cachedRows;

  const response = await fetch(key);
  if (!response.ok) {
    throw new Error(`Failed to fetch club history (${response.status}): ${key}`);
  }

  const rows = parseRows(await response.text());
  if (rows.length === 0) {
    throw new Error(`No club history rows parsed from ${key}`);
  }

  if (options.useCache !== false) {
    cachedRows = rows;
    cachedKey = key;
  }
  return rows;
}

function addResult(record: TeamRecord, result: "win" | "draw" | "loss", gf: number, ga: number): void {
  record.played += 1;
  record.goalsFor += gf;
  record.goalsAgainst += ga;
  if (result === "win") record.wins += 1;
  else if (result === "draw") record.draws += 1;
  else record.losses += 1;
}

function outcome(hg: number, ag: number): "home" | "draw" | "away" {
  if (hg > ag) return "home";
  if (hg < ag) return "away";
  return "draw";
}

/** Build club form and head-to-head stats from historical rows. */
export function buildClubContext(homeTeam: string, awayTeam: string, rows: ClubRow[]): ClubMatchContext {
  const allTeams = [...new Set(rows.flatMap((r) => [r.homeTeam, r.awayTeam]))];
  const resolvedHome = resolveTeamName(homeTeam, allTeams);
  const resolvedAway = resolveTeamName(awayTeam, allTeams);

  const homeRecord = emptyRecord();
  const awayRecord = emptyRecord();
  const headToHead = emptyH2H();
  let draws = 0;
  let finished = 0;

  for (const row of rows) {
    const result = outcome(row.homeGoals, row.awayGoals);
    finished += 1;
    if (result === "draw") draws += 1;

    if (resolvedHome && teamsMatch(row.homeTeam, resolvedHome)) {
      addResult(
        homeRecord,
        result === "home" ? "win" : result === "draw" ? "draw" : "loss",
        row.homeGoals,
        row.awayGoals,
      );
    }
    if (resolvedAway && teamsMatch(row.awayTeam, resolvedAway)) {
      addResult(
        awayRecord,
        result === "away" ? "win" : result === "draw" ? "draw" : "loss",
        row.awayGoals,
        row.homeGoals,
      );
    }
    if (
      resolvedHome &&
      resolvedAway &&
      teamsMatch(row.homeTeam, resolvedHome) &&
      teamsMatch(row.awayTeam, resolvedAway)
    ) {
      headToHead.played += 1;
      if (result === "home") headToHead.homeWins += 1;
      else if (result === "draw") headToHead.draws += 1;
      else headToHead.awayWins += 1;
    }
  }

  return {
    homeTeam,
    awayTeam,
    resolvedHome,
    resolvedAway,
    homeRecord,
    awayRecord,
    headToHead,
    leagueDrawRate: finished > 0 ? draws / finished : 0.25,
  };
}

/** Reset in-memory cache (for tests). */
export function resetClubHistoryCache(): void {
  cachedRows = null;
  cachedKey = "";
}
