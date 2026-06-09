export const WC2026_HOSTS = ["USA", "MEX", "CAN"] as const;
export const GROUP_COUNT = 12;
export const TEAMS_PER_GROUP = 4;
export const TOTAL_TEAMS = 48;
export const KNOCKOUT_START_TEAMS = 32;

export const ELO_HOME_ADVANTAGE = 65;
export const ELO_K_FACTOR = 32;
export const POISSON_MAX_GOALS = 8;

export const MODEL_WEIGHTS = {
  elo: 0.35,
  poisson: 0.30,
  form: 0.20,
  squad: 0.15,
} as const;
