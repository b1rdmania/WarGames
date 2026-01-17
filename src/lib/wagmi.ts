import { createConfig, http } from 'wagmi';
import { mainnet, arbitrum, base, optimism } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Define HyperEVM chain
export const hyperEVM = {
  id: 999,
  name: 'HyperEVM',
  network: 'hyperevm',
  nativeCurrency: {
    decimals: 18,
    name: 'HYPE',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
    public: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'HyperEVM Explorer', url: 'https://hyperevmscan.io' },
  },
} as const;

export const config = createConfig({
  chains: [mainnet, arbitrum, base, optimism, hyperEVM],
  connectors: [
    // Injected connector supports MetaMask, Rabby, Coinbase Wallet, Rainbow, and all other injected wallets
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [hyperEVM.id]: http('https://rpc.hyperliquid.xyz/evm'),
  },
});
