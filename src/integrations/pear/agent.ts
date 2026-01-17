import { PEAR_CONFIG } from './config';

export interface AgentWalletInfo {
  address: string;
  exists: boolean;
}

export async function getAgentWallet(accessToken: string): Promise<AgentWalletInfo> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/agentWallet`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('Unauthorized fetching agent wallet. Please re-authenticate (signature) and try again.');
  }

  if (response.status === 404) {
    return { address: '', exists: false };
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Failed to fetch agent wallet');
  }

  const data = await response.json();

  return {
    address: data.agentWalletAddress || data.address || data.walletAddress,
    exists: true,
  };
}

export async function createAgentWallet(accessToken: string): Promise<AgentWalletInfo> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/agentWallet`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized creating agent wallet. Please re-authenticate (signature) and try again.');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Failed to create agent wallet');
  }

  const data = await response.json();

  return {
    address: data.agentWalletAddress || data.address || data.walletAddress,
    exists: true,
  };
}
