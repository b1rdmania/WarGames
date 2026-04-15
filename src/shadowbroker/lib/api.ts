// Proxied through Next.js: `src/app/api/shadowbroker/[...path]/route.ts` forwards to
// `SHADOWBROKER_BACKEND_URL` + `/api/{path}` (same contract as upstream Shadowbroker).

export const API_BASE = '/api/shadowbroker';

/**
 * Map an upstream backend path (`/api/...`) to the WAR.MARKET proxy URL.
 * Example: `/api/live-data/fast` → `/api/shadowbroker/live-data/fast`
 */
export function sbApi(backendPath: string): string {
  if (backendPath.startsWith('/api/')) {
    return `${API_BASE}${backendPath.slice(4)}`;
  }
  if (backendPath.startsWith('api/')) {
    return `${API_BASE}/${backendPath.slice(4)}`;
  }
  throw new Error(`sbApi: expected path starting with /api/, got ${backendPath}`);
}
