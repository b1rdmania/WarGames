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

async function recordWithKv(event: TradeStatEvent, day: string, wallet: string | null, notionalCents: number) {
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

export async function getStatsSummary(days = 30): Promise<StatsSummary> {
  const window = Math.max(7, Math.min(60, Math.floor(days)));
  if (hasKv) return summaryFromKv(window);
  return summaryFromMemory(window);
}
