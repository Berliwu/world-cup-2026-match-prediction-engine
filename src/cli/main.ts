import { MatchEngine } from "../agent/predictionAgent.js";
import { getTeamById } from "../data/teams.js";
import { GROUP_FIXTURES } from "../data/fixtures.js";
import { findValueBets } from "../odds/valueBet.js";
import { logger } from "../utils/logger.js";
import { formatPercent } from "../utils/format.js";

const command = process.argv[2] ?? "help";

async function main(): Promise<void> {
  const agent = new MatchEngine(true);

  switch (command) {
    case "predict": {
      const matchId = process.argv[3];
      if (!matchId) {
        logger.warn("Usage: npm run run -- predict <matchId>");
        process.exit(1);
      }
      const pred = agent.predictMatch(matchId);
      const fixture = GROUP_FIXTURES.find((f) => f.id === matchId)!;
      const home = getTeamById(fixture.homeTeamId)!;
      const away = getTeamById(fixture.awayTeamId)!;
      logger.prediction(home.name, away.name, {
        home: pred.homeWinProb, draw: pred.drawProb, away: pred.awayWinProb,
      });
      logger.info(`Expected score: ${pred.expectedHomeGoals} - ${pred.expectedAwayGoals}`);
      logger.info(`Confidence: ${formatPercent(pred.confidence)}`);
      break;
    }
    case "standings": {
      const standings = agent.runTool("get_standings") as Record<string, unknown[]>;
      for (const [group, table] of Object.entries(standings)) {
        logger.info(`Group ${group}:`);
        for (const row of table as Array<{ teamId: string; points: number }>) {
          const team = getTeamById(row.teamId);
          console.log(`  ${team?.code ?? row.teamId}: ${row.points} pts`);
        }
      }
      break;
    }
    case "tournament": {
      const result = agent.runTool("predict_tournament");
      logger.success(`Predicted champion: ${(result as { championId: string }).championId}`);
      break;
    }
    case "value-bets": {
      const preds = agent.predictAllGroupMatches();
      const bets = await findValueBets(preds);
      if (bets.length === 0) logger.info("No pricing edges found.");
      for (const bet of bets) {
        logger.success(`${bet.matchId} ${bet.outcome}: edge ${formatPercent(bet.edge)}`);
      }
      break;
    }
    default:
      console.log("WC2026 Statistical Match Engine");
      console.log("Commands: predict, standings, tournament, value-bets");
  }
}

main().catch((err) => {
  logger.error(String(err));
  process.exit(1);
});
