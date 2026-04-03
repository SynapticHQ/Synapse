import fs from "fs";
import path from "path";

export type LogLevel = "debug" | "info" | "warn" | "error";

const AUDIT_PATH = path.resolve("logs/audit.jsonl");
let stream: fs.WriteStream | null = null;

function getStream(): fs.WriteStream {
  if (!stream) {
    fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
    stream = fs.createWriteStream(AUDIT_PATH, { flags: "a" });
  }
  return stream;
}

const COLOR: Record<LogLevel, string> = {
  debug: "\x1b[90m",
  info:  "\x1b[36m",
  warn:  "\x1b[33m",
  error: "\x1b[31m",
};
const RESET = "\x1b[0m";

function emit(level: LogLevel, component: string, msg: string, data?: unknown) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    component,
    msg,
    ...(data !== undefined ? { data } : {}),
  };

  const line = `${entry.ts} ${COLOR[level]}[${level.toUpperCase().padEnd(5)}]${RESET} \x1b[35m[${component}]${RESET} ${msg}`;
  if (level === "error") console.error(line, data ?? "");
  else if (level === "warn") console.warn(line, data ?? "");
  else console.log(line, data ?? "");

  getStream().write(JSON.stringify(entry) + "\n");
}

export function createLogger(component: string) {
  return {
    debug: (msg: string, data?: unknown) => emit("debug", component, msg, data),
    info:  (msg: string, data?: unknown) => emit("info",  component, msg, data),
    warn:  (msg: string, data?: unknown) => emit("warn",  component, msg, data),
    error: (msg: string, data?: unknown) => emit("error", component, msg, data),
  };
}

export type Logger = ReturnType<typeof createLogger>;

