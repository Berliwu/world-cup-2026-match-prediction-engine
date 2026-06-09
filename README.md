<img width="64" height="64" alt="zRSSLZa7bC9pfCYAf7-DxA_64x64" src="https://github.com/user-attachments/assets/052c1999-5888-4393-8354-23688a975fdd" />

# WC2026 Statistical Match Engine

Functional TypeScript pipeline for FIFA World Cup 2026 — no agent layer, pure `catalog → core → engine` flow.

## Architecture

```
src/
├── bin/engine.ts          CLI entry
├── catalog/               Nations, schedule, groups (static data)
├── core/                  Elo, Poisson, form, blending (pure functions)
├── engine/                analyzeFixture, simulateGroups, monteCarlo
├── domain/                Shared types
└── cli/router.ts          Command dispatch
```

## Commands

```bash
npm install
npm run engine -- analyze A1
npm run engine -- groups
npm run engine -- montecarlo 1000
npm test
```
