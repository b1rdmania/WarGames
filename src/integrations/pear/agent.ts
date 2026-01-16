import { PEAR_CONFIG } from './config';

export interface AgentWalletInfo {
  address: string;
  balance: string; // USDC balance
  activePositions: number;
}

export async function getAgentWallet(jwtToken: string): Promise<AgentWalletInfo> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/agent-wallet`, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch agent wallet');
  }

  const data = await response.json();

  return {
    address: data.address,
    balance: data.balance,
    activePositions: data.activePositions || 0,
  };
}

export async function depositToAgent(
  jwtToken: string,
  amount: string
): Promise<{ txHash: string }> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/agent-wallet/deposit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Deposit failed');
  }

  return await response.json();
}
