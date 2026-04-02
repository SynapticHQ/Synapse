# CLAUDE.md

## What this is

Synapse is a multi-agent MCP orchestrator. A single task gets routed by Claude to one or more specialized agents (defi-agent, market-agent, executor). Each agent runs its own tool loop. Results are aggregated — executor synthesizes everything into ranked actions.

## Layout

```
index.ts          ← entry point
core/
  config.ts       ← Zod env validation
  types.ts        ← shared types
  logger.ts       ← structured logger
  orchestrator.ts ← task dispatch + result aggregation
  router.ts       ← Claude-powered task → agent routing
  context.ts      ← shared state across cycles
agents/
  base.ts         ← BaseAgent abstract class + registry
  defi.ts         ← on-chain DeFi data
  market.ts       ← market analysis
  executor.ts     ← final synthesis + action ranking
gateway/
  mcp.ts          ← unified external MCP tool surface
dashboard/
  server.ts       ← Bun HTTP status dashboard
tests/
  router.test.ts
```

## Dev commands

```bash
bun run dev       # run with hot reload
bun run test      # vitest
bun run lint      # tsc type check
```

## Adding a new agent

1. Create `agents/your-agent.ts` extending `BaseAgent`
2. Implement `definition`, `getTools()`, `executeTool()`
3. Add to `AGENT_REGISTRY` and `createAgent()` in `agents/base.ts`
4. Add to the router system prompt in `core/router.ts`

## Key constraints

- No `console.log` — use `createLogger(component)`
- Router always runs before any agent
- Executor always runs last if included in routing
