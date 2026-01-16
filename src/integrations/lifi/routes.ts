import { getRoutes } from '@lifi/sdk';
import { initLiFi } from './config';
import type { BridgeRoute } from './types';

export async function discoverRoutes(params: {
  fromChainId: number;
  fromTokenAddress: string;
  amount: string;
  userAddress: string;
}): Promise<BridgeRoute[]> {
  initLiFi();

  const result = await getRoutes({
    fromChainId: params.fromChainId,
    toChainId: 999, // HyperEVM
    fromTokenAddress: params.fromTokenAddress,
    toTokenAddress: '0xb88339cb7199b77e23db6e890353e22632ba630f', // USDC on HyperEVM
    fromAmount: params.amount,
    fromAddress: params.userAddress,
    toAddress: params.userAddress,
    options: {
      order: 'CHEAPEST',
      slippage: 0.005,
    },
  });

  return result.routes.map(route => ({
    route,
    estimatedTime: route.steps.reduce((acc, step) => acc + (step.estimate.executionDuration || 0), 0),
    gasCost: route.gasCostUSD || '0',
    toAmount: route.toAmount,
  }));
}
