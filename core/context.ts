import type { SharedContext } from "./types.js";
import { createLogger } from "./logger.js";

const log = createLogger("Context");

export class ContextStore {
  private state: SharedContext = {
    lastUpdated: Date.now(),
    activeAlerts: [],
    recentDecisions: [],
  };

  get(): SharedContext {
    return { ...this.state };
  }

  setMarketSummary(summary: string): void {
    this.state.marketSummary = summary;
    this.state.lastUpdated = Date.now();
    log.debug("Market summary updated");
  }

  addAlert(alert: string): void {
    this.state.activeAlerts = [alert, ...this.state.activeAlerts].slice(0, 20);
    this.state.lastUpdated = Date.now();
    log.info("Alert added", { alert });
  }

  clearAlerts(): void {
    this.state.activeAlerts = [];
  }

  recordDecision(taskId: string, summary: string): void {
    this.state.recentDecisions = [
      { taskId, summary, timestamp: Date.now() },
      ...this.state.recentDecisions,
    ].slice(0, 50);
    this.state.lastUpdated = Date.now();
  }

  toPromptContext(): string {
    const lines: string[] = ["## Shared Context"];

    if (this.state.marketSummary) {
      lines.push(`\nMarket: ${this.state.marketSummary}`);
    }

    if (this.state.activeAlerts.length > 0) {
      lines.push(`\nActive alerts:\n${this.state.activeAlerts.map((a) => `- ${a}`).join("\n")}`);
    }

    if (this.state.recentDecisions.length > 0) {
      const recent = this.state.recentDecisions.slice(0, 5);
      lines.push(
        `\nRecent decisions:\n${recent.map((d) => `- [${d.taskId}] ${d.summary}`).join("\n")}`
      );
    }

    // Guard against unbounded context growth. Each agent turn prepends the full
    // shared context — if this exceeds ~4k chars, we start burning prompt tokens
    // on stale data rather than the actual task.
    const result = lines.join("\n");
    if (result.length > 4000) {
      log.warn("Context string exceeded 4000 chars — truncating to prevent token bleed", {
        charsBefore: result.length,
      });
      return result.slice(0, 4000) + "\n[...context truncated]";
    }
    return result;
  }

  getContextSizeChars(): number {
    return this.toPromptContext().length;
  }
}

