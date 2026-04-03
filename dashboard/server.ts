import { createLogger } from "../core/logger.js";
import { config } from "../core/config.js";
import type { Orchestrator } from "../core/orchestrator.js";

const log = createLogger("Dashboard");

export function startDashboard(orchestrator: Orchestrator): void {
  if (!config.DASHBOARD_ENABLED) return;

  const server = Bun.serve({
    port: config.DASHBOARD_PORT,
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/health") {
        return Response.json({ status: "ok", ts: Date.now() });
      }

      if (url.pathname === "/api/status") {
        const ctx = orchestrator.getContext().get();
        const last = orchestrator.lastCycle;
        return Response.json({
          status: "running",
          cycleCount: orchestrator.getCycleCount(),
          lastCycle: last
            ? {
                cycleId: last.cycleId,
                tasksProcessed: last.tasksProcessed,
                agentInvocations: last.agentInvocations,
                durationMs: last.completedAt
                  ? last.completedAt - last.startedAt
                  : null,
                results: last.results.map((r) => ({
                  agent: r.agentId,
                  success: r.success,
                  toolCalls: r.toolCallCount,
                  durationMs: r.durationMs,
                  output: r.output.slice(0, 300),
                })),
              }
            : null,
          context: ctx,
        });
      }

      if (url.pathname === "/" || url.pathname === "/dashboard") {
        const ctx = orchestrator.getContext().get();
        const last = orchestrator.lastCycle;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Synapse — MCP Orchestrator</title>
  <meta http-equiv="refresh" content="10"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d1117; color: #e6edf3; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; padding: 24px; }
    h1 { color: #58a6ff; font-size: 18px; margin-bottom: 4px; }
    .sub { color: #484f58; margin-bottom: 24px; font-size: 12px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; margin-bottom: 16px; }
    .label { color: #484f58; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .green { color: #3fb950; }
    .blue { color: #58a6ff; }
    .purple { color: #bc8cff; }
    .yellow { color: #d29922; }
    .agent-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #21262d; }
    .agent-row:last-child { border-bottom: none; }
    pre { color: #8b949e; font-size: 11px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
  </style>
</head>
<body>
  <h1>⬡ Synapse</h1>
  <div class="sub">MCP Orchestrator · auto-refreshes every 10s</div>

  <div class="card">
    <div class="label">Status</div>
    <div class="green">● RUNNING</div>
    <div style="margin-top:8px;color:#8b949e">Cycles completed: ${orchestrator.getCycleCount()}</div>
  </div>

  ${
    last
      ? `<div class="card">
    <div class="label">Last Cycle — ${last.cycleId.slice(0, 8)}</div>
    ${last.results
      .map(
        (r) => `<div class="agent-row">
      <span class="${r.agentId === "executor" ? "green" : r.agentId === "market-agent" ? "purple" : "blue"}">${r.agentId}</span>
      <span style="color:#484f58">${r.toolCallCount} tools · ${r.durationMs}ms</span>
      <span class="${r.success ? "green" : "yellow"}">${r.success ? "✓" : "✗"}</span>
    </div>`
      )
      .join("")}
  </div>

  <div class="card">
    <div class="label">Executor Output</div>
    <pre>${last.results.find((r) => r.agentId === "executor")?.output?.slice(0, 800) ?? "No executor output yet"}</pre>
  </div>`
      : `<div class="card"><div class="label">No cycles yet</div></div>`
  }

  ${
    ctx.activeAlerts.length > 0
      ? `<div class="card">
    <div class="label">Active Alerts</div>
    ${ctx.activeAlerts.map((a) => `<div class="yellow">⚠ ${a}</div>`).join("")}
  </div>`
      : ""
  }
</body>
</html>`;
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      }

      return new Response("Not found", { status: 404 });
    },
  });

  log.info(`Dashboard running at http://localhost:${config.DASHBOARD_PORT}`);
}

