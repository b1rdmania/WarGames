export type DebugLogLevel = 'info' | 'warn' | 'error';

export interface DebugLogEntry {
  ts: number;
  level: DebugLogLevel;
  scope: string;
  message: string;
  data?: unknown;
}

const EVENT_NAME = 'war_debug_log';

function safeData(data: unknown): unknown {
  // Avoid ever logging secrets; aggressively strip likely token fields.
  if (!data || typeof data !== 'object') return data;
  // If it's an array, keep it as-is (avoid type/shape confusion).
  if (Array.isArray(data)) return data;

  const obj = data as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = k.toLowerCase();
    out[k] = key.includes('token') || key.includes('authorization') ? '[redacted]' : v;
  }
  return out;
}

export function emitDebugLog(entry: Omit<DebugLogEntry, 'ts'> & { ts?: number }) {
  if (typeof window === 'undefined') return;
  const full: DebugLogEntry = {
    ts: entry.ts ?? Date.now(),
    level: entry.level,
    scope: entry.scope,
    message: entry.message,
    data: safeData(entry.data),
  };
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: full }));
}

export function onDebugLog(handler: (e: DebugLogEntry) => void) {
  if (typeof window === 'undefined') return () => {};
  const listener = (evt: Event) => {
    const ce = evt as CustomEvent;
    handler(ce.detail as DebugLogEntry);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

