import React from "react";
import {
  Github,
  ArrowUpRight,
  ArrowDown,
  Check,
  X,
  Route,
  Users,
  GitMerge,
  ShieldCheck,
  Tag,
  Send,
  Database,
  TrendingUp,
  CornerDownLeft,
  Crosshair,
  Coins,
  Network,
  List,
  ChevronRight,
} from "lucide-react";

export default function SynapseLanding() {
  // ---- HARD-CODED DATA ----
  const navAnchors = [
    { label: "DASHBOARD", href: "#dashboard" },
    { label: "DOCTRINE", href: "#doctrine" },
    { label: "LOOP", href: "#loop" },
    { label: "DECISION", href: "#decision" },
    { label: "LAUNCH", href: "#launch" },
  ];

  const heroAgents = [
    { name: "defi-agent", tone: "steel" },
    { name: "market-agent", tone: "taupe" },
    { name: "executor", tone: "amber" },
  ];

  const heroAgentLines = [
    "defi · 642 pools scanned · top 12 surfaced",
    "market · trend BULL · funding +0.012%",
    "executor · 3 actions ranked · top confidence 0.84",
  ];

  const heroPlan = [
    { idx: "01", verb: "STAKE", body: "Meteora SOL/USDC 0.05% bin", conf: "0.84" },
    { idx: "02", verb: "HOLD", body: "Drift JUP/USDC perp", conf: "0.71" },
    { idx: "03", verb: "SKIP", body: "Raydium WIF/USDC", conf: "0.52" },
  ];

  const taskQueue = [
    { id: "3019", op: "operator-A1", desc: "Analyze top SOL pools and recommend actions", status: "in-flight", active: true },
    { id: "3018", op: "operator-K7", desc: "Funding skew across SOL perps last 4h", status: "done", active: false },
    { id: "3017", op: "operator-Q3", desc: "Volume authenticity check on JUP/USDC", status: "done", active: false },
    { id: "3020", op: "operator-D9", desc: "Rank LP venues by APR-vs-IL today", status: "routing", active: false },
    { id: "3021", op: "operator-M2", desc: "Surface mispriced spot vs perp on WIF", status: "queued", active: false },
  ];

  const toolBars = [
    { agent: "defi-agent", calls: 14, pct: 78 },
    { agent: "market-agent", calls: 9, pct: 50 },
    { agent: "executor", calls: 4, pct: 22 },
  ];

  const timing = [
    { agent: "defi-agent", ms: 940 },
    { agent: "market-agent", ms: 720 },
    { agent: "executor", ms: 740 },
  ];

  const dashboardPlan = [
    { rank: "01", chip: "STAKE", pair: "SOL/USDC", venue: "Meteora · 0.05% bin", conf: 0.84 },
    { rank: "02", chip: "HOLD", pair: "JUP/USDC", venue: "Drift · perp", conf: 0.71 },
    { rank: "03", chip: "SHIFT", pair: "JTO/USDC", venue: "Orca · whirlpool", conf: 0.66 },
    { rank: "04", chip: "SKIP", pair: "WIF/USDC", venue: "Raydium · CLMM", conf: 0.52 },
  ];

  const routerLog = [
    "01  classify: task type \"pool analysis + recommend\"",
    "02  dispatch: defi-agent (required), market-agent (required), executor (synth)",
    "03  context: shared store updated · 642 pools, market BULL",
    "04  confidence: router 0.78, executor top action 0.84",
    "05  return: 3 actions ranked, 1 above 0.80, 1 above 0.70, 1 below",
    "06  ready. Plan returned to operator.",
  ];

  const doctrine = [
    {
      n: "01",
      icon: Route,
      title: "Route to the minimum.",
      body: "A task only invokes the agents it actually needs. Over-dispatch wastes tokens; under-dispatch returns half-answers. The router's job is to pick exactly right.",
    },
    {
      n: "02",
      icon: Users,
      title: "Specialists over generalists.",
      body: "defi-agent reads on-chain. market-agent reads markets. executor synthesizes. Each prompt, each toolset, each reasoning style is tuned to one job.",
    },
    {
      n: "03",
      icon: GitMerge,
      title: "Context accumulates.",
      body: "Each agent in the chain reads what the prior ones produced. The executor never starts blind. The plan is grounded.",
    },
    {
      n: "04",
      icon: ShieldCheck,
      title: "Confidence gates the answer.",
      body: "A plan below the router's 0.65 floor is held back. The system returns one strong answer or none — never a weak guess pretending to be advice.",
    },
  ];

  const loop = [
    { n: "01", icon: Tag, title: "Classify", body: "Task arrives. Claude router reads it and picks the minimum set of agents required." },
    { n: "02", icon: Send, title: "Dispatch", body: "Selected agents are invoked in order. The router carries shared context, not just the original prompt." },
    { n: "03", icon: Database, title: "On-chain", body: "defi-agent fetches pool states, volume authenticity, token prices. Returns raw numbers." },
    { n: "04", icon: TrendingUp, title: "Market", body: "market-agent reads funding rates, classifies trends, flags spot-perp divergence." },
    { n: "05", icon: GitMerge, title: "Synthesize", body: "executor reads both prior outputs, ranks the actions, attaches per-action confidence." },
    { n: "06", icon: CornerDownLeft, title: "Return", body: "The plan goes back to the operator. Below-confidence plans are flagged, not returned silently." },
  ];

  const dispatched = [
    "On-chain state needed → defi-agent runs",
    "Market context needed → market-agent runs",
    "Action recommendation needed → executor runs",
    "Multi-step task → all three chain",
    "Router confidence above 0.65",
    "Token budget within per-agent cap",
  ];
  const skipped = [
    "Task purely on-chain stats (only defi runs)",
    "Task purely market read (only market runs)",
    "Router confidence below 0.65 (plan held)",
    "Task ambiguous on inspection (re-prompt requested)",
    "Per-agent token budget would overflow",
    "Same task deduplicated within cycle window",
  ];

  const principles = [
    {
      n: "01",
      icon: Crosshair,
      title: "The router is the product.",
      body: "One Claude call that picks the right specialists is more valuable than ten generalist agents talking past each other.",
    },
    {
      n: "02",
      icon: Coins,
      title: "Tokens are a budget.",
      body: "Every dispatched agent costs tokens. Every skipped agent saves them. The router's discipline is fiscal, not just architectural.",
    },
    {
      n: "03",
      icon: Network,
      title: "Context is shared, not assumed.",
      body: "Every agent reads what the prior agents wrote. Nothing reasons in isolation. The plan is grounded in what was just learned.",
    },
    {
      n: "04",
      icon: List,
      title: "The plan is ranked, not voted.",
      body: "Outputs come back as one prioritized list with per-action confidence — not as parallel opinions for the operator to reconcile.",
    },
  ];

  // ---- TONE HELPERS (muted slate-blue / warm taupe / soft amber for agent chips) ----
  const toneClasses = {
    steel: "border-[#3a4a5e] bg-[#3a4a5e]/15 text-[#a8bcd0]",
    taupe: "border-[#5e4f3d] bg-[#5e4f3d]/15 text-[#cdb89a]",
    amber: "border-[#6b5a2c] bg-[#6b5a2c]/15 text-[#d8c275]",
  };

  // ---- SUBCOMPONENTS ----
  const Eyebrow = ({ children }) => (
    <div className="font-mono text-xs tracking-[0.2em] text-orange-500">{children}</div>
  );

  const TwoTone = ({ a, b, size = "text-5xl md:text-6xl lg:text-7xl" }) => (
    <h2 className={`${size} font-semibold tracking-tight leading-[1.05]`}>
      <span className="text-white">{a}</span>{" "}
      <span className="text-white/[0.35]">{b}</span>
    </h2>
  );

  const StatusChip = ({ label, tone }) => (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-wider ${toneClasses[tone]}`}>
      <span>{label}</span>
      <Check className="h-3 w-3" strokeWidth={2.5} />
    </span>
  );

  return (
    <div className="min-h-screen bg-black text-neutral-200 antialiased scroll-smooth selection:bg-orange-500/30 selection:text-white">
      {/* ============ STICKY TOP NAV ============ */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur supports-[backdrop-filter]:bg-black/70">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-8">
          <a href="#top" className="font-semibold tracking-[0.18em] text-white text-sm">
            SYNAPSE
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {navAnchors.map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
              >
                {a.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center rounded-md border border-orange-500/40 bg-orange-500/5 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-orange-400">
              CA:PENDING
            </span>
            <a
              href="https://github.com/SynapticHQ/Synapse"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-orange-400 transition-colors"
            >
              Launch Synapse
            </a>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-[1400px] grid-cols-1 gap-12 px-5 md:px-8 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-24">
          {/* LEFT */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2.5 mb-10">
              <span className="inline-flex items-center gap-2 rounded-md border border-orange-500/45 bg-orange-500/[0.06] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.22em] text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.85)]" />
                LIVE MULTI-AGENT ORCHESTRATOR
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.02] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.22em] text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80" />
                3 SPECIALISTS · CLAUDE-ROUTED
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[7.5rem] font-semibold tracking-[-0.03em] leading-[0.95]">
              <span className="block text-white">One task in.</span>
              <span className="block text-white/[0.35]">One ranked plan out.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-neutral-400">
              Synapse routes your task to the minimum set of specialist Claude agents needed,
              runs them in sequence with accumulated context, and returns one prioritized
              action plan instead of three disconnected replies.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-medium text-black hover:bg-orange-400 transition-colors"
              >
                View the live run
              </a>
              <a
                href="#doctrine"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white hover:border-white/40 hover:bg-white/[0.05] transition-colors"
              >
                Read the architecture <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-14 flex items-center gap-6 font-mono text-[11px] tracking-[0.18em] text-neutral-500">
              <span>HELIUS · MAINNET</span>
              <span className="h-px w-10 bg-white/15" />
              <span>CLAUDE · ROUTED</span>
              <span className="h-px w-10 bg-white/15" />
              <span>10m CYCLE</span>
            </div>
          </div>

          {/* RIGHT - TASK → PLAN PANEL */}
          <div className="flex items-center">
            <div className="w-full rounded-lg border border-white/10 bg-[#0a0908] p-6 md:p-7 shadow-[0_0_60px_-30px_rgba(249,115,22,0.25)]">
              {/* A. Header */}
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.16em] text-neutral-500">
                <span>task.cycle/3019</span>
                <span className="inline-flex items-center gap-2 text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
                  ROUTED · 2.4s
                </span>
              </div>

              {/* B. Task callout */}
              <div className="mt-5">
                <div className="font-mono text-[10.5px] tracking-[0.22em] text-neutral-500 mb-2.5">
                  OPERATOR ASKED
                </div>
                <div className="rounded-lg border border-orange-500/45 bg-orange-500/[0.05] px-5 py-5 md:py-6">
                  <p className="font-mono text-lg md:text-xl leading-snug text-white">
                    “Analyze top SOL pools and recommend actions”
                  </p>
                </div>
              </div>

              {/* C. Transition */}
              <div className="mt-5 flex flex-col items-center">
                <ArrowDown className="h-5 w-5 text-orange-500/70" strokeWidth={2} />
                <div className="mt-1 font-mono text-[10px] tracking-[0.24em] text-orange-500/80">
                  SYNAPSE ROUTED
                </div>
              </div>

              {/* D. Agent chain */}
              <div className="mt-5">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {heroAgents.map((a, i) => (
                    <React.Fragment key={a.name}>
                      <StatusChip label={a.name} tone={a.tone} />
                      {i < heroAgents.length - 1 && (
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-3 space-y-1.5">
                  {heroAgentLines.map((l) => (
                    <div key={l} className="flex items-start gap-2 font-mono text-[11.5px] text-neutral-400">
                      <Check className="h-3.5 w-3.5 text-emerald-400/80 mt-[3px] shrink-0" strokeWidth={2.5} />
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* E. Action plan preview */}
              <div className="mt-5 rounded-md border border-white/10 bg-white/[0.015] px-4 py-3">
                <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-neutral-500 mb-2">
                  <span>RANKED PLAN · 3 actions</span>
                  <span className="text-neutral-600">conf</span>
                </div>
                <div className="divide-y divide-white/5">
                  {heroPlan.map((p) => (
                    <div key={p.idx} className="flex items-center justify-between gap-3 py-1.5 font-mono text-[12px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-neutral-500">{p.idx}</span>
                        <span
                          className={`inline-block w-12 text-center rounded-sm px-1.5 py-0.5 text-[10px] tracking-wider ${
                            p.verb === "STAKE"
                              ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                              : p.verb === "HOLD"
                              ? "bg-white/[0.04] text-neutral-300 border border-white/15"
                              : "bg-white/[0.02] text-neutral-500 border border-white/10"
                          }`}
                        >
                          {p.verb}
                        </span>
                        <span className="truncate text-neutral-300">{p.body}</span>
                      </div>
                      <span className={p.conf >= "0.80" ? "text-orange-400" : "text-neutral-400"}>{p.conf}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* F. Footer */}
              <div className="mt-5 border-t border-white/10 pt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] tracking-[0.16em] text-neutral-500">
                <span>router conf 0.78</span>
                <span>·</span>
                <span>3 agents dispatched</span>
                <span>·</span>
                <span>2.4s total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DASHBOARD ============ */}
      <section id="dashboard" className="border-t border-white/10 bg-[#040404]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-32">
          <Eyebrow>DASHBOARD</Eyebrow>
          <div className="mt-3 max-w-3xl">
            <TwoTone a="Live across three specialists." b="One plan, one cycle." />
          </div>

          <div className="mt-12 rounded-lg border border-white/10 bg-[#0a0908] overflow-hidden">
            {/* Top status bar */}
            <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 border-b border-white/10 px-5 md:px-6 py-3.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.9)]" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-300">SYNAPSE · LIVE ORCHESTRATOR</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10.5px] tracking-[0.18em] text-neutral-500">
                <span>MODE <span className="text-orange-400">LIVE</span></span>
                <span>AGENTS <span className="text-neutral-300">3 READY</span></span>
                <span>UPTIME <span className="text-neutral-300">22d 14h</span></span>
                <span>LAST CYCLE <span className="text-neutral-300">02:38</span></span>
                <span>SUCCESS <span className="text-neutral-300">94.2%</span></span>
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {/* Left col - Task queue */}
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-neutral-500">
                  <span>TASK QUEUE</span>
                  <span>5 ACTIVE</span>
                </div>
                <div className="mt-4 space-y-2">
                  {taskQueue.map((t) => {
                    const statusColor = {
                      "in-flight": "text-orange-400 border-orange-500/40 bg-orange-500/10",
                      done: "text-emerald-400/90 border-emerald-500/30 bg-emerald-500/5",
                      routing: "text-neutral-200 border-white/20 bg-white/[0.04]",
                      queued: "text-neutral-500 border-white/10 bg-white/[0.02]",
                    }[t.status];
                    return (
                      <div
                        key={t.id}
                        className={`rounded-md border px-3.5 py-3 transition-colors ${
                          t.active
                            ? "border-orange-500/45 bg-orange-500/[0.04]"
                            : "border-white/10 bg-white/[0.015] hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.16em] text-neutral-500">
                          <span>cycle/{t.id}</span>
                          <span className={`rounded-sm border px-1.5 py-0.5 text-[9.5px] tracking-[0.18em] ${statusColor}`}>
                            {t.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] text-neutral-400">{t.op}</div>
                        <div className="mt-1 text-[12.5px] leading-snug text-neutral-200 line-clamp-2">{t.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right col */}
              <div className="p-5 md:p-6 space-y-6">
                {/* Selected cycle detail */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-neutral-500">
                    <span>SELECTED CYCLE · 3019</span>
                    <span className="text-orange-400">IN-FLIGHT</span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-white/10 bg-white/[0.015] p-3.5">
                      <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">ROUTER PICKED</div>
                      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto">
                        <StatusChip label="defi-agent" tone="steel" />
                        <ChevronRight className="h-3 w-3 text-neutral-600" />
                        <StatusChip label="market-agent" tone="taupe" />
                        <ChevronRight className="h-3 w-3 text-neutral-600" />
                        <StatusChip label="executor" tone="amber" />
                      </div>
                    </div>

                    <div className="rounded-md border border-white/10 bg-white/[0.015] p-3.5">
                      <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">CONTEXT CARRIED</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="text-neutral-500">pools</div>
                        <div className="text-neutral-200 text-right">642</div>
                        <div className="text-neutral-500">market</div>
                        <div className="text-neutral-200 text-right">BULL</div>
                        <div className="text-neutral-500">funding</div>
                        <div className="text-neutral-200 text-right">+0.012%</div>
                      </div>
                    </div>

                    <div className="rounded-md border border-white/10 bg-white/[0.015] p-3.5">
                      <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">TOOL CALLS BY AGENT</div>
                      <div className="mt-2.5 space-y-2">
                        {toolBars.map((b) => (
                          <div key={b.agent} className="flex items-center gap-2 font-mono text-[10.5px]">
                            <span className="w-24 truncate text-neutral-400">{b.agent}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div className="h-full bg-orange-500/80" style={{ width: `${b.pct}%` }} />
                            </div>
                            <span className="w-6 text-right text-neutral-300">{b.calls}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md border border-white/10 bg-white/[0.015] p-3.5">
                      <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">TIMING (ms)</div>
                      <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
                        {timing.map((t) => (
                          <div key={t.agent} className="flex items-center justify-between">
                            <span className="text-neutral-400">{t.agent}</span>
                            <span className="text-neutral-200">{t.ms}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                          <span className="text-neutral-500">total</span>
                          <span className="text-orange-400">2400</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranked Action Plan */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-neutral-500">
                    <span>RANKED ACTION PLAN</span>
                    <span>4 ACTIONS</span>
                  </div>
                  <div className="mt-3 rounded-md border border-white/10 overflow-hidden">
                    {dashboardPlan.map((p, i) => {
                      const chipClass = {
                        STAKE: "bg-orange-500/15 text-orange-400 border-orange-500/30",
                        HOLD: "bg-white/[0.04] text-neutral-200 border-white/15",
                        SHIFT: "bg-white/[0.04] text-neutral-300 border-white/15",
                        SKIP: "bg-white/[0.02] text-neutral-500 border-white/10",
                      }[p.chip];
                      const above = p.conf >= 0.65;
                      return (
                        <div
                          key={p.rank}
                          className={`grid grid-cols-12 items-center gap-3 px-3.5 py-2.5 font-mono text-[11.5px] ${
                            i !== dashboardPlan.length - 1 ? "border-b border-white/5" : ""
                          }`}
                        >
                          <span className="col-span-1 text-neutral-500">{p.rank}</span>
                          <span className={`col-span-2 inline-block text-center rounded-sm border px-1.5 py-0.5 text-[10px] tracking-wider ${chipClass}`}>
                            {p.chip}
                          </span>
                          <span className="col-span-2 text-neutral-200">{p.pair}</span>
                          <span className="col-span-4 text-neutral-400 truncate">{p.venue}</span>
                          <div className="col-span-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className={`h-full ${above ? "bg-orange-500/80" : "bg-neutral-500/50"}`}
                                style={{ width: `${Math.round(p.conf * 100)}%` }}
                              />
                            </div>
                            <span className={above ? "text-orange-400 w-9 text-right" : "text-neutral-500 w-9 text-right"}>
                              {p.conf.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Router log */}
            <div className="border-t border-white/10 px-5 md:px-6 py-5 bg-[#070605]">
              <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-neutral-500 mb-3">
                <span>ROUTER LOG</span>
                <span>cycle/3019</span>
              </div>
              <div className="space-y-1 font-mono text-[11.5px] text-neutral-400 overflow-x-auto">
                {routerLog.map((l) => (
                  <div key={l} className="whitespace-pre">{l}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Caption + stat strip */}
          <p className="mt-8 font-mono text-[12px] tracking-wide text-neutral-500 max-w-3xl">
            Live orchestration. Every task, every agent, every plan ranked. Below-confidence plans are held back, never returned silently.
          </p>

          <div className="mt-10 grid grid-cols-3 border-y border-white/10">
            {[
              { n: "0.65", l: "Router confidence floor" },
              { n: "3", l: "Specialists available" },
              { n: "10m", l: "Cycle interval" },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`px-5 py-7 ${i < 2 ? "border-r border-white/10" : ""}`}
              >
                <div className="text-4xl md:text-5xl font-semibold tracking-tight text-white">{s.n}</div>
                <div className="mt-1.5 font-mono text-[10.5px] tracking-[0.2em] text-neutral-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOCTRINE ============ */}
      <section id="doctrine" className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>DOCTRINE</Eyebrow>
            <div className="mt-3">
              <TwoTone a="Route to the minimum." b="Synthesize the rest." />
            </div>
            <p className="mt-6 max-w-md text-neutral-400 leading-relaxed">
              Four rules that govern what runs, what waits, and what is returned. They are
              not aesthetic preferences. They are how the orchestrator earns its tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctrine.map((d) => {
              const Icon = d.icon;
              return (
                <article
                  key={d.n}
                  className="rounded-lg border border-white/10 bg-[#0a0908] p-7 flex flex-col h-full transition-colors duration-200 hover:border-orange-500/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-mono text-[11px] tracking-[0.22em] text-orange-500">{d.n}</div>
                    <Icon className="h-[22px] w-[22px] text-orange-500/70" strokeWidth={1.6} />
                  </div>
                  <div className="mt-1 h-px w-8 bg-orange-500/40" />
                  <h3 className="mt-4 text-lg font-semibold text-white tracking-tight">{d.title}</h3>
                  <p className="mt-3 text-[14px] text-neutral-400 leading-relaxed">{d.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ LOOP ============ */}
      <section id="loop" className="border-t border-white/10 bg-[#040404]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-32">
          <Eyebrow>THE LOOP</Eyebrow>
          <div className="mt-3 max-w-4xl">
            <TwoTone a="Six steps." b="One orchestration." />
          </div>
          <p className="mt-6 max-w-2xl text-neutral-400">
            Every task walks the same path. The router picks; the specialists run; the
            executor synthesizes; the plan returns ranked.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loop.map((l) => {
              const Icon = l.icon;
              return (
                <article
                  key={l.n}
                  className="rounded-lg border border-white/10 bg-[#0a0908] p-8 h-full flex flex-col transition-colors duration-200 hover:border-orange-500/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-mono text-[11px] tracking-[0.22em] text-orange-500">{l.n}</div>
                    <Icon className="h-[22px] w-[22px] text-orange-500/70" strokeWidth={1.6} />
                  </div>
                  <div className="mt-1 h-px w-8 bg-orange-500/40" />
                  <h3 className="mt-5 text-xl font-semibold text-white tracking-tight">{l.title}</h3>
                  <p className="mt-3 text-[14px] text-neutral-400 leading-relaxed">{l.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DECISION ============ */}
      <section id="decision" className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-32">
          <Eyebrow>DECISION</Eyebrow>
          <div className="mt-3 max-w-4xl">
            <TwoTone a="What gets dispatched." b="And what gets held back." />
          </div>
          <p className="mt-6 max-w-2xl text-neutral-400">
            The router decides who runs and what returns. Every cycle is one decision repeated
            three times.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dispatched */}
            <div className="rounded-lg border border-white/10 bg-[#0a0908] p-7">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
                <div className="font-mono text-[11px] tracking-[0.22em] text-orange-400">AGENTS DISPATCHED</div>
              </div>
              <ul className="mt-5 space-y-3">
                {dispatched.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[14px] text-neutral-200">
                    <Check className="h-4 w-4 text-emerald-400 mt-[3px] shrink-0" strokeWidth={2.5} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skipped */}
            <div className="rounded-lg border border-white/10 bg-[#0a0908] p-7">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#7a8696]" />
                <div className="font-mono text-[11px] tracking-[0.22em] text-[#9aa6b4]">AGENTS SKIPPED OR HELD</div>
              </div>
              <ul className="mt-5 space-y-3">
                {skipped.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[14px] text-neutral-300">
                    <X className="h-4 w-4 text-neutral-500 mt-[3px] shrink-0" strokeWidth={2.5} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section id="principles" className="border-t border-white/10 bg-[#040404]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>PRINCIPLES</Eyebrow>
            <div className="mt-3">
              <TwoTone a="Rules of the dispatch." b="Every cycle, every task." />
            </div>
            <p className="mt-6 max-w-md text-neutral-400 leading-relaxed">
              The doctrine says how Synapse routes. The principles say why these rules exist
              in the first place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <article
                  key={p.n}
                  className="rounded-lg border border-white/10 bg-[#0a0908] p-7 flex flex-col h-full transition-colors duration-200 hover:border-orange-500/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-mono text-[11px] tracking-[0.22em] text-orange-500">{p.n}</div>
                    <Icon className="h-[22px] w-[22px] text-orange-500/70" strokeWidth={1.6} />
                  </div>
                  <div className="mt-1 h-px w-8 bg-orange-500/40" />
                  <h3 className="mt-4 text-lg font-semibold text-white tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-[14px] text-neutral-400 leading-relaxed">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ LAUNCH ============ */}
      <section id="launch" className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-32">
          <Eyebrow>LAUNCH</Eyebrow>
          <div className="mt-4 max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
              A token for an orchestrator that routes the right answer.
            </h2>
          </div>
          <p className="mt-6 max-w-2xl text-neutral-400 text-lg leading-relaxed">
            Synapse launches on Pump.fun as a fair launch. The contract address is pinned at
            the top of this page and fills the moment it drops.
          </p>
          <div className="mt-10">
            <a
              href="https://x.com/SynapticHQ"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-medium text-black hover:bg-orange-400 transition-colors"
            >
              Follow for the drop: X <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="border-t border-white/10 bg-[#040404]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
            Multi-agent orchestration you can verify.
          </h2>
          <p className="mt-5 text-neutral-400 text-lg">
            One task in. The right specialists. One ranked plan out.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-medium text-black hover:bg-orange-400 transition-colors"
            >
              Launch Synapse
            </a>
            <a
              href="https://github.com/SynapticHQ/Synapse"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white hover:border-white/40 hover:bg-white/[0.05] transition-colors"
            >
              View on GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.22em] text-neutral-500">SITE</div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                <li><a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#doctrine" className="hover:text-white transition-colors">Doctrine</a></li>
                <li><a href="#loop" className="hover:text-white transition-colors">Loop</a></li>
                <li><a href="#decision" className="hover:text-white transition-colors">Decision</a></li>
                <li><a href="#launch" className="hover:text-white transition-colors">Launch</a></li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.22em] text-neutral-500">PROJECT</div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                <li><a href="https://github.com/SynapticHQ/Synapse" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a></li>
                <li><a href="#dashboard" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="https://github.com/SynapticHQ/Synapse" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors">GitHub <ArrowUpRight className="h-3.5 w-3.5" /></a></li>
                <li><a href="https://x.com/SynapticHQ" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors">X <ArrowUpRight className="h-3.5 w-3.5" /></a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-5 flex flex-wrap items-center justify-between gap-y-2 font-mono text-[11px] tracking-[0.16em] text-neutral-500">
            <span>Synapse | SynapticHQ | © 2026</span>
            <span>v1.0 · live</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
