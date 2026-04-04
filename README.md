# Synapse

![License](https://img.shields.io/badge/license-MIT-blue)
![Runtime](https://img.shields.io/badge/runtime-Bun_1.2-black)
![Chain](https://img.shields.io/badge/chain-Solana-9945FF)
![Agents](https://img.shields.io/badge/agents-3_specialized-58a6ff)

A multi-agent MCP orchestrator for Solana DeFi. Send a task — Synapse routes it to the right combination of specialized Claude agents, runs them in sequence, and returns a synthesized action plan.

<br/>

![Synapse orchestrator dashboard](assets/preview.svg)

<br/>

---

## How it works

Most DeFi analysis requires at least two distinct skill sets: reading raw on-chain state (pool TVL, bin arrays, prices) and interpreting what that state means in market context (trend, funding sentiment, cross-exchange divergence). These are different jobs that benefit from different prompts, different tools, and different reasoning styles.

Synapse splits them:

- **defi-agent** — on-chain data specialist. Fetches pool states, scores volume authenticity, pulls token prices. Reports raw numbers.
- **market-agent** — market analyst. Reads funding rates, classifies price trends, flags divergences between spot and perpetuals.
- **executor** — synthesizer. Receives the other agents' output as context and returns a ranked action plan with confidence scores.

A Claude-powered **router** decides which agents a given task actually needs — no hardcoded rules, no over-dispatching.

---

## Routing

The router is itself a Claude call. Given your task, it selects the minimum set of agents needed:

```
"Get current SOL/USDC pool state"
  → defi-agent only

"Is the market trending bullish?"
  → market-agent only

"Analyze top pools and recommend actions"
  → defi-agent → market-agent → executor
```

This avoids burning tokens on agents that aren't relevant to the task.

---

## Dashboard

A live status dashboard runs at `http://localhost:3000` while the orchestrator is active. It shows the last cycle's agent invocations, tool call counts, timings, and executor output. Auto-refreshes every 10 seconds.

---

## Quickstart

```bash
git clone https://github.com/DeltaLogicLabs/synapse
cd synapse
bun install
cp .env.example .env    # add your API keys
bun run dev
```

Dashboard: [http://localhost:3000](http://localhost:3000)

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | — | Required |
| `HELIUS_API_KEY` | — | Required |
| `SOLANA_RPC_URL` | — | Helius mainnet RPC |
| `CYCLE_INTERVAL_MS` | `600000` | How often to run (default 10 min) |
| `MAX_AGENT_TOKENS` | `8192` | Max tokens per agent |
| `CONFIDENCE_THRESHOLD` | `0.65` | Minimum router confidence |
| `DASHBOARD_ENABLED` | `true` | Enable HTTP dashboard |
| `DASHBOARD_PORT` | `3000` | Dashboard port |

---

## Adding an agent

1. Create `agents/your-agent.ts` extending `BaseAgent`
2. Implement `definition`, `getTools()`, `executeTool()`
3. Register in `agents/base.ts` → `AGENT_REGISTRY` and `createAgent()`
4. Add to the router's system prompt in `core/router.ts`

The router will automatically start considering your new agent for task dispatch.

---

## Technical Spec

### Forced Dispatch — `tool_choice: "any"`

The router uses `tool_choice: { type: "any" }` on its Claude call, which forces the model to call `dispatch_agents` rather than returning a plain text response. Without this, ambiguous tasks ("what's happening in DeFi today?") may elicit a prose answer instead of a routing decision, causing the fallback to over-dispatch all three agents and waste tokens.

```typescript
tool_choice: { type: "any" }
// router MUST call dispatch_agents — no text-only escape hatch
```

### Context Accumulation Pattern

Each agent in the sequence receives the **prior agents' outputs as context**, not just the original prompt. The executor's input is:

```
sharedContext          ← ContextStore.toPromptContext()
  + defi-agent output  ← raw on-chain numbers
  + market-agent output ← trend/funding interpretation
  + original task prompt
```

This lets the executor synthesize without needing its own tool calls to fetch on-chain state — it only needs `rank_actions` to emit its verdict.

### Context Size Guard

`ContextStore.toPromptContext()` truncates at 4,000 characters. In long-running sessions, `recentDecisions` accumulates 50 entries — even at 100 chars each that's 5,000 chars of prior decisions injected into every agent's input. The guard prevents token bleed from old decisions crowding out the actual task.

### Token Budget Tracking

Token usage is accumulated across all turns in each agent's multi-turn loop and returned in `AgentResult.tokenUsage`. The orchestrator sums this at cycle end:

```typescript
const cycleInputTokens = cycle.results.reduce((sum, r) => sum + (r.tokenUsage?.inputTokens ?? 0), 0);
```

This lets operators track actual API spend per cycle without external billing aggregation.

### Agent Timeout

`AGENT_TIMEOUT_MS` (default 60s) bounds each agent's execution. The check runs at the top of the `while (true)` agent loop — before each API call — so a hung previous turn doesn't trap the orchestrator waiting for a response that will arrive after the cycle window closes.

### Confidence Gate on Routing

If the router's own `confidence` field falls below `CONFIDENCE_THRESHOLD`, the executor is dropped from the dispatch list. This prevents action plans from being generated when the task scope is ambiguous — the executor's `rank_actions` output is only reliable when defi-agent and market-agent have been given a well-scoped task.

---

## Stack

- **Runtime**: Bun 1.2
- **Agents**: Claude Agent SDK — individual `stop_reason === "tool_use"` loops per agent
- **Routing**: Claude with `tool_choice: "any"` — forced dispatch decision
- **Dashboard**: Bun native HTTP server with token usage per agent

---

## License

MIT


