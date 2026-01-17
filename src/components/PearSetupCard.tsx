'use client';

import { usePear } from '@/contexts/PearContext';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

export function PearSetupCard() {
  const { address, isConnected } = useAccount();
  const { runSetup, isAuthenticating, statusLine, agentWallet } = usePear();

  return (
    <div className="bg-gradient-to-br from-pear-panel via-pear-panel-light to-pear-panel rounded-2xl p-10 border border-pear-lime/30 shadow-2xl">
      <div className="space-y-8">
        {/* Status indicator */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">Setup Status</h3>
              {isAuthenticating && (
                <div className="w-2.5 h-2.5 bg-pear-lime rounded-full animate-pulse" />
              )}
            </div>
            <p className="text-base text-gray-300">
              {isAuthenticating ? (
                <span className="text-pear-lime">Authenticating...</span>
              ) : statusLine && statusLine !== 'IDLE' && statusLine !== 'READY' ? (
                statusLine
              ) : (
                'Ready to authenticate'
              )}
            </p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-pear-lime/10 hover:border-pear-lime/30 transition-all">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Your Wallet
            </div>
            <div className="text-base text-white font-mono">
              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '—'}
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-pear-lime/10 hover:border-pear-lime/30 transition-all">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Agent Wallet
            </div>
            <div className="text-base text-white font-mono">
              {agentWallet ? (
                `${agentWallet.slice(0, 8)}...${agentWallet.slice(-6)}`
              ) : (
                <span className="text-gray-600">Not created yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Helper text */}
        <div className="bg-pear-lime/5 border border-pear-lime/20 rounded-lg p-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            Sign a message to create your trading session with Pear Protocol.
            Your agent wallet will be created automatically.
          </p>
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
          className="w-full bg-pear-lime hover:bg-pear-lime-light disabled:bg-gray-700 disabled:cursor-not-allowed text-pear-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:shadow-none text-lg"
        >
          {isAuthenticating ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-pear-dark border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </span>
          ) : (
            'Authenticate with Pear Protocol'
          )}
        </button>
      </div>
    </div>
  );
}
