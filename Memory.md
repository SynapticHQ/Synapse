# Memory

This file tracks architectural decisions, learnings, and patterns observed during development. Updated as the project evolves.

## Agent Design Decisions

- **Router as a separate Claude call** (not hardcoded rules): allows the router to adapt to novel task types without code changes. Trade-off: one extra API call per task.
- **Executor always runs last**: depends on defi-agent + market-agent output. Running it in parallel would lose the synthesis benefit.
- **Sequential non-executor agents**: could be parallelized for speed, but sequential is safer for shared context writes.

## Observed Patterns

_Add entries here as you run the orchestrator and notice recurring behaviors._

Example:
```
2026-04-02 — defi-agent consistently over-reports volume for low-TVL pools.
Added volume_auth_check as mandatory pre-filter.
```

## Known Limitations

- Executor's `rank_actions` tool is intercepted but not yet executed on-chain
- Dashboard auto-refresh at 10s is aggressive for high-frequency cycles
- OHLCV data in market-agent currently uses Jupiter price + simulated candles — replace with a real OHLCV source (Birdeye, Pyth history)

