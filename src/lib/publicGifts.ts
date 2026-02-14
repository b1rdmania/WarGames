// Local asset aliases for use across live pages.
// Important: these must stay local/public paths (no remote URLs).
export const PUBLIC_GIFTS = {
  globe: '/gifs/globeLarge.gif',
  globeSmall: '/gifs/globeSmall.gif',
  rotatingDollar: '/gifs/cash.gif',
  coin: '/gifs/coin.gif',
  fire: '/gifs/fireSmall.gif',
  flameA: '/gifs/fire1.gif',
  flameB: '/gifs/fire3.gif',
  explosion: '/gifs/explosion.gif',
  sparkle: '/gifs/sparkle1.gif',
  monitor: '/gifs/computer.gif',
} as const;

export function marketGiftFor(marketId: string): string {
  const id = marketId.toLowerCase();

  if (id.includes('oil') || id.includes('energy')) return PUBLIC_GIFTS.fire;
  if (id.includes('ai') || id.includes('tech')) return PUBLIC_GIFTS.sparkle;
  if (id.includes('taiwan') || id.includes('strait') || id.includes('geo')) return PUBLIC_GIFTS.globeSmall;
  if (id.includes('risk') || id.includes('macro')) return PUBLIC_GIFTS.monitor;

  return PUBLIC_GIFTS.coin;
}
