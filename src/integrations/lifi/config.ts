import { createConfig } from '@lifi/sdk';

let initialized = false;

export function initLiFi() {
  if (initialized) return;

  createConfig({
    integrator: 'WarMarkets',
    rpcUrls: {
      [999]: ['https://rpc.hyperliquid.xyz/evm']
    }
  });

  initialized = true;
}
