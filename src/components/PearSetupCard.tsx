'use client';

import { usePear } from '@/hooks/usePear';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

export function PearSetupCard() {
  const { address, isConnected } = useAccount();
  const { runSetup, isAuthenticating, statusLine, agentWallet } = usePear();

  return (
    <div className="bg-gradient-to-br from-pear-panel via-pear-panel-light to-pear-panel rounded-2xl p-8 border border-pear-lime/20">
      <div className="space-y-6">
        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Setup Status</h3>
            <p className="text-sm text-gray-400">{statusLine || 'Ready to authenticate'}</p>
          </div>
          {isAuthenticating && (
            <div className="w-3 h-3 bg-pear-lime rounded-full animate-pulse" />
          )}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Wallet</div>
            <div className="text-sm text-white font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '—'}
            </div>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Agent Wallet</div>
            <div className="text-sm text-white font-mono">
              {agentWallet ? `${agentWallet.slice(0, 6)}...${agentWallet.slice(-4)}` : '—'}
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            runSetup(true).catch((e) => {
              console.error(e);
              toast.error((e as Error).message || 'Setup failed');
            });
          }}
          disabled={isAuthenticating || !isConnected}
          className="w-full bg-pear-lime hover:bg-pear-lime-light disabled:bg-gray-700 disabled:cursor-not-allowed text-pear-dark font-bold py-4 rounded-lg transition-all shadow-lg disabled:shadow-none"
        >
          {isAuthenticating ? 'Authenticating...' : 'Authenticate with Pear Protocol'}
        </button>
      </div>
    </div>
  );
}
