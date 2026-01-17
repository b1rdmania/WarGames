import Link from 'next/link';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';

export default function AboutPage() {
  return (
    <RiskShell subtitle="ABOUT" nav={<TerminalTopNav />}>
      <div className="pear-border bg-black/40 p-6">
        <div className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-pear-lime">WAR.MARKET</div>
        <div className="mt-2 text-sm font-mono text-gray-400">
          Narrative trading on Hyperliquid. Bet on macro themes as leveraged long/short baskets.
        </div>

        <div className="mt-6 space-y-5 text-sm font-mono text-gray-400 leading-relaxed">
          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">HYPERLIQUID LONDON HACKATHON</div>
            <div>
              Built in 3 days for the Hyperliquid London Community Hackathon (Jan 16-18, 2026).
              Competing in <span className="text-white">Pear Execution API</span> and <span className="text-white">LI.FI Onboarding</span> tracks.
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">THE IDEA</div>
            <div>
              Trade narratives, not tickers. Instead of picking individual assets, bet on macro themes like
              "AI Bubble Pop" or "Taiwan Strait Crisis" — expressed as weighted long/short baskets
              executed atomically via Pear Protocol on Hyperliquid.
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">HOW IT WORKS</div>
            <div className="space-y-2">
              <div><span className="text-white">1.</span> Connect wallet on HyperEVM</div>
              <div><span className="text-white">2.</span> Authenticate with Pear (creates agent wallet)</div>
              <div><span className="text-white">3.</span> Pick a narrative market, choose YES or NO</div>
              <div><span className="text-white">4.</span> Pear executes the basket on Hyperliquid</div>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">TECH STACK</div>
            <div className="space-y-1">
              <div><span className="text-white">Pear Protocol</span> — Pair trading execution + agent wallets</div>
              <div><span className="text-white">Hyperliquid</span> — Settlement layer for perps</div>
              <div><span className="text-white">LI.FI</span> — Cross-chain bridging to HyperEVM</div>
              <div><span className="text-white">Next.js + wagmi</span> — Frontend</div>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">LINKS</div>
            <div className="flex flex-wrap gap-4">
              <a className="text-pear-lime underline" href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="text-pear-lime underline" href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                @b1rdmania
              </a>
              <a className="text-pear-lime underline" href="https://pearprotocol.io" target="_blank" rel="noreferrer">
                Pear Protocol
              </a>
              <a className="text-pear-lime underline" href="https://hyperliquid.xyz" target="_blank" rel="noreferrer">
                Hyperliquid
              </a>
              <a className="text-pear-lime underline" href="https://li.fi" target="_blank" rel="noreferrer">
                LI.FI
              </a>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">START TRADING</div>
            <Link className="text-pear-lime underline" href="/trade">
              Go to TRADE →
            </Link>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}

