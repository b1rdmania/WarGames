const DEFAULT_PEAR_APP_URL = 'https://app.pear.garden';

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
