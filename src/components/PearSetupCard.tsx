'use client';

import { usePear } from '@/contexts/PearContext';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

export function PearSetupCard() {
  const { address, isConnected } = useAccount();
  const { runSetup, isAuthenticating, statusLine, agentWallet } = usePear();

  return (
    <div className="pear-border bg-black/40 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-mono text-gray-300">[ SETUP STATUS ]</div>
          {isAuthenticating && <div className="w-2 h-2 bg-pear-lime rounded-full animate-pulse" />}
        </div>

        <div className="font-mono text-sm text-gray-400">
          {isAuthenticating ? (
            <span className="text-pear-lime">Authenticating…</span>
          ) : statusLine && statusLine !== 'IDLE' && statusLine !== 'READY' ? (
            statusLine
          ) : (
            'Ready to authenticate'
          )}
        </div>

        {/* Info cards */}
        <div className="pear-border bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4 border-b md:border-b-0 md:border-r border-pear-lime/20">
              <div className="text-xs font-mono text-gray-500 mb-2">YOUR WALLET</div>
              <div className="text-sm text-white font-mono">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '—'}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs font-mono text-gray-500 mb-2">AGENT WALLET</div>
              <div className="text-sm text-white font-mono">
                {agentWallet ? (
                  `${agentWallet.slice(0, 8)}...${agentWallet.slice(-6)}`
                ) : (
                  <span className="text-gray-500">Not created yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Helper text */}
        <div className="pear-border bg-black/20 p-4">
          <p className="text-sm text-gray-400 leading-relaxed">
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
          className="w-full pear-border pear-text py-3 font-mono text-sm hover:pear-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            'AUTHENTICATING…'
          ) : (
            'AUTHENTICATE WITH PEAR'
          )}
        </button>
      </div>
    </div>
  );
}
