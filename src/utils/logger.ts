import chalk from "chalk";

const stamp = () => new Date().toISOString();

export const logger = {
  info(message: string): void {
    console.log(chalk.green(`[${stamp()}] INFO `) + message);
  },
};
