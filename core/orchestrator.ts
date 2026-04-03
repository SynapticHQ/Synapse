import { createLogger } from "./logger.js";
import { config } from "./config.js";
import { TaskRouter } from "./router.js";
import { ContextStore } from "./context.js";
import { createAgent } from "../agents/base.js";
import type {
  AgentId,
  AgentResult,
  OrchestratorCycle,
  Task,
} from "./types.js";
import { randomUUID } from "crypto";

const log = createLogger("Orchestrator");

export class Orchestrator {
  private router: TaskRouter;
  private context: ContextStore;
  private cycleCount = 0;
  public lastCycle: OrchestratorCycle | null = null;

  constructor() {
    this.router = new TaskRouter();
    this.context = new ContextStore();
  }

  getContext(): ContextStore {
    return this.context;
  }

  async process(prompt: string): Promise<OrchestratorCycle> {
    const cycle: OrchestratorCycle = {
      cycleId: randomUUID(),
      startedAt: Date.now(),
      tasksProcessed: 0,
      agentInvocations: 0,
      results: [],
    };

    log.info("Cycle started", { cycleId: cycle.cycleId, prompt: prompt.slice(0, 80) });

    const task: Task = {
      id: randomUUID(),
      prompt,
      assignedAgents: [],
      status: "routing",
      createdAt: Date.now(),
    };

    try {
      // 1. Route the task
      const routing = await this.router.route(task.id, prompt);
      task.assignedAgents = routing.selectedAgents;
      task.status = "running";

      log.info("Task routed", {
        taskId: task.id,
        agents: routing.selectedAgents,
        confidence: routing.confidence,
      });

      // 2. Run agents in sequence (executor depends on defi/market output)
      const nonExecutorAgents = routing.selectedAgents.filter((id) => id !== "executor");
      const runExecutor = routing.selectedAgents.includes("executor");

      const sharedContext = this.context.toPromptContext();
      const prelimResults: AgentResult[] = [];

      // Run defi + market agents first
      for (const agentId of nonExecutorAgents) {
        const agent = createAgent(agentId as AgentId);
        const result = await agent.run(task.id, prompt, sharedContext);
        prelimResults.push(result);
        cycle.agentInvocations++;

        if (result.success && result.output) {
          this.context.recordDecision(task.id, `${agentId}: ${result.output.slice(0, 100)}`);
        }
      }

      // Run executor with aggregated context
      if (runExecutor) {
        const aggregatedContext = [
          sharedContext,
          ...prelimResults.map((r) => `\n## ${r.agentId} output:\n${r.output}`),
        ].join("\n");

        const executor = createAgent("executor");
        const execResult = await executor.run(task.id, prompt, aggregatedContext);
        prelimResults.push(execResult);
        cycle.agentInvocations++;
      }

      cycle.results = prelimResults;
      cycle.tasksProcessed = 1;
      task.status = "complete";

      // Update market summary from market-agent output
      const marketResult = prelimResults.find((r) => r.agentId === "market-agent");
      if (marketResult?.output) {
        this.context.setMarketSummary(marketResult.output.slice(0, 200));
      }
    } catch (err) {
      log.error("Cycle error", { cycleId: cycle.cycleId, err });
      task.status = "failed";
      this.context.addAlert(`Cycle ${cycle.cycleId} failed: ${String(err)}`);
    }

    cycle.completedAt = Date.now();
    this.cycleCount++;
    this.lastCycle = cycle;

    const duration = ((cycle.completedAt - cycle.startedAt) / 1000).toFixed(1);
    log.info("Cycle complete", {
      cycleId: cycle.cycleId,
      agents: cycle.agentInvocations,
      durationSec: duration,
    });

    return cycle;
  }

  getCycleCount(): number {
    return this.cycleCount;
  }
}

