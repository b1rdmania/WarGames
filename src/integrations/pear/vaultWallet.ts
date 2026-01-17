import { PEAR_CONFIG } from './config';

export interface VaultBalances {
  spotBalances: Record<string, string>;
  perpBalances: Record<string, string>;
  totalValue: string;
}

async function parsePearError(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({}));
  return data.error || data.message || `Request failed (${res.status})`;
}

export async function getVaultBalances(accessToken: string): Promise<VaultBalances> {
  const res = await fetch(`${PEAR_CONFIG.apiUrl}/vault-wallet/balances`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(await parsePearError(res));
  }

  return res.json();
}

export async function spotToPerp(accessToken: string, amount: string, asset: string = 'USDC') {
  const res = await fetch(`${PEAR_CONFIG.apiUrl}/vault-wallet/spot-to-perp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, asset }),
  });

  if (!res.ok) {
    throw new Error(await parsePearError(res));
  }

  return res.json();
}

export async function perpToSpot(accessToken: string, amount: string, asset: string = 'USDC') {
  const res = await fetch(`${PEAR_CONFIG.apiUrl}/vault-wallet/perp-to-spot`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, asset }),
  });

  if (!res.ok) {
    throw new Error(await parsePearError(res));
  }

  return res.json();
}

