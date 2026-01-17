import { PEAR_CONFIG } from './config';
import { toPearApiError } from './errors';

export interface AgentWalletInfo {
  address: string;
  exists: boolean;
}

export async function getAgentWallet(accessToken: string): Promise<AgentWalletInfo> {
  // Spec: docs/pear-docs/AGENT_WALLET.md (GET /agentWallet)
  const endpoint = '/agentWallet';
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/agentWallet`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return { address: '', exists: false };
  }

  if (!response.ok) {
    throw await toPearApiError(response, endpoint);
  }

  const data = await response.json();

  return {
    address: data.agentWalletAddress || data.address || data.walletAddress,
    exists: true,
  };
}

export async function createAgentWallet(accessToken: string): Promise<AgentWalletInfo> {
  // Spec: docs/pear-docs/AGENT_WALLET.md (POST /agentWallet)
  const endpoint = '/agentWallet';
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/agentWallet`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw await toPearApiError(response, endpoint);
  }

  const data = await response.json();

  return {
    address: data.agentWalletAddress || data.address || data.walletAddress,
    exists: true,
  };
}
