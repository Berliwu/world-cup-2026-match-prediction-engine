import { GROUP_FIXTURES } from "../data/fixtures.js";
import { createAgentContext, type AgentContext } from "./agentContext.js";
import { executeTool, type ToolName } from "./agentTools.js";
import type { MatchPrediction } from "../types/prediction.js";

export class MatchEngine {
  private ctx: AgentContext;

  constructor(verbose = false) {
    this.ctx = createAgentContext(GROUP_FIXTURES, verbose);
  }

  predictMatch(matchId: string): MatchPrediction {
    return executeTool(this.ctx, "predict_match", { matchId }) as MatchPrediction;
  }

  predictAllGroupMatches(): MatchPrediction[] {
    return GROUP_FIXTURES.map((f) => this.predictMatch(f.id));
  }

  runTool(tool: ToolName, args: Record<string, string> = {}): unknown {
    return executeTool(this.ctx, tool, args);
  }

  getContext(): AgentContext {
    return this.ctx;
  }
}
