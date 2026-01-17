import Link from 'next/link';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';

export default function AboutPage() {
  return (
    <RiskShell subtitle="ABOUT" nav={<TerminalTopNav />}>
      <div className="pear-border bg-black/40 p-6">
        <div className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-pear-lime">WAR.MARKET</div>
        <div className="mt-2 text-sm font-mono text-gray-400">
          Bet on narratives that move markets — expressed as leveraged long/short baskets executed via Pear Protocol.
        </div>

        <div className="mt-6 space-y-5 text-sm font-mono text-gray-400 leading-relaxed">
          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">HOW IT WORKS</div>
            <div>
              You connect a wallet, authenticate via Pear’s EIP-712 flow, and create an agent wallet. When you place a bet,
              Pear executes the underlying basket on Hyperliquid.
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">QUICK LINKS</div>
            <div className="space-x-4">
              <a className="text-pear-lime underline" href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="text-pear-lime underline" href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                X
              </a>
              <a className="text-pear-lime underline" href="https://pearprotocol.io" target="_blank" rel="noreferrer">
                Pear
              </a>
              <a className="text-pear-lime underline" href="https://hyperliquid.xyz" target="_blank" rel="noreferrer">
                Hyperliquid
              </a>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">START</div>
            <Link className="text-pear-lime underline" href="/trade">
              Go to TRADE →
            </Link>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}

