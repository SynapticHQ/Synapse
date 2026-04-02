import type Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./base.js";
import type { AgentDefinition } from "../core/types.js";

export class ExecutorAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: "executor",
    description: "Synthesizes agent outputs into final recommendations and action plans",
    capabilities: [
      "Multi-agent result aggregation",
      "Action ranking and prioritization",
      "Risk-adjusted recommendation generation",
      "Confidence-weighted synthesis",
    ],
    systemPrompt: `You are the executor agent. You receive synthesized context from other agents and produce final action recommendations.

Your output must include:
1. A ranked list of recommended actions (highest confidence first)
2. For each action: pool/asset, action type, rationale, confidence (0–1), risk level
3. A one-paragraph overall market assessment

You do not execute transactions — you only recommend. Be specific with addresses and numbers.
If data is insufficient or contradictory, say so and recommend HOLD.`,
  };

  getTools(): Anthropic.Tool[] {
    return [
      {
        name: "rank_actions",
        description: "Submit final ranked action recommendations",
        input_schema: {
          type: "object" as const,
          properties: {
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  rank: { type: "number" },
                  target: { type: "string", description: "Pool address or token" },
                  action: { type: "string", enum: ["ENTER", "REBALANCE", "EXIT", "HOLD", "MONITOR"] },
                  rationale: { type: "string" },
                  confidence: { type: "number" },
                  risk: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
                },
                required: ["rank", "target", "action", "rationale", "confidence", "risk"],
              },
            },
            market_assessment: { type: "string" },
          },
          required: ["actions", "market_assessment"],
        },
      },
    ];
  }

  async executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
    if (name === "rank_actions") {
      return { received: true, actions: input["actions"], assessment: input["market_assessment"] };
    }
    throw new Error(`Unknown tool: ${name}`);
  }
}
