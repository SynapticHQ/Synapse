import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.js";
import { createLogger } from "./logger.js";
import type { AgentId, RoutingDecision } from "./types.js";
import { AGENT_REGISTRY } from "../agents/base.js";

const log = createLogger("Router");

const ROUTING_TOOL: Anthropic.Tool = {
  name: "dispatch_agents",
  description: "Select which agents should handle this task and explain why.",
  input_schema: {
    type: "object" as const,
    properties: {
      selected_agents: {
        type: "array",
        items: { type: "string", enum: ["defi-agent", "market-agent", "executor"] },
        description: "Agent IDs to dispatch",
      },
      reasoning: {
        type: "string",
        description: "Why these agents were selected",
      },
      confidence: {
        type: "number",
        description: "Confidence in this routing decision (0–1)",
      },
    },
    required: ["selected_agents", "reasoning", "confidence"],
  },
};

const ROUTER_SYSTEM = `You are the routing layer of a multi-agent orchestration system.

Available agents:
${Object.values(AGENT_REGISTRY)
  .map((a) => `- ${a.id}: ${a.description}\n  Capabilities: ${a.capabilities.join(", ")}`)
  .join("\n")}

Your job: given a task, select the minimum set of agents needed to fulfill it.
- For market data only: defi-agent alone
- For analysis only: market-agent alone
- For execution decisions: executor (always needs defi-agent context first)
- For complex tasks: combine as needed, but prefer fewer agents`;

export class TaskRouter {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
  }

  async route(taskId: string, prompt: string): Promise<RoutingDecision> {
    log.info("Routing task", { taskId, prompt: prompt.slice(0, 80) });

    const response = await this.client.messages.create({
      model: config.CLAUDE_MODEL,
      max_tokens: 512,
      system: ROUTER_SYSTEM,
      tools: [ROUTING_TOOL],
      tool_choice: { type: "any" },
      messages: [{ role: "user", content: `Route this task: ${prompt}` }],
    });

    const toolBlock = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (!toolBlock) {
      log.warn("Router returned no tool call — defaulting to all agents");
      return {
        taskId,
        selectedAgents: ["defi-agent", "market-agent", "executor"],
        reasoning: "Fallback: router did not return a dispatch decision",
        confidence: 0.5,
      };
    }

    const input = toolBlock.input as {
      selected_agents: AgentId[];
      reasoning: string;
      confidence: number;
    };

    log.info("Routing decision", {
      agents: input.selected_agents,
      confidence: input.confidence,
    });

    return {
      taskId,
      selectedAgents: input.selected_agents,
      reasoning: input.reasoning,
      confidence: input.confidence,
    };
  }
}
