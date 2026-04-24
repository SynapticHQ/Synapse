import Anthropic from "@anthropic-ai/sdk";
import { config } from "../core/config.js";
import { createLogger } from "../core/logger.js";
import type { AgentDefinition, AgentResult } from "../core/types.js";

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
    // Accumulate token usage across all turns in this agent's loop
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    agentLoop: while (true) {
      // Enforce per-agent timeout: if we're past the deadline, break out rather than
      // making another API call that will never complete within the cycle budget.
      if (Date.now() - start > config.AGENT_TIMEOUT_MS) {
        this.log.warn("Agent timeout exceeded", { taskId, elapsedMs: Date.now() - start });
        output = "[Agent timed out — partial results only]";
        break agentLoop;
      }

      const response = await this.client.messages.create({
        model: config.CLAUDE_MODEL,
        max_tokens: config.MAX_AGENT_TOKENS,
        system: this.definition.systemPrompt,
        tools: this.getTools(),
        messages,
      });

      totalInputTokens += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

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
    this.log.info("Agent complete", {
      taskId,
      toolCallCount,
      durationMs,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
    });

    return {
      agentId: this.definition.id,
      taskId,
      output,
      toolCallCount,
      durationMs,
      success: true,
      tokenUsage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens },
    };
  }
}


