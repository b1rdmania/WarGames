import { kv } from '@vercel/kv';
import type { DailyUsagePoint, StatsSummary, TradeStatEvent } from './types';

type MemoryDay = {
  attempted: number;
  successful: number;
  failed: number;
  notionalCents: number;
  wallets: Set<string>;
};

type MemoryStore = {
  attempted: number;
  successful: number;
  failed: number;
  notionalCents: number;
  wallets: Set<string>;
  daily: Map<string, MemoryDay>;
  markets: Map<string, { successfulTrades: number; notionalCents: number }>;
  recentEvents: Array<TradeStatEvent & { ts: number }>;
};

declare global {
  // eslint-disable-next-line no-var
  var __warMarketStatsStore: MemoryStore | undefined;
}

const hasKv =
  Boolean(process.env.KV_REST_API_URL) &&
  Boolean(process.env.KV_REST_API_TOKEN);

function getMemoryStore(): MemoryStore {
  if (!globalThis.__warMarketStatsStore) {
    globalThis.__warMarketStatsStore = {
      attempted: 0,
      successful: 0,
      failed: 0,
      notionalCents: 0,
      wallets: new Set<string>(),
      daily: new Map<string, MemoryDay>(),
      markets: new Map<string, { successfulTrades: number; notionalCents: number }>(),
      recentEvents: [],
    };
  }
  return globalThis.__warMarketStatsStore;
}

