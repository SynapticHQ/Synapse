import { DefiAgent } from "./defi.js";
import { MarketAgent } from "./market.js";
import { ExecutorAgent } from "./executor.js";
import type { BaseAgent } from "./base.js";
import type { AgentDefinition, AgentId } from "../core/types.js";

export const AGENT_REGISTRY: Record<AgentId, AgentDefinition> = {
  "defi-agent": new DefiAgent().definition,
  "market-agent": new MarketAgent().definition,
  "executor": new ExecutorAgent().definition,
};

export function createAgent(id: AgentId): BaseAgent {
  switch (id) {
    case "defi-agent":
      return new DefiAgent();
    case "market-agent":
      return new MarketAgent();
    case "executor":
      return new ExecutorAgent();
  }
}