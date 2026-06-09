export const ENGINE_PROFILES = {
  balanced: { elo: 0.35, poisson: 0.30, form: 0.20, squad: 0.15 },
  "host-advantage": { elo: 0.40, poisson: 0.25, form: 0.20, squad: 0.15 },
  "goals-model": { elo: 0.20, poisson: 0.45, form: 0.20, squad: 0.15 },
} as const;
