import type { MatchPrediction, TournamentPrediction } from "../types/prediction.js";
import type { MatchFixture } from "../types/match.js";

export interface AgentMemory {
  predictions: Map<string, MatchPrediction>;
  lastTournament: TournamentPrediction | null;
  queries: string[];
}

export interface AgentContext {
  memory: AgentMemory;
  fixtures: MatchFixture[];
  verbose: boolean;
}

export function createAgentContext(fixtures: MatchFixture[], verbose = false): AgentContext {
  return {
    memory: { predictions: new Map(), lastTournament: null, queries: [] },
    fixtures,
    verbose,
  };
}
