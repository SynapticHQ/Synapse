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
  startDashboard(orchestrator);

  const runCycle = async () => {
    log.info("Running cycle");
    await orchestrator.process(DEFAULT_TASK);
  };

  // First cycle immediately
  await runCycle();

  // Then on interval
  setInterval(runCycle, config.CYCLE_INTERVAL_MS);
  log.info(`Next cycle in ${config.CYCLE_INTERVAL_MS / 60000} minutes`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
