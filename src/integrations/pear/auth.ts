import { PEAR_CONFIG } from './config';
import type { PearAuthResponse } from './types';

const EXPIRY_BUFFER_MS = 60_000; // refresh 60s before expiry
const USER_ADDR_KEY = 'pear_user_address';

export async function authenticateWithPear(
  userAddress: string,
  signTypedData: (args: any) => Promise<string>
): Promise<PearAuthResponse> {
  const normalizedAddress = userAddress.toLowerCase();
  // Step 1: Get EIP712 message from server
  const messageResponse = await fetch(
    `${PEAR_CONFIG.apiUrl}/auth/eip712-message?address=${normalizedAddress}&clientId=${PEAR_CONFIG.clientId}`
  );

  if (!messageResponse.ok) {
    const error = await messageResponse.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Failed to get EIP712 message');
  }

  const eip712Data = await messageResponse.json();

  // Step 2: Sign the message
  const signature = await signTypedData({
    domain: eip712Data.domain,
    types: eip712Data.types,
    primaryType: eip712Data.primaryType,
    message: eip712Data.message,
  });

  // Step 3: Login with signature
  const loginResponse = await fetch(`${PEAR_CONFIG.apiUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'eip712',
      address: normalizedAddress,
      clientId: PEAR_CONFIG.clientId,
      details: {
        signature,
        timestamp: eip712Data.message.timestamp,
      },
    }),
  });

  if (!loginResponse.ok) {
    const error = await loginResponse.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Authentication failed');
  }

  const data = await loginResponse.json();

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
  };
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
  if (expectedUserAddress && storedAddr && storedAddr !== expectedUserAddress.toLowerCase()) {
    clearAuthTokens();
    return null;
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
