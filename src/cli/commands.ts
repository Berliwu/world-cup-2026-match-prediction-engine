export const COMMANDS = {
  predict: { description: "Predict a single match by ID", usage: "predict <matchId>" },
  standings: { description: "Show projected group standings", usage: "standings" },
  tournament: { description: "Simulate tournament and predict champion", usage: "tournament" },
  "value-bets": { description: "Find pricing edges vs market odds", usage: "value-bets" },
  help: { description: "Show available commands", usage: "help" },
} as const;

export function printHelp(): void {
  console.log("\nAvailable commands:\n");
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`  ${cmd.usage.padEnd(25)} ${cmd.description}`);
  }
  console.log();
}
