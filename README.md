# FIFA World Cup 2026 Prediction Agent

TypeScript agent that predicts FIFA World Cup 2026 match outcomes, group standings, and tournament winners using an ensemble of Elo, Poisson, and form-based models.

## Features

- **Match predictions** — win/draw/loss probabilities and expected goals
- **Group standings** — simulated points tables from predicted results
- **Tournament simulation** — projected champion and semifinalists
- **Pricing edge detection** — compare model vs market odds with Kelly sizing
- **Agent tools** — extensible tool-based prediction orchestration

## Quick Start

```bash
npm install
npm run run -- predict A1
npm run run -- standings
npm run run -- tournament
npm run run -- value-bets
npm test
```

## Models

| Model | Weight | Description |
|-------|--------|-------------|
| Elo | 35% | Rating-based win probability with home advantage |
| Poisson | 30% | Goal distribution from attack/defense strength |
| Form | 20% | Recent results momentum score |
| Squad | 15% | Squad market value strength (optional) |

## Project Structure

```
src/
├── agent/          # Match engine and tools
├── cli/            # Command-line interface
├── data/           # Teams, groups, venues, fixtures
├── models/         # Elo, Poisson, form, ensemble
├── odds/           # Market odds and pricing edges
├── predictions/    # Match and tournament predictors
├── types/          # TypeScript interfaces
└── utils/          # Kelly, EV, logging, formatting
```
