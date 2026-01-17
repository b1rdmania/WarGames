import { PEAR_CONFIG } from './config';
import { toPearApiError } from './errors';
import type { PearAuthResponse } from './types';

const EXPIRY_BUFFER_MS = 60_000; // refresh 60s before expiry
const USER_ADDR_KEY = 'pear_user_address';
const FALLBACK_CLIENT_ID = 'HLHackathon1';

export async function fetchEip712Message(address: string, clientId: string) {
  // Spec: docs/pear-docs/AUTHENTICATION.md (GET /auth/eip712-message)
  const endpoint = '/auth/eip712-message';
  const url = `${PEAR_CONFIG.apiUrl}${endpoint}?address=${encodeURIComponent(address)}&clientId=${encodeURIComponent(clientId)}`;
  const res = await fetch(url);
  if (!res.ok) throw await toPearApiError(res, endpoint);
  return res.json();
}

export async function getAuthEip712Message(address: string): Promise<{ eip712Data: any; clientId: string }> {
  const normalizedAddress = address.toLowerCase();
  let effectiveClientId = PEAR_CONFIG.clientId;
  try {
    const eip712Data = await fetchEip712Message(normalizedAddress, effectiveClientId);
    return { eip712Data, clientId: effectiveClientId };
  } catch (err) {
    // If the configured clientId is not accepted (401), fall back to the hackathon clientId.
    // This keeps the demo unblocked even if Vercel env var was misconfigured.
    if (
      err instanceof Error &&
      (err as any).status === 401 &&
      effectiveClientId !== FALLBACK_CLIENT_ID
    ) {
      effectiveClientId = FALLBACK_CLIENT_ID;
      const eip712Data = await fetchEip712Message(normalizedAddress, effectiveClientId);
      return { eip712Data, clientId: effectiveClientId };
    }
    throw err;
  }
}

export async function loginWithEip712Signature(args: {
  address: string;
  clientId: string;
  signature: string;
  timestamp: number;
}): Promise<PearAuthResponse> {
  // Spec: docs/pear-docs/AUTHENTICATION.md (POST /auth/login)
  const loginEndpoint = '/auth/login';
  const res = await fetch(`${PEAR_CONFIG.apiUrl}${loginEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'eip712',
      address: args.address.toLowerCase(),
      clientId: args.clientId,
      details: { signature: args.signature, timestamp: args.timestamp },
    }),
  });

  if (!res.ok) throw await toPearApiError(res, loginEndpoint);
  const data = await res.json();
  return { accessToken: data.accessToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn };
}

export function saveAuthTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  userAddress?: string
) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pear_access_token', accessToken);
    localStorage.setItem('pear_refresh_token', refreshToken);
    // Pear returns expiresIn in seconds (e.g. 900). Store expiry in ms.
    localStorage.setItem('pear_token_expiry', String(Date.now() + expiresIn * 1000));
    if (userAddress) {
      localStorage.setItem(USER_ADDR_KEY, userAddress.toLowerCase());
    }
  }
}

export function getStoredUserAddress(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ADDR_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('pear_token_expiry');
    if (expiry && Date.now() > parseInt(expiry)) {
      // Token expired
      return null;
    }
    return localStorage.getItem('pear_access_token');
  }
  return null;
}

function getTokenExpiryMs(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('pear_token_expiry');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function getValidAccessToken(expectedUserAddress?: string): Promise<string | null> {
  // If the connected wallet changed, do NOT reuse a JWT from a different address.
  const storedAddr = getStoredUserAddress();
  if (expectedUserAddress) {
    // If we have tokens but no stored address, it's an old/legacy session and we can't safely
    // assert the token belongs to the connected wallet. Force re-auth once.
    if (!storedAddr) {
      clearAuthTokens();
      return null;
    }
    if (storedAddr !== expectedUserAddress.toLowerCase()) {
      clearAuthTokens();
      return null;
    }
  }

  const accessToken = getAccessToken();
  const expiryMs = getTokenExpiryMs();

  // No token (or expired) → attempt refresh if possible.
  if (!accessToken || !expiryMs) {
    try {
      return await refreshAccessToken();
    } catch {
      return null;
    }
  }

  // Refresh early, before it expires, to avoid user-visible failures mid-flow.
  if (Date.now() > expiryMs - EXPIRY_BUFFER_MS) {
    try {
      return await refreshAccessToken();
    } catch {
      return null;
    }
  }

  return accessToken;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pear_refresh_token');
  }
  return null;
}

export function clearAuthTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pear_access_token');
    localStorage.removeItem('pear_refresh_token');
    localStorage.removeItem('pear_token_expiry');
    localStorage.removeItem(USER_ADDR_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${PEAR_CONFIG.apiUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    clearAuthTokens();
    throw new Error(error.error || error.message || 'Failed to refresh token');
  }

  const data = await response.json();
  // Preserve stored user address (if any) during refresh.
  saveAuthTokens(data.accessToken, data.refreshToken, data.expiresIn, getStoredUserAddress() ?? undefined);

  return data.accessToken;
}
