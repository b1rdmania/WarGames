import { PEAR_CONFIG } from './config';
import type { PearPosition, ExecutePositionParams } from './types';

export async function executePosition(
  jwtToken: string,
  params: ExecutePositionParams
): Promise<{ positionId: string; txHash: string }> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions/open`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to execute position');
  }

  return await response.json();
}

export async function getActivePositions(jwtToken: string): Promise<PearPosition[]> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions`, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch positions');
  }

  const data = await response.json();
  return data.positions || [];
}

export async function closePosition(
  jwtToken: string,
  positionId: string
): Promise<{ txHash: string; pnl: string }> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions/${positionId}/close`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to close position');
  }

  return await response.json();
}
