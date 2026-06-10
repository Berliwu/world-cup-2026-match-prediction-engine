<img width="450" height="450" alt="download" src="https://github.com/user-attachments/assets/f3e144a2-23b5-497a-b3a7-f607491fe402" />

# WC2026 Statistical Match Engine

Functional TypeScript pipeline for FIFA World Cup 2026 — `catalog → core → engine` router with optional club prediction via remote CSV history, pure statistical baseline, and AI analyst overlay.

## Features

- **Club prediction** — two team names in → win/draw/loss JSON out (`clubs` command)
- **Fixture analysis** — win/draw/loss probabilities and expected goals per match ID
- **Group simulation** — projected standings from opening fixtures
- **Monte Carlo bracket** — champion and semifinalist frequency over N trials
- **Pure statistical core** — `core/` math modules with no side effects
- **AI analyst overlay** — bounded nudges on top of baseline (not probability fusion)
- **Redis cache** — optional caching for analysis and simulation results

## Quick start

**Requirements:** Node.js 20+

```bash
npm install
cp .env.example .env   # set OPENAI_API_KEY for AI overlay
npm test
npm run engine -- clubs Arsenal Chelsea
npm run engine -- analyze A1
npm run engine -- groups
npm run engine -- montecarlo 1000
```

## Architecture

```
world-cup-2026-match-prediction-engine/
├── src/
│   ├── bin/engine.ts           CLI entry
│   ├── cli/router.ts           Command dispatch (clubs / analyze / groups / montecarlo)
│   ├── catalog/                Nations, schedule, groups (static WC2026 data)
│   ├── data/clubHistory.ts     Remote CSV loader + club context builder
│   ├── core/                   Elo, Poisson, form, blending, clubBaseline
│   ├── ai/analystOverlay.ts    LLM nudge overlay (not fusion)
│   ├── engine/                 analyzeFixture, simulateGroups, predictClubs
│   ├── domain/                 Shared types
│   └── utils/                  Redis client + cache helpers
└── tests/                      Vitest suite
```

| Layer | Role |
|-------|------|
| `catalog/` | Static nation ratings, fixtures, group assignments |
| `data/` | Remote club match history (georgedouzas/sports-betting CSVs) |
| `core/` | Rating math, goal models, form weighting, club baseline |
| `ai/` | Analyst overlay — bounded additive nudges + reasoning |
| `engine/` | Orchestration: WC fixtures, groups, MC bracket, club pipeline |
| `cli/` | Router dispatch and formatted output |

### Club pipeline vs other projects

| Project | Pattern |
|---------|---------|
| **This engine** | Router → data → statistical core → AI **overlay** (nudges on anchor) |
| sports-betting-toolbox | CLI toolbox → single `predictMatch` (AI **or** statistical) |
| world-cup-2026-ai-hybrid-predictor | Forecast pipeline → statistical prior **fused** with LLM output |

## CLI reference

| Command | Description |
|---------|-------------|
| `clubs <home> <away>` | Club match prediction with stat baseline + AI overlay |
| `clubs <home> <away> --no-ai` | Statistical baseline only (no API key) |
| `analyze <fixtureId>` | Full ensemble breakdown for one match (e.g. `A1`) |
| `groups` | Simulate points tables for all opening groups |
| `montecarlo [n]` | Run `n` bracket simulations (default 1000) |
| `redis ping` | Test Redis connectivity |
| `redis flush` | Clear `wc2026-engine:*` cache keys |

### Examples

```bash
npm run engine -- clubs Arsenal Chelsea
npm run engine -- clubs Arsenal Chelsea --no-ai
npm run engine -- clubs Arsenal Chelsea --league England --division 1 --year 2020
npm run engine -- analyze A1
npm run engine -- analyze A1 --no-cache
npm run engine -- groups
npm run engine -- montecarlo 5000
npm run engine -- redis ping
```

### Club output (JSON)

```json
{
  "match": "Arsenal vs Chelsea",
  "homeWin": 0.412,
  "draw": 0.268,
  "awayWin": 0.32,
  "confidence": 0.71,
  "reasoning": "Home side stronger on recent xG...",
  "model": "statistical+overlay",
  "resolvedTeams": { "home": "Arsenal", "away": "Chelsea" },
  "baseline": { "homeWin": 0.39, "draw": 0.27, "awayWin": 0.34, "confidence": 0.74, "expectedGoals": { "home": 1.62, "away": 1.18 } }
}
```

## Library usage

```typescript
import { predictClubs } from "./src/engine/predictClubs.js";
import { analyzeFixture } from "./src/engine/analyzeFixture.js";

const club = await predictClubs("Arsenal", "Chelsea", { useAi: false });
console.log(club.homeWin, club.draw, club.awayWin);

const analysis = analyzeFixture("A1");
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Required for `clubs` with AI overlay |
| `OPENAI_MODEL` | Defaults to `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Optional compatible API gateway |
| `CLUB_LEAGUE` / `CLUB_DIVISION` / `CLUB_YEAR` | Remote CSV defaults |
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

Club baseline uses Poisson xG + record form via `weightedMixer` (see `core/clubBaseline.ts`).
