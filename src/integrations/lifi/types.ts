import type { Route } from '@lifi/sdk';

export interface BridgeRoute {
  route: Route;
  estimatedTime: number;
  gasCost: string;
  toAmount: string;
}

export interface BridgeStatus {
  status: 'idle' | 'fetching-routes' | 'ready' | 'executing' | 'success' | 'error';
  txHash?: string;
  error?: Error;
}
