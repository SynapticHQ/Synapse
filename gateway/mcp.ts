/**
 * MCP Gateway — unified tool surface for external callers.
 * Exposes all agent tools under a single namespace so external
 * MCP clients can interact with Synapse without knowing the
 * internal agent topology.
 */
import { DefiAgent } from "../agents/defi.js";
import { MarketAgent } from "../agents/market.js";
import { createLogger } from "../core/logger.js";
import type Anthropic from "@anthropic-ai/sdk";

const log = createLogger("MCPGateway");

type ToolHandler = (input: Record<string, unknown>) => Promise<unknown>;

export class MCPGateway {
  private handlers = new Map<string, ToolHandler>();
  private tools: Anthropic.Tool[] = [];

  constructor() {
    this.registerAgent("defi", new DefiAgent());
    this.registerAgent("market", new MarketAgent());
  }

  private registerAgent(prefix: string, agent: { getTools(): Anthropic.Tool[]; executeTool(name: string, input: Record<string, unknown>): Promise<unknown> }): void {
    for (const tool of agent.getTools()) {
      const qualifiedName = `${prefix}_${tool.name}`;
      this.tools.push({ ...tool, name: qualifiedName });
      this.handlers.set(qualifiedName, (input) => agent.executeTool(tool.name, input));
      log.debug("Tool registered", { name: qualifiedName });
    }
  }

  getTools(): Anthropic.Tool[] {
    return this.tools;
  }

  async execute(name: string, input: Record<string, unknown>): Promise<unknown> {
    const handler = this.handlers.get(name);
    if (!handler) throw new Error(`Unknown MCP tool: ${name}`);
    log.debug("Executing tool", { name, input });
    return handler(input);
  }

  listTools(): string[] {
    return Array.from(this.handlers.keys());
  }
}
