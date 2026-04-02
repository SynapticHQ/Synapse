import type Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./base.js";
import { config } from "../core/config.js";
import type { AgentDefinition } from "../core/types.js";

export class DefiAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: "defi-agent",
    description: "Fetches live on-chain DeFi data: pool states, token prices, liquidity positions",
    capabilities: [
      "Meteora DLMM pool state",
      "Jupiter token prices",
      "Liquidity position analysis",
      "Volume authenticity scoring",
    ],
    systemPrompt: `You are a DeFi data specialist. Your job is to fetch accurate, current on-chain data and report it clearly.
Always call tools to get live data — never assume prices or pool states.
Report exact numbers. Flag anything unusual (volume spikes, TVL drops, price anomalies).`,
  };

  getTools(): Anthropic.Tool[] {
    return [
      {
        name: "get_pool_state",
        description: "Get current state of a Meteora DLMM pool",
        input_schema: {
          type: "object" as const,
          properties: {
            pool_address: { type: "string" },
          },
          required: ["pool_address"],
        },
      },
      {
        name: "get_token_price",
        description: "Get current price of a token via Jupiter",
        input_schema: {
          type: "object" as const,
          properties: {
            mint: { type: "string", description: "Token mint address" },
          },
          required: ["mint"],
        },
      },
      {
        name: "volume_auth_check",
        description: "Score volume authenticity for a pool (0–1)",
        input_schema: {
          type: "object" as const,
          properties: {
            pool_address: { type: "string" },
          },
          required: ["pool_address"],
        },
      },
    ];
  }

  async executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
    switch (name) {
      case "get_pool_state": {
        // Helius DAS + Meteora REST
        const res = await fetch(
          `https://dlmm-api.meteora.ag/pair/${input["pool_address"]}`
        );
        return res.json();
      }

      case "get_token_price": {
        const res = await fetch(
          `https://price.jup.ag/v6/price?ids=${input["mint"]}`
        );
        return res.json();
      }

      case "volume_auth_check": {
        const res = await fetch(
          `https://dlmm-api.meteora.ag/pair/${input["pool_address"]}`
        );
        const data = (await res.json()) as {
          liquidity?: number;
          trade_volume_24h?: number;
          fees_24h?: number;
        };
        const tvl = Number(data?.liquidity ?? 0);
        const vol = Number(data?.trade_volume_24h ?? 0);
        const fees = Number(data?.fees_24h ?? 0);
        const volTvlRatio = tvl > 0 ? vol / tvl : 0;
        const feeRate = vol > 0 ? fees / vol : 0;

        let score = 1.0;
        const flags: string[] = [];
        if (volTvlRatio > 10) { score -= 0.3; flags.push(`vol/tvl=${volTvlRatio.toFixed(1)}x`); }
        if (feeRate < 0.0002 || feeRate > 0.02) { score -= 0.2; flags.push(`fee-rate=${(feeRate * 100).toFixed(4)}%`); }
        if (tvl < 5000 && vol > 100000) { score -= 0.5; flags.push("low-tvl high-volume"); }

        return { score: Math.max(0, score), flags };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
