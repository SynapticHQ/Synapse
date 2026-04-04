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
      const actions = input["actions"] as Array<{ confidence: number; action: string; [k: string]: unknown }>;

      // Strip any actions below the configured confidence threshold before logging.
      // The executor may still surface LOW confidence actions in its text output —
      // this filter only affects what gets recorded as actionable in the result object.
      const { config } = await import("../core/config.js");
      const actionable = actions.filter((a) => a.confidence >= config.CONFIDENCE_THRESHOLD);

      if (actionable.length < actions.length) {
        const dropped = actions.length - actionable.length;
        // Log via console — logger not available in static context here
        console.warn(`[executor] dropped ${dropped} action(s) below confidence threshold ${config.CONFIDENCE_THRESHOLD}`);
      }

      return {
        received: true,
        actions: actionable,
        droppedLowConfidence: actions.length - actionable.length,
        assessment: input["market_assessment"],
      };
    }
    throw new Error(`Unknown tool: ${name}`);
  }
}

