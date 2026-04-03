import Anthropic from "@anthropic-ai/sdk";
import { config } from "../core/config.js";
import { createLogger } from "../core/logger.js";
import type { AgentDefinition, AgentId, AgentResult } from "../core/types.js";

export { AgentDefinition };

export abstract class BaseAgent {
  protected client: Anthropic;
  protected log;
  abstract readonly definition: AgentDefinition;

  constructor() {
    this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    this.log = createLogger(this.constructor.name);
  }

  abstract getTools(): Anthropic.Tool[];
  abstract executeTool(name: string, input: Record<string, unknown>): Promise<unknown>;

  async run(taskId: string, prompt: string, sharedContext: string): Promise<AgentResult> {
    const start = Date.now();
    this.log.info("Agent starting", { taskId });

    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: `${sharedContext}\n\n---\n\nTask: ${prompt}`,
      },
    ];

    let output = "";
    let toolCallCount = 0;

    agentLoop: while (true) {
      const response = await this.client.messages.create({
        model: config.CLAUDE_MODEL,
        max_tokens: config.MAX_AGENT_TOKENS,
        system: this.definition.systemPrompt,
        tools: this.getTools(),
        messages,
      });

      if (response.stop_reason === "end_turn") {
        const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
        output = textBlock?.text ?? "";
        break agentLoop;
      }

      if (response.stop_reason === "tool_use") {
        const toolBlocks = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
        );

        const results: Anthropic.ToolResultBlockParam[] = [];

        for (const tb of toolBlocks) {
          toolCallCount++;
          try {
            const result = await this.executeTool(tb.name, tb.input as Record<string, unknown>);
            results.push({
              type: "tool_result",
              tool_use_id: tb.id,
              content: JSON.stringify(result),
            });
          } catch (err) {
            results.push({
              type: "tool_result",
              tool_use_id: tb.id,
              content: `Error: ${String(err)}`,
              is_error: true,
            });
          }
        }

        messages.push({ role: "assistant", content: response.content });
        messages.push({ role: "user", content: results });
        continue;
      }

      break agentLoop;
    }

    const durationMs = Date.now() - start;
    this.log.info("Agent complete", { taskId, toolCallCount, durationMs });

    return {
      agentId: this.definition.id,
      taskId,
      output,
      toolCallCount,
      durationMs,
      success: true,
    };
  }
}

// ─── Agent registry ───────────────────────────────────────────────────────────

import { DefiAgent } from "./defi.js";
import { MarketAgent } from "./market.js";
import { ExecutorAgent } from "./executor.js";

export const AGENT_REGISTRY: Record<AgentId, AgentDefinition> = {
  "defi-agent": new DefiAgent().definition,
  "market-agent": new MarketAgent().definition,
  "executor": new ExecutorAgent().definition,
};

export function createAgent(id: AgentId): BaseAgent {
  switch (id) {
    case "defi-agent": return new DefiAgent();
    case "market-agent": return new MarketAgent();
    case "executor": return new ExecutorAgent();
  }
}

