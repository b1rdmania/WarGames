import type { TradeStatEvent } from './types';

export async function logTradeStatEvent(event: TradeStatEvent): Promise<void> {
  try {
    await fetch('/api/stats/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // Non-blocking analytics path.
  }
}
