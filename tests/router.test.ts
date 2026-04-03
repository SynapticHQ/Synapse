import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Anthropic SDK
vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = {
      create: vi.fn().mockResolvedValue({
        stop_reason: "tool_use",
        content: [
          {
            type: "tool_use",
            id: "tu_001",
            name: "dispatch_agents",
            input: {
              selected_agents: ["defi-agent"],
              reasoning: "Task only requires DeFi data",
              confidence: 0.9,
            },
          },
        ],
      }),
    };
  },
}));

vi.mock("../core/config.js", () => ({
  config: {
    ANTHROPIC_API_KEY: "test-key",
    CLAUDE_MODEL: "claude-sonnet-4-5-20251001",
    HELIUS_API_KEY: "test-helius",
    SOLANA_RPC_URL: "https://example.com",
    CYCLE_INTERVAL_MS: 600000,
    MAX_AGENT_TOKENS: 8192,
    CONFIDENCE_THRESHOLD: 0.65,
    DASHBOARD_PORT: 3000,
    DASHBOARD_ENABLED: true,
    MAX_CONCURRENT_TASKS: 3,
  },
}));

describe("TaskRouter", () => {
  it("returns a routing decision with selected agents", async () => {
    const { TaskRouter } = await import("../core/router.js");
    const router = new TaskRouter();
    const decision = await router.route("task-001", "Get SOL/USDC pool state");

    expect(decision.taskId).toBe("task-001");
    expect(decision.selectedAgents).toContain("defi-agent");
    expect(decision.confidence).toBeGreaterThan(0);
    expect(decision.reasoning).toBeTruthy();
  });
});

