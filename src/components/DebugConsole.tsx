'use client';

import { useEffect, useMemo, useState } from 'react';
import { emitDebugLog, onDebugLog, type DebugLogEntry, type DebugLogLevel } from '@/lib/debugLog';

function formatTs(ts: number) {
  const d = new Date(ts);
  return d.toISOString().slice(11, 23); // HH:MM:SS.mmm
}

function levelColor(level: DebugLogLevel) {
  if (level === 'error') return 'text-red-300';
  if (level === 'warn') return 'text-yellow-200';
  return 'text-gray-200';
}

export function DebugConsole() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DebugLogEntry[]>([]);

  useEffect(() => {
    return onDebugLog((e) => {
      setEntries((prev) => {
        const next = [...prev, e].slice(-250);
        return next;
      });
    });
  }, []);

  const copyText = useMemo(() => {
    return entries
      .map((e) => {
        const data = e.data ? ` ${JSON.stringify(e.data)}` : '';
        return `${formatTs(e.ts)} ${e.level.toUpperCase()} [${e.scope}] ${e.message}${data}`;
      })
      .join('\n');
  }, [entries]);

  return (
    <div className="bg-pear-panel pear-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-pear-lime font-mono">[ DEBUG CONSOLE ]</div>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="pear-border text-pear-lime px-3 py-2 text-xs hover:pear-glow"
          >
            {open ? 'HIDE' : 'SHOW'}
          </button>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(copyText);
                emitDebugLog({ level: 'info', scope: 'debug', message: 'Copied logs to clipboard' });
              } catch {
                // ignore
              }
            }}
            className="pear-border text-pear-lime px-3 py-2 text-xs hover:pear-glow"
          >
            COPY
          </button>
          <button
            onClick={() => {
              setEntries([]);
              emitDebugLog({ level: 'info', scope: 'debug', message: 'Cleared logs' });
            }}
            className="pear-border text-pear-lime px-3 py-2 text-xs hover:pear-glow"
          >
            CLEAR
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 bg-pear-dark border border-gray-700 p-3 h-64 overflow-auto text-[11px] font-mono">
          {entries.length === 0 ? (
            <div className="text-gray-500">No logs yet.</div>
          ) : (
            <div className="space-y-1">
              {entries.map((e, idx) => (
                <div key={`${e.ts}-${idx}`} className={levelColor(e.level)}>
                  <span className="text-gray-500">{formatTs(e.ts)}</span>{' '}
                  <span className="text-gray-400">{e.level.toUpperCase()}</span>{' '}
                  <span className="text-gray-400">[{e.scope}]</span> {e.message}
                  {e.data !== undefined && (
                    <span className="text-gray-500"> {JSON.stringify(e.data)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

