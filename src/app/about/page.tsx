import Link from 'next/link';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';

export default function AboutPage() {
  return (
    <RiskShell subtitle="ABOUT" nav={<TerminalTopNav />}>
      <div className="pear-border bg-black/40 p-6">
        <div className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-pear-lime">ABOUT WAR.MARKET</div>
        <div className="mt-2 text-sm font-mono text-gray-400">
          A terminal for trading global stress. Narrative baskets executed via Pear on Hyperliquid.
        </div>

        <div className="mt-6 space-y-5 text-sm font-mono text-gray-400 leading-relaxed">
          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">THE PROBLEM</div>
            <div>
              Trading global risk is fragmented. Oil, FX, tech beta, and “risk‑off” all live in separate silos.
              You react to noise instead of the signal.
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">THE RESPONSE</div>
            <div>
              WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
              No interpretation layer — just volatility packaged into clear long/short structures.
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">THE MARKETS</div>
            <div className="space-y-2">
              <div>Each market is a readable macro narrative expressed as a leveraged long/short basket.</div>
              <div>
                You’re betting on <span className="text-white">relative performance</span>, not absolute direction.
              </div>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">HOW IT WORKS</div>
            <div className="space-y-2">
              <div><span className="text-white">1.</span> Browse markets (intel only)</div>
              <div><span className="text-white">2.</span> Connect wallet when you want to trade</div>
              <div><span className="text-white">3.</span> Authenticate with Pear (non‑custodial agent wallet)</div>
              <div><span className="text-white">4.</span> Pear executes basket legs on Hyperliquid</div>
              <div><span className="text-white">5.</span> Monitor + cash out from the terminal</div>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">THE ENGINE</div>
            <div className="space-y-1">
              <div><span className="text-white">Pear Protocol</span> — execution + agent wallets</div>
              <div><span className="text-white">Hyperliquid</span> — perp settlement layer</div>
              <div><span className="text-white">Next.js + wagmi</span> — terminal UI</div>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">WHO IT’S FOR</div>
            <div className="space-y-1">
              <div>Traders who want a clean signal.</div>
              <div>People who want macro hedges without TradFi rails.</div>
              <div>Degens who prefer one button and a thesis.</div>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">THE GOAL</div>
            <div>A clean way to trade global stress.</div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">BUILT BY</div>
            <div>
              <a className="text-pear-lime underline" href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                @b1rdmania
              </a>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">MUSIC</div>
            <div>
              Created with{' '}
              <a className="text-pear-lime underline" href="https://wario.style" target="_blank" rel="noreferrer">
                wario.style
              </a>
              {' '}— a Gameboy MIDI emulator I built over Xmas.
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">LINKS</div>
            <div className="flex flex-wrap gap-4">
              <a className="text-pear-lime underline" href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="text-pear-lime underline" href="https://pearprotocol.io" target="_blank" rel="noreferrer">
                Pear Protocol
              </a>
              <a className="text-pear-lime underline" href="https://hyperliquid.xyz" target="_blank" rel="noreferrer">
                Hyperliquid
              </a>
            </div>
          </div>

          <div>
            <div className="text-pear-lime font-bold tracking-widest mb-2">START</div>
            <div className="flex flex-wrap gap-4">
              <Link className="text-pear-lime underline" href="/markets">
                Browse MARKETS →
              </Link>
              <Link className="text-pear-lime underline" href="/trade">
                Open TRADE →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}

