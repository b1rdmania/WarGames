import { createConfig, http } from 'wagmi';
import { mainnet, arbitrum, base, optimism } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

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

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
  coinbaseWallet({
    appName: 'WAR.MARKET',
  }),
];

if (walletConnectProjectId) {
  connectors.unshift(
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    })
  );
}

export const config = createConfig({
  chains: [mainnet, arbitrum, base, optimism, hyperEVM],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [hyperEVM.id]: http('https://rpc.hyperliquid.xyz/evm'),
  },
});