function toDay(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function cents(usd: number): number {
  return Math.max(0, Math.round(Number(usd || 0) * 100));
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeWallet(wallet?: string): string | null {
  if (!wallet) return null;
  const w = wallet.trim().toLowerCase();
  return w ? w : null;
}

function parseEventRow(raw: string): (TradeStatEvent & { ts: number }) | null {
  try {
    return JSON.parse(raw) as TradeStatEvent & { ts: number };
  } catch {
    return null;
  }
}

async function recordWithKv(event: TradeStatEvent, day: string, wallet: string | null, notionalCents: number) {
  const record: TradeStatEvent & { ts: number } = {
    ...event,
    ts: Number.isFinite(event.ts) ? Number(event.ts) : Date.now(),
    wallet: wallet ?? undefined,
  };
  await kv.lpush('wm:stats:events', JSON.stringify(record));
  await kv.ltrim('wm:stats:events', 0, 499);

  if (event.status === 'attempted') {
    await kv.hincrby('wm:stats:totals', 'attempted', 1);
    await kv.hincrby(`wm:stats:daily:${day}`, 'attempted', 1);
  }

  if (event.status === 'success') {
    await kv.hincrby('wm:stats:totals', 'successful', 1);
    await kv.hincrby('wm:stats:totals', 'notional_cents', notionalCents);
    await kv.hincrby(`wm:stats:daily:${day}`, 'successful', 1);
    await kv.hincrby(`wm:stats:daily:${day}`, 'notional_cents', notionalCents);
    await kv.hincrby('wm:stats:markets:count', event.marketId, 1);
    await kv.hincrby('wm:stats:markets:notional_cents', event.marketId, notionalCents);
  }

  if (event.status === 'failed') {
    await kv.hincrby('wm:stats:totals', 'failed', 1);
    await kv.hincrby(`wm:stats:daily:${day}`, 'failed', 1);
  }

  if (wallet) {
    await kv.sadd('wm:stats:wallets:all', wallet);
    await kv.sadd(`wm:stats:daily:${day}:wallets`, wallet);
  }
}

function recordWithMemory(event: TradeStatEvent, day: string, wallet: string | null, notionalCents: number) {
  const store = getMemoryStore();
  const record: TradeStatEvent & { ts: number } = {
    ...event,
    ts: Number.isFinite(event.ts) ? Number(event.ts) : Date.now(),
    wallet: wallet ?? undefined,
  };
  store.recentEvents.unshift(record);
  if (store.recentEvents.length > 500) store.recentEvents.length = 500;

  if (!store.daily.has(day)) {
    store.daily.set(day, { attempted: 0, successful: 0, failed: 0, notionalCents: 0, wallets: new Set<string>() });
  }
  const daily = store.daily.get(day)!;

  if (event.status === 'attempted') {
    store.attempted += 1;
    daily.attempted += 1;
  }
  if (event.status === 'success') {
    store.successful += 1;
    store.notionalCents += notionalCents;
    daily.successful += 1;
    daily.notionalCents += notionalCents;
    const market = store.markets.get(event.marketId) ?? { successfulTrades: 0, notionalCents: 0 };
    market.successfulTrades += 1;
    market.notionalCents += notionalCents;
    store.markets.set(event.marketId, market);
  }
  if (event.status === 'failed') {
    store.failed += 1;
    daily.failed += 1;
  }
  if (wallet) {
    store.wallets.add(wallet);
    daily.wallets.add(wallet);
  }
}

export async function recordTradeStatEvent(event: TradeStatEvent): Promise<void> {
  const ts = Number.isFinite(event.ts) ? Number(event.ts) : Date.now();
  const day = toDay(ts);
  const wallet = normalizeWallet(event.wallet);
  const notionalCents = cents(event.notionalUsd);

  if (hasKv) {
    await recordWithKv(event, day, wallet, notionalCents);
    return;
  }

  recordWithMemory(event, day, wallet, notionalCents);
}

async function summaryFromKv(days: number): Promise<StatsSummary> {
  const totals = (await kv.hgetall<Record<string, unknown>>('wm:stats:totals')) ?? {};
  const marketCounts = (await kv.hgetall<Record<string, unknown>>('wm:stats:markets:count')) ?? {};
  const marketNotional = (await kv.hgetall<Record<string, unknown>>('wm:stats:markets:notional_cents')) ?? {};

  const daily: DailyUsagePoint[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i -= 1) {
    const dayTs = now - i * 24 * 60 * 60 * 1000;
    const date = toDay(dayTs);
    const dayTotals = (await kv.hgetall<Record<string, unknown>>(`wm:stats:daily:${date}`)) ?? {};
    const uniqueWallets = await kv.scard(`wm:stats:daily:${date}:wallets`);
    daily.push({
      date,
      attempted: num(dayTotals.attempted),
      successful: num(dayTotals.successful),
      failed: num(dayTotals.failed),
      notionalUsd: num(dayTotals.notional_cents) / 100,
      uniqueWallets: num(uniqueWallets),
    });
  }

  const topMarkets = Object.keys(marketCounts)
    .map((marketId) => ({
      marketId,
      successfulTrades: num(marketCounts[marketId]),
      notionalUsd: num(marketNotional[marketId]) / 100,
    }))
    .sort((a, b) => b.notionalUsd - a.notionalUsd)
    .slice(0, 8);

  return {
    totals: {
      attempted: num(totals.attempted),
      successful: num(totals.successful),
      failed: num(totals.failed),
      notionalUsd: num(totals.notional_cents) / 100,
      uniqueWallets: num(await kv.scard('wm:stats:wallets:all')),
    },
    daily,
    topMarkets,
    storage: 'kv',
  };
}

function summaryFromEvents(
  events: Array<TradeStatEvent & { ts: number }>,
  days: number,
  storage: 'kv' | 'memory'
): StatsSummary {
  const now = Date.now();
  const oldestTs = now - (days - 1) * 24 * 60 * 60 * 1000;
  const filtered = events.filter((evt) => Number.isFinite(evt.ts) && evt.ts >= oldestTs);

  const dailyMap = new Map<string, DailyUsagePoint>();
  const marketMap = new Map<string, { successfulTrades: number; notionalUsd: number }>();
  const wallets = new Set<string>();
  let attempted = 0;
  let successful = 0;
  let failed = 0;
  let notionalUsd = 0;

  for (const evt of filtered) {
    const day = toDay(evt.ts);
    const daily = dailyMap.get(day) ?? {
      date: day,
      attempted: 0,
      successful: 0,
      failed: 0,
      notionalUsd: 0,
      uniqueWallets: 0,
    };
    if (evt.status === 'attempted') {
      attempted += 1;
      daily.attempted += 1;
    }
    if (evt.status === 'success') {
      successful += 1;
      const n = Number(evt.notionalUsd) || 0;
      notionalUsd += n;
      daily.successful += 1;
      daily.notionalUsd += n;
      const market = marketMap.get(evt.marketId) ?? { successfulTrades: 0, notionalUsd: 0 };
      market.successfulTrades += 1;
      market.notionalUsd += n;
      marketMap.set(evt.marketId, market);
    }
    if (evt.status === 'failed') {
      failed += 1;
      daily.failed += 1;
    }
    if (evt.wallet) {
      wallets.add(evt.wallet.toLowerCase());
    }
    dailyMap.set(day, daily);
  }

  const daily: DailyUsagePoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = toDay(now - i * 24 * 60 * 60 * 1000);
    const d = dailyMap.get(date);
    daily.push({
      date,
      attempted: d?.attempted ?? 0,
      successful: d?.successful ?? 0,
      failed: d?.failed ?? 0,
      notionalUsd: d?.notionalUsd ?? 0,
      uniqueWallets: d?.uniqueWallets ?? 0,
    });
  }

  // Recompute day-level unique wallets from filtered events.
  const dailyWallets = new Map<string, Set<string>>();
  for (const evt of filtered) {
    if (!evt.wallet) continue;
    const day = toDay(evt.ts);
    if (!dailyWallets.has(day)) dailyWallets.set(day, new Set<string>());
    dailyWallets.get(day)!.add(evt.wallet.toLowerCase());
  }
  for (const row of daily) {
    row.uniqueWallets = dailyWallets.get(row.date)?.size ?? 0;
  }

  const topMarkets = Array.from(marketMap.entries())
    .map(([marketId, data]) => ({ marketId, successfulTrades: data.successfulTrades, notionalUsd: data.notionalUsd }))
    .sort((a, b) => b.notionalUsd - a.notionalUsd)
    .slice(0, 8);

  return {
    totals: {
      attempted,
      successful,
      failed,
      notionalUsd,
      uniqueWallets: wallets.size,
    },
    daily,
    topMarkets,
    storage,
  };
}

function summaryFromMemory(days: number): StatsSummary {
  const store = getMemoryStore();
  const daily: DailyUsagePoint[] = [];
  const now = Date.now();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = toDay(now - i * 24 * 60 * 60 * 1000);
    const d = store.daily.get(date);
    daily.push({
      date,
      attempted: d?.attempted ?? 0,
      successful: d?.successful ?? 0,
      failed: d?.failed ?? 0,
      notionalUsd: (d?.notionalCents ?? 0) / 100,
      uniqueWallets: d?.wallets.size ?? 0,
    });
  }

  const topMarkets = Array.from(store.markets.entries())
    .map(([marketId, data]) => ({
      marketId,
      successfulTrades: data.successfulTrades,
      notionalUsd: data.notionalCents / 100,
    }))
    .sort((a, b) => b.notionalUsd - a.notionalUsd)
    .slice(0, 8);

  return {
    totals: {
      attempted: store.attempted,
      successful: store.successful,
      failed: store.failed,
      notionalUsd: store.notionalCents / 100,
      uniqueWallets: store.wallets.size,
    },
    daily,
    topMarkets,
    storage: 'memory',
  };
}

