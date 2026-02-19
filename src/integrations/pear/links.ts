const DEFAULT_PEAR_APP_URL = 'https://app.pear.garden';
const DEFAULT_HYPERLIQUID_APP_URL = 'https://app.hyperliquid.xyz';

function normalizeBaseUrl(raw?: string): string {
  const source = (raw ?? '').trim() || DEFAULT_PEAR_APP_URL;
  return source.replace(/\/+$/, '');
}

export function getPearDashboardUrl(): string {
  return `${normalizeBaseUrl(process.env.NEXT_PUBLIC_PEAR_APP_URL)}/dashboard`;
}

export function getPearPositionUrl(positionId?: string): string {
  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_PEAR_APP_URL);
  const id = (positionId ?? '').trim();
  if (!id || id === 'unknown') return `${base}/dashboard`;
  return `${base}/positions/${encodeURIComponent(id)}`;
}

export function getHyperliquidPortfolioUrl(): string {
  const source = (process.env.NEXT_PUBLIC_HYPERLIQUID_APP_URL ?? '').trim() || DEFAULT_HYPERLIQUID_APP_URL;
  const base = source.replace(/\/+$/, '');
  return `${base}/portfolio`;
}
