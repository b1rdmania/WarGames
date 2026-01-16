import { PEAR_CONFIG, EIP712_DOMAIN, EIP712_TYPES } from './config';
import type { PearAuthResponse } from './types';

export async function authenticateWithPear(
  userAddress: string,
  signTypedData: (args: any) => Promise<string>
): Promise<PearAuthResponse> {
  const timestamp = Math.floor(Date.now() / 1000);

  // Create EIP-712 message
  const message = {
    userAddress,
    timestamp,
  };

  // Sign with wallet
  const signature = await signTypedData({
    domain: EIP712_DOMAIN,
    types: EIP712_TYPES,
    primaryType: 'Authentication',
    message,
  });

  // Exchange signature for JWT
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userAddress,
      timestamp,
      signature,
      clientId: PEAR_CONFIG.clientId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Authentication failed');
  }

  const data = await response.json();

  return {
    jwtToken: data.jwtToken,
    agentWalletAddress: data.agentWalletAddress,
  };
}

export function saveAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pear_jwt', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pear_jwt');
  }
  return null;
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pear_jwt');
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