export async function getStatsSummary(days = 30, opts?: { wallet?: string }): Promise<StatsSummary> {
  const window = Math.max(7, Math.min(60, Math.floor(days)));
  const wallet = normalizeWallet(opts?.wallet);
  if (wallet) {
    const events = await getRecentTradeStatEvents(500, wallet);
    return summaryFromEvents(events, window, hasKv ? 'kv' : 'memory');
  }
  if (hasKv) return summaryFromKv(window);
  return summaryFromMemory(window);
}

export async function getRecentTradeStatEvents(limit = 50, wallet?: string): Promise<Array<TradeStatEvent & { ts: number }>> {
  const max = Math.max(1, Math.min(200, Math.floor(limit)));
  const normalizedWallet = wallet?.trim().toLowerCase();

  if (hasKv) {
    const rows = await kv.lrange<string>('wm:stats:events', 0, Math.max(max * 4, 100) - 1);
    const parsed = rows
      .map(parseEventRow)
      .filter((x): x is TradeStatEvent & { ts: number } => Boolean(x))
      .filter((evt) => (normalizedWallet ? evt.wallet?.toLowerCase() === normalizedWallet : true))
      .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
      .slice(0, max);
    return parsed;
  }

  const store = getMemoryStore();
  return store.recentEvents
    .filter((evt) => (normalizedWallet ? evt.wallet?.toLowerCase() === normalizedWallet : true))
    .slice(0, max);
}
