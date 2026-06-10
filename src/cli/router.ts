import chalk from "chalk";
import { logger } from "../utils/logger.js";
import { OPENING_FIXTURES } from "../catalog/schedule.js";
import { nationById } from "../catalog/nations.js";
import { analyzeFixture } from "../engine/analyzeFixture.js";
import { simulateGroupTables } from "../engine/simulateGroups.js";
import { runMonteCarlo } from "../engine/monteCarloBracket.js";
import { predictClubs } from "../engine/predictClubs.js";
import { analystSetupInstructions, isAnalystAvailable } from "../ai/analystOverlay.js";
import { cacheFlushNamespace, cacheGet, cacheSet } from "../utils/redisCache.js";
import { isRedisEnabled, pingRedis } from "../utils/redis.js";
import type { FixtureAnalysis } from "../domain/types.js";

const USAGE = `
${chalk.bold("WC2026 Statistical Match Engine")}
  clubs <home> <away>  Club match prediction (stat core + AI overlay)
  analyze <fixtureId>   Run ensemble analysis on a fixture
  groups              Simulate group tables from opening fixtures
  montecarlo [n]      Monte Carlo champion probabilities
  redis ping          Check Redis connection
  redis flush         Clear wc2026-engine:* cache keys
`;

function parseClubsArgs(argv: string[]): {
  home: string;
  away: string;
  useAi: boolean;
  league?: string;
  division?: number;
  year?: number;
} {
  const filtered = argv.filter((a) => a !== "--no-ai");
  const useAi = !argv.includes("--no-ai");
  const leagueIdx = filtered.indexOf("--league");
  const divisionIdx = filtered.indexOf("--division");
  const yearIdx = filtered.indexOf("--year");
  const positional = filtered.filter(
    (a, i) =>
      a !== "clubs" &&
      !a.startsWith("--") &&
      i !== leagueIdx + 1 &&
      i !== divisionIdx + 1 &&
      i !== yearIdx + 1,
  );
  if (positional.length < 2) {
    throw new Error("Usage: npm run engine -- clubs <home> <away> [--no-ai] [--league England] [--division 1] [--year 2020]");
  }
  return {
    home: positional[0]!,
    away: positional[1]!,
    useAi,
    league: leagueIdx >= 0 ? filtered[leagueIdx + 1] : undefined,
    division: divisionIdx >= 0 ? Number(filtered[divisionIdx + 1]) : undefined,
    year: yearIdx >= 0 ? Number(filtered[yearIdx + 1]) : undefined,
  };
}

export async function dispatch(argv: string[]) {
  const useCache = !argv.includes("--no-cache");
  const [cmd, arg] = argv.filter((a) => a !== "--no-cache");

  if (cmd === "redis" && arg === "ping") {
    if (!isRedisEnabled()) {
      logger.info(chalk.yellow("Redis disabled. Set REDIS_URL or REDIS_HOST."));
      return;
    }
    logger.info((await pingRedis()) ? chalk.green("Redis PONG") : chalk.red("Redis unreachable"));
    return;
  }

  if (cmd === "redis" && arg === "flush") {
    const n = await cacheFlushNamespace();
    logger.info(chalk.green(`Flushed ${n} Redis key(s)`));
    return;
  }

  switch (cmd) {
    case "clubs": {
      const { home, away, useAi, league, division, year } = parseClubsArgs(argv);
      if (useAi && !isAnalystAvailable()) {
        logger.info(chalk.red(analystSetupInstructions()));
        return;
      }
      const result = await predictClubs(home, away, { useAi, league, division, year });
      console.log(
        JSON.stringify(
          {
            match: `${result.homeTeam} vs ${result.awayTeam}`,
            homeWin: result.homeWin,
            draw: result.draw,
            awayWin: result.awayWin,
            confidence: result.confidence,
            reasoning: result.reasoning,
            model: result.model,
            resolvedTeams: {
              home: result.resolvedHome,
              away: result.resolvedAway,
            },
            baseline: result.baseline,
          },
          null,
          2,
        ),
      );
      break;
    }
    case "analyze": {
      const m = OPENING_FIXTURES.find((f) => f.id === arg);
      if (!m) { logger.info(chalk.red(`Fixture ${arg} not found`)); return; }
      const cacheKey = `analyze:${arg}`;
      let r: FixtureAnalysis | null = useCache ? await cacheGet<FixtureAnalysis>(cacheKey) : null;
      if (!r) {
        r = analyzeFixture(m);
        if (useCache) await cacheSet(cacheKey, r);
      } else {
        logger.info(chalk.cyan("(cached)"));
      }
      const h = nationById(m.homeId)!;
      const a = nationById(m.awayId)!;
      logger.info(chalk.cyan(`\n${h.name} vs ${a.name}`));
      logger.info(`  Home ${(r.outcomes.home * 100).toFixed(1)}%  Draw ${(r.outcomes.draw * 100).toFixed(1)}%  Away ${(r.outcomes.away * 100).toFixed(1)}%`);
      logger.info(`  xG ${r.expectedGoals.home.toFixed(2)} - ${r.expectedGoals.away.toFixed(2)}`);
      break;
    }
    case "groups": {
      const cacheKey = "groups:opening";
      let tables = useCache ? await cacheGet<ReturnType<typeof simulateGroupTables>>(cacheKey) : null;
      if (!tables) {
        tables = simulateGroupTables();
        if (useCache) await cacheSet(cacheKey, tables);
      } else {
        logger.info(chalk.cyan("(cached)"));
      }
      for (const [g, rows] of Object.entries(tables)) {
        logger.info(chalk.yellow(`\nGroup ${g}`));
        for (const row of rows) logger.info(`  ${nationById(row.nationId)?.code ?? row.nationId}: ${row.points} pts`);
      }
      break;
    }
    case "montecarlo": {
      const n = Number(arg) || 500;
      const cacheKey = `montecarlo:${n}`;
      let result = useCache ? await cacheGet<Record<string, number>>(cacheKey) : null;
      if (!result) {
        result = runMonteCarlo(n);
        if (useCache) await cacheSet(cacheKey, result);
      } else {
        logger.info(chalk.cyan("(cached)"));
      }
      logger.info(chalk.green(`\nChampion probabilities (${n} trials):`));
      for (const [id, p] of Object.entries(result).sort((a, b) => b[1] - a[1])) {
        logger.info(`  ${nationById(id)?.code ?? id}: ${(p * 100).toFixed(1)}%`);
      }
      break;
    }
    default:
      logger.info(USAGE);
  }
}
