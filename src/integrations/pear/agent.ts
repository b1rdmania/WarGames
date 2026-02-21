import { PEAR_CONFIG } from './config';
import { toPearApiError } from './errors';

export interface AgentWalletInfo {
  address: string;
  exists: boolean;
  approvalStatus: 'unknown' | 'pending' | 'approved';
}

function inferApprovalStatus(data: Record<string, unknown>, opts?: { fromCreate?: boolean }): AgentWalletInfo['approvalStatus'] {
  const boolKeysApproved = ['isApproved', 'approved', 'agentWalletApproved', 'isAgentApproved'];
  for (const key of boolKeysApproved) {
    if (typeof data[key] === 'boolean') {
      return data[key] ? 'approved' : 'pending';
    }
  }

  const boolKeysPending = ['approvalRequired', 'requiresApproval', 'needsApproval', 'pendingApproval'];
  for (const key of boolKeysPending) {
    if (data[key] === true) return 'pending';
  }

  const status = String(data.status ?? data.approvalStatus ?? '').toLowerCase();
  if (status.includes('approved') || status.includes('active') || status.includes('enabled')) return 'approved';
  if (status.includes('pending') || status.includes('await') || status.includes('approve')) return 'pending';

  const message = String(data.message ?? '').toLowerCase();
  if (message.includes('approve this agent wallet') || message.includes('enable trading')) return 'pending';

  if (opts?.fromCreate) return 'pending';
  return 'unknown';
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
    return { address: '', exists: false, approvalStatus: 'unknown' };
  }

  if (!response.ok) {
    throw await toPearApiError(response, endpoint);
  }

  const data = await response.json();

  return {
    address: data.agentWalletAddress || data.address || data.walletAddress,
    exists: true,
    approvalStatus: inferApprovalStatus(data),
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
    approvalStatus: inferApprovalStatus(data, { fromCreate: true }),
  };
}
