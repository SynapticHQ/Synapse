import { z } from "zod";
import "dotenv/config";

const ConfigSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  HELIUS_API_KEY: z.string().min(1),
  SOLANA_RPC_URL: z.string().url(),

  // Orchestrator
  CLAUDE_MODEL: z.string().default("claude-sonnet-4-5-20251001"),
  CYCLE_INTERVAL_MS: z.coerce.number().min(5000).default(600000),
  MAX_AGENT_TOKENS: z.coerce.number().min(1024).default(8192),
  CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.65),

  // Dashboard
  DASHBOARD_PORT: z.coerce.number().default(3000),
  DASHBOARD_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("true"),

  // Agent execution
  // Timeout per agent run. A slow Claude API response (e.g. during high load) will
  // stall the entire orchestrator cycle — this cap keeps cycle latency bounded.
  AGENT_TIMEOUT_MS: z.coerce.number().min(5000).default(60000),

  // Task queue
  MAX_CONCURRENT_TASKS: z.coerce.number().min(1).default(3),
});

export type Config = z.infer<typeof ConfigSchema>;

function loadConfig(): Config {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid configuration:");
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();

