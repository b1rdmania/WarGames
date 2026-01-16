import { PEAR_CONFIG } from './config';
import type { PearAuthResponse } from './types';

export async function authenticateWithPear(
  userAddress: string,
  signTypedData: (args: any) => Promise<string>
): Promise<PearAuthResponse> {
  // Step 1: Get EIP712 message from server
  const messageResponse = await fetch(
    `${PEAR_CONFIG.apiUrl}/auth/eip712-message?address=${userAddress}&clientId=${PEAR_CONFIG.clientId}`
  );

  if (!messageResponse.ok) {
    throw new Error('Failed to get EIP712 message');
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
      address: userAddress,
      clientId: PEAR_CONFIG.clientId,
      details: {
        signature,
        timestamp: eip712Data.message.timestamp,
      },
    }),
  });

  if (!loginResponse.ok) {
    const error = await loginResponse.json().catch(() => ({}));
    throw new Error(error.message || 'Authentication failed');
  }

  const data = await loginResponse.json();

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
  };
}

export function saveAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pear_access_token', accessToken);
    localStorage.setItem('pear_refresh_token', refreshToken);
    localStorage.setItem('pear_token_expiry', String(Date.now() + 900000)); // 15 min
  }
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
    clearAuthTokens();
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  saveAuthTokens(data.accessToken, data.refreshToken);

  return data.accessToken;
}
