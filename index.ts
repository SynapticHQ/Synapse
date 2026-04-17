import { config } from "./core/config.js";
import { createLogger } from "./core/logger.js";
import { Orchestrator } from "./core/orchestrator.js";
import { startDashboard } from "./dashboard/server.js";

const log = createLogger("Synapse");

const DEFAULT_TASK =
  "Analyze the current state of Meteora DLMM pools on Solana. " +
  "Assess market conditions and return a ranked list of recommended actions " +
  "(ENTER / REBALANCE / EXIT / HOLD) with confidence scores.";

async function main() {
  log.info("Synapse starting", {
    model: config.CLAUDE_MODEL,
    cycleInterval: config.CYCLE_INTERVAL_MS,
    dashboard: config.DASHBOARD_ENABLED,
  });

  const orchestrator = new Orchestrator();

  try {
    startDashboard(orchestrator);
  } catch (err) {
    log.error("Dashboard startup failed", {
      error: err instanceof Error ? err.message : String(err),
      port: config.DASHBOARD_ENABLED ? config.DASHBOARD_PORT : null,
    });
  }

  const runCycle = async () => {
    const startedAt = Date.now();
    log.info("Running cycle");

    try {
      await orchestrator.process(DEFAULT_TASK);
    } finally {
      const durationMs = Date.now() - startedAt;
      log.info("Cycle complete", { durationMs });

      if (durationMs > config.CYCLE_INTERVAL_MS) {
        log.warn("Synapse cycle exceeded configured interval", {
          durationMs,
          intervalMs: config.CYCLE_INTERVAL_MS,
        });
      }
    }
  };

  let cycleInFlight = false;
  let skippedCycles = 0;

  const tick = async () => {
    if (cycleInFlight) {
      skippedCycles++;
      log.warn("Skipping cycle because the previous orchestration run is still active", {
        skippedCycles,
      });
      return;
    }

    cycleInFlight = true;
    try {
      await runCycle();
    } catch (err) {
      log.error("Cycle failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      cycleInFlight = false;
    }
  };

  await tick();
  setInterval(() => {
    void tick();
  }, config.CYCLE_INTERVAL_MS);
  log.info(`Next cycle in ${config.CYCLE_INTERVAL_MS / 60000} minutes`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
