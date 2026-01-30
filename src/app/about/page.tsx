import Link from 'next/link';
import type { Metadata } from 'next';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';

export const metadata: Metadata = {
  title: 'About',
  description:
    'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  openGraph: {
    title: 'About — WAR.MARKET',
    description:
      'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  },
  twitter: {
    title: 'About — WAR.MARKET',
    description:
      'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  },
};

export default function AboutPage() {
  return (
    <RiskShell nav={<TerminalTopNav />}>
      <div className="tp-wrap">
        <div className="tp-frame">
          <div className="tp-hero">
            <div className="tp-title">ABOUT WAR.MARKET</div>
            <div className="tp-lede">
              A terminal for trading global stress.
              <br />
              Narrative baskets executed via Pear on Hyperliquid.
            </div>
          </div>

          <div className="tp-rule" />

          <div className="tp-section">
            <div className="tp-h">THE PROBLEM</div>
            <div className="tp-body">
              Trading global risk is fragmented. Oil, FX, tech beta, and “risk‑off” all live in separate silos.
              You react to noise instead of the signal.
            </div>
          </div>

          <div className="tp-section">
            <div className="tp-h">THE RESPONSE</div>
            <div className="tp-body">
              WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
              No interpretation layer — just volatility packaged into clear long/short structures.
            </div>
          </div>

          <div className="tp-section">
            <div className="tp-h">THE MARKETS</div>
            <div className="tp-body">
              Each market is a readable macro narrative expressed as a leveraged long/short basket.
              <br />
              You’re betting on <span className="text-white">relative performance</span>, not absolute direction.
            </div>
          </div>

          <div className="tp-section">
            <div className="tp-h">HOW IT WORKS</div>
            <ul className="tp-bullets tp-body">
              <li>Browse markets (intel only)</li>
              <li>Connect wallet when you want to trade</li>
              <li>Authenticate with Pear (non‑custodial agent wallet)</li>
              <li>Pear executes basket legs on Hyperliquid</li>
              <li>Monitor + cash out from the terminal</li>
            </ul>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section grid gap-8 md:grid-cols-2">
            <div>
              <div className="tp-h">THE ENGINE</div>
              <div className="tp-kv">
                <div className="tp-kv-row">
                  <div className="tp-kv-k">Execution</div>
                  <div className="tp-kv-v">Pear Protocol (agent wallets)</div>
                </div>
                <div className="tp-kv-row">
                  <div className="tp-kv-k">Settlement</div>
                  <div className="tp-kv-v">Hyperliquid perps</div>
                </div>
                <div className="tp-kv-row">
                  <div className="tp-kv-k">Interface</div>
                  <div className="tp-kv-v">Next.js + wagmi</div>
                </div>
              </div>
            </div>

            <div>
              <div className="tp-h">WHO IT’S FOR</div>
              <ul className="tp-bullets tp-body">
                <li>Traders who want a clean signal.</li>
                <li>People who want macro hedges without TradFi rails.</li>
                <li>Degens who prefer one button and a thesis.</li>
              </ul>
            </div>
          </div>

          <div className="tp-section">
            <div className="tp-h">THE GOAL</div>
            <div className="tp-body">A clean way to trade global stress.</div>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section">
            <div className="tp-h">ROADMAP</div>
            <ul className="tp-bullets tp-body">
              <li>Win hackathon</li>
              <li>UX redesign for production</li>
              <li>Audit / codebase review</li>
              <li>Quant advice on market structures</li>
              <li>Integrate charts from HL</li>
              <li>Custom historic charts per market</li>
              <li>Build GTM team of rabid degens</li>
              <li>Launch X</li>
              <li>Go LIVE</li>
              <li>$WAR token</li>
              <li>Raise stake for HIP-3 auction</li>
              <li>HIP-3 markets for novel WAR indices</li>
              <li>World Peace</li>
            </ul>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section grid gap-8 md:grid-cols-2">
            <div>
              <div className="tp-h">BUILT BY</div>
              <div className="tp-body">
                <a className="text-pear-lime underline" href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                  @b1rdmania
                </a>
              </div>

              <div className="tp-section">
                <div className="tp-h">MUSIC</div>
                <div className="tp-body">
                  Created with{' '}
                  <a className="text-pear-lime underline" href="https://wario.style" target="_blank" rel="noreferrer">
                    wario.style
                  </a>{' '}
                  — a Gameboy MIDI emulator I built over Xmas.
                </div>
              </div>
            </div>

            <div>
              <div className="tp-h">LINKS</div>
              <div className="tp-body flex flex-wrap items-center">
                <a
                  className="text-pear-lime underline whitespace-nowrap"
                  href="https://github.com/b1rdmania/WarGames"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <span className="mx-3 text-gray-600">·</span>
                <a
                  className="text-pear-lime underline whitespace-nowrap"
                  href="https://www.pear.garden/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pear Protocol
                </a>
                <span className="mx-3 text-gray-600">·</span>
                <a
                  className="text-pear-lime underline whitespace-nowrap"
                  href="https://hyperliquid.xyz"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hyperliquid
                </a>
              </div>

              <div className="tp-section">
                <div className="tp-h">START</div>
                <ul className="tp-bullets tp-body">
                  <li>
                    <Link className="text-pear-lime underline" href="/markets">
                      Browse MARKETS →
                    </Link>
                  </li>
                  <li>
                    <Link className="text-pear-lime underline" href="/trade">
                      Open TRADE →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}

