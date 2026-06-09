# WC2026 Statistical Match Engine

Functional TypeScript pipeline for FIFA World Cup 2026 — pure `catalog → core → engine` flow with no agent layer. Blends Elo, Poisson, and form signals to analyze fixtures, simulate groups, and run Monte Carlo bracket outcomes.

## Features

- **Fixture analysis** — win/draw/loss probabilities and expected goals per match ID
- **Group simulation** — projected standings from opening fixtures
- **Monte Carlo bracket** — champion and semifinalist frequency over N trials
- **Pure functions** — `core/` math modules with no side effects
- **Redis cache** — optional caching for analysis and simulation results

## Quick start

**Requirements:** Node.js 20+

```bash
npm install
npm test
npm run engine -- analyze A1
npm run engine -- groups
npm run engine -- montecarlo 1000
```

## Architecture

```
world-cup-2026-match-prediction-engine/
├── src/
│   ├── bin/engine.ts           CLI entry
│   ├── cli/router.ts           Command dispatch (analyze / groups / montecarlo)
│   ├── catalog/                Nations, schedule, groups (static WC2026 data)
│   ├── core/                   Elo, Poisson, form, blending (pure functions)
│   ├── engine/                 analyzeFixture, simulateGroups, monteCarloBracket
│   ├── domain/                 Shared types (FixtureAnalysis, etc.)
│   └── utils/                  Redis client + cache helpers
└── tests/                      Vitest suite
```

| Layer | Role |
|-------|------|
| `catalog/` | Static nation ratings, fixtures, group assignments |
| `core/` | Rating math, goal models, form weighting |
| `engine/` | Orchestration: single fixture, group tables, tournament MC |
| `cli/` | Argument parsing and formatted output |

## CLI reference

| Command | Description |
|---------|-------------|
| `analyze <fixtureId>` | Full ensemble breakdown for one match (e.g. `A1`) |
| `groups` | Simulate points tables for all opening groups |
| `montecarlo [n]` | Run `n` bracket simulations (default 1000) |
| `redis ping` | Test Redis connectivity |
| `redis flush` | Clear `wc2026-engine:*` cache keys |

### Examples

```bash
npm run engine -- analyze A1
npm run engine -- analyze A1 --no-cache
npm run engine -- groups
npm run engine -- montecarlo 5000
npm run engine -- redis ping
```

## Library usage

```typescript
import { analyzeFixture } from "./src/engine/analyzeFixture.js";
import { simulateGroupTables } from "./src/engine/simulateGroups.js";
import { runMonteCarlo } from "./src/engine/monteCarloBracket.js";

const analysis = analyzeFixture("A1");
console.log(analysis.homeWin, analysis.draw, analysis.awayWin);

const tables = simulateGroupTables();
const mc = runMonteCarlo(1000);
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `REDIS_URL` / `REDIS_HOST` | Optional Redis for caching analyses |
| `REDIS_KEY_PREFIX` | Defaults to engine-specific prefix |
| `REDIS_ENABLED` | Set `false` for memory-only mode |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run engine` | CLI |
| `npm run typecheck` | Strict TypeScript |
| `npm test` | Vitest |

## Models (balanced blend)

| Signal | Weight | Source |
|--------|--------|--------|
| Elo | 35% | Nation rating + home advantage |
| Poisson | 30% | Attack/defense goal rates |
| Form | 20% | Recent results momentum |
| Squad | 15% | Market-value strength |
