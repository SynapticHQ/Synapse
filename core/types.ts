// ─── Agent definitions ────────────────────────────────────────────────────────

export type AgentId = "defi-agent" | "market-agent" | "executor";

export interface AgentDefinition {
  id: AgentId;
  description: string;
  capabilities: string[];
  systemPrompt: string;
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskStatus = "pending" | "routing" | "running" | "complete" | "failed";

export interface Task {
  id: string;
  prompt: string;
  assignedAgents: AgentId[];
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
}

// ─── Routing ──────────────────────────────────────────────────────────────────

export interface RoutingDecision {
  taskId: string;
  selectedAgents: AgentId[];
  reasoning: string;
  confidence: number;
}

// ─── Agent results ────────────────────────────────────────────────────────────

export interface AgentResult {
  agentId: AgentId;
  taskId: string;
  output: string;
  toolCallCount: number;
  durationMs: number;
  success: boolean;
  error?: string;
}

// ─── Orchestrator cycle ───────────────────────────────────────────────────────

export interface OrchestratorCycle {
  cycleId: string;
  startedAt: number;
  completedAt?: number;
  tasksProcessed: number;
  agentInvocations: number;
  results: AgentResult[];
}

// ─── Shared context ───────────────────────────────────────────────────────────

export interface SharedContext {
  lastUpdated: number;
  marketSummary?: string;
  activeAlerts: string[];
  recentDecisions: Array<{
    taskId: string;
    summary: string;
    timestamp: number;
  }>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardState {
  status: "running" | "idle" | "error";
  cycleCount: number;
  activeAgents: AgentId[];
  lastCycle?: OrchestratorCycle;
  context: SharedContext;
}

