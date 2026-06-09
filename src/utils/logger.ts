import chalk from "chalk";

export const logger = {
  info: (msg: string) => console.log(chalk.blue("ℹ"), msg),
  success: (msg: string) => console.log(chalk.green("✓"), msg),
  warn: (msg: string) => console.log(chalk.yellow("⚠"), msg),
  error: (msg: string) => console.error(chalk.red("✗"), msg),
  prediction: (home: string, away: string, probs: { home: number; draw: number; away: number }) => {
    console.log(chalk.bold(`\n${home} vs ${away}`));
    console.log(`  Home: ${(probs.home * 100).toFixed(1)}%  Draw: ${(probs.draw * 100).toFixed(1)}%  Away: ${(probs.away * 100).toFixed(1)}%`);
  },
};
