import type Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./base.js";
import type { AgentDefinition } from "../core/types.js";
import { config } from "../core/config.js";

export class MarketAgent extends BaseAgent {
  readonly definition: AgentDefinition = {
    id: "market-agent",
    description: "Analyzes market conditions: funding rates, trends, sentiment signals",
    capabilities: [
      "Perpetual funding rate analysis",
      "Price trend classification",
      "Cross-exchange spread detection",
      "Volatility estimation",
    ],
    systemPrompt: `You are a market analyst specializing in Solana DeFi.
Your job is to synthesize market signals into a clear directional view.
Use funding rates as a sentiment proxy. Flag divergences between spot and perp markets.
Always conclude with a one-line market verdict: BULLISH / BEARISH / NEUTRAL + one sentence rationale.`,
  };

  getTools(): Anthropic.Tool[] {
    return [
      {
        name: "get_funding_rates",
        description: "Get perpetual funding rates from Drift Protocol",
        input_schema: {
          type: "object" as const,
          properties: {
            market: { type: "string", description: "Market symbol e.g. SOL-PERP" },
          },
          required: ["market"],
        },
      },
      {
        name: "get_ohlcv",
        description: "Get OHLCV candle data for trend analysis",
        input_schema: {
          type: "object" as const,
          properties: {
            mint: { type: "string" },
            resolution: { type: "string", enum: ["1h", "4h", "1d"], description: "Candle size" },
            limit: { type: "number", description: "Number of candles (max 100)" },
          },
          required: ["mint", "resolution"],
        },
      },
      {
        name: "classify_trend",
        description: "Classify price trend from OHLCV data as BULLISH, BEARISH, or NEUTRAL",
        input_schema: {
          type: "object" as const,
          properties: {
            prices: {
              type: "array",
              items: { type: "number" },
              description: "Array of closing prices (oldest first)",
            },
          },
          required: ["prices"],
        },
      },
    ];
  }

  async executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
    switch (name) {
      case "get_funding_rates": {
        const url = `https://mainnet.helius-rpc.com/?api-key=${config.HELIUS_API_KEY}`;
        // Drift Protocol funding rates via Helius RPC
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "funding",
            method: "getAccountInfo",
            params: ["FaMS3haK2RqMTMNKnQNhPjSFNMCNUiXPHScaJHrKbCkL", { encoding: "base64" }],
          }),
        });
        return res.json();
      }

      case "get_ohlcv": {
        const mint = String(input["mint"]);
        const resolution = String(input["resolution"] ?? "1h");
        const limit = Number(input["limit"] ?? 24);
        const res = await fetch(
          `https://price.jup.ag/v6/price?ids=${mint}`
        );
        const price = await res.json() as { data?: Record<string, { price?: number }> };
        const currentPrice = price?.data?.[mint]?.price ?? 100;

        // Simulate candles for demonstration
        const candles = Array.from({ length: limit }, (_, i) => ({
          t: Date.now() - (limit - i) * 3600000,
          o: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
          h: currentPrice * (1 + Math.random() * 0.02),
          l: currentPrice * (1 - Math.random() * 0.02),
          c: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
          v: Math.random() * 1000000,
        }));
        return { resolution, candles };
      }

      case "classify_trend": {
        const prices = input["prices"] as number[];
        if (!prices || prices.length < 3) return { trend: "NEUTRAL", reason: "Insufficient data" };

        const first = prices.slice(0, Math.floor(prices.length / 2));
        const second = prices.slice(Math.floor(prices.length / 2));
        const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
        const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;
        const change = (secondAvg - firstAvg) / firstAvg;

        if (change > 0.02) return { trend: "BULLISH", change: `+${(change * 100).toFixed(2)}%` };
        if (change < -0.02) return { trend: "BEARISH", change: `${(change * 100).toFixed(2)}%` };
        return { trend: "NEUTRAL", change: `${(change * 100).toFixed(2)}%` };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
