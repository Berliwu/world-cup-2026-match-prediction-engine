import chalk from "chalk";
import { OPENING_FIXTURES } from "../catalog/schedule.js";
import { nationById } from "../catalog/nations.js";
import { analyzeFixture } from "../engine/analyzeFixture.js";
import { simulateGroupTables } from "../engine/simulateGroups.js";
import { runMonteCarlo } from "../engine/monteCarloBracket.js";

const USAGE = `
${chalk.bold("WC2026 Statistical Match Engine")}
  analyze <fixtureId>   Run ensemble analysis on a fixture
  groups              Simulate group tables from opening fixtures
  montecarlo [n]      Monte Carlo champion probabilities
`;

export async function dispatch(argv: string[]) {
  const [cmd, arg] = argv;
  switch (cmd) {
    case "analyze": {
      const m = OPENING_FIXTURES.find((f) => f.id === arg);
      if (!m) { console.log(chalk.red(`Fixture ${arg} not found`)); return; }
      const r = analyzeFixture(m);
      const h = nationById(m.homeId)!;
      const a = nationById(m.awayId)!;
      console.log(chalk.cyan(`
${h.name} vs ${a.name}`));
      console.log(`  Home ${(r.outcomes.home * 100).toFixed(1)}%  Draw ${(r.outcomes.draw * 100).toFixed(1)}%  Away ${(r.outcomes.away * 100).toFixed(1)}%`);
      console.log(`  xG ${r.expectedGoals.home.toFixed(2)} - ${r.expectedGoals.away.toFixed(2)}`);
      break;
    }
    case "groups": {
      const tables = simulateGroupTables();
      for (const [g, rows] of Object.entries(tables)) {
        console.log(chalk.yellow(`
Group ${g}`));
        for (const r of rows) console.log(`  ${nationById(r.nationId)?.code ?? r.nationId}: ${r.points} pts`);
      }
      break;
    }
    case "montecarlo": {
      const n = Number(arg) || 500;
      const result = runMonteCarlo(n);
      console.log(chalk.green(`
Champion probabilities (${n} trials):`));
      for (const [id, p] of Object.entries(result).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${nationById(id)?.code ?? id}: ${(p * 100).toFixed(1)}%`);
      }
      break;
    }
    default:
      console.log(USAGE);
  }
}
