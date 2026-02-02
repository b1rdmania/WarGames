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
          {/* Page Header */}
          <div className="tp-hero">
            <h1 className="tp-title">About</h1>
            <p className="tp-lede">
              A terminal for trading global stress.<br />
              Narrative baskets executed via Pear on Hyperliquid.
            </p>
          </div>

          <div className="tp-rule" style={{ marginTop: 0 }} />

          {/* The Problem */}
          <section className="tp-section">
            <h2 className="tp-h">The problem</h2>
            <p className="tp-body">
              Trading global risk is fragmented. Oil, FX, tech beta, and "risk‑off" all live in separate silos.
              You react to noise instead of the signal.
            </p>
          </section>

          {/* The Response */}
          <section className="tp-section">
            <h2 className="tp-h">The response</h2>
            <p className="tp-body">
              WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
              No interpretation layer—just volatility packaged into clear long/short structures.
            </p>
          </section>

          {/* The Markets */}
          <section className="tp-section">
            <h2 className="tp-h">The markets</h2>
            <p className="tp-body">
              Each market is a readable macro narrative expressed as a leveraged long/short basket.
              You're betting on <strong>relative performance</strong>, not absolute direction.
            </p>
          </section>

          {/* How It Works */}
          <section className="tp-section">
            <h2 className="tp-h">How it works</h2>
            <ul className="tp-bullets">
              <li>Browse markets (intel only)</li>
              <li>Connect wallet when you want to trade</li>
              <li>Authenticate with Pear (non‑custodial agent wallet)</li>
              <li>Pear executes basket legs on Hyperliquid</li>
              <li>Monitor + cash out from the terminal</li>
            </ul>
          </section>

          <div className="tp-rule" />

          {/* Two-column: Engine + Who It's For */}
          <div className="grid gap-12 md:grid-cols-2">
            <section className="tp-section" style={{ marginTop: 0 }}>
              <h2 className="tp-h">The engine</h2>
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
            </section>

            <section className="tp-section" style={{ marginTop: 0 }}>
              <h2 className="tp-h">Who it's for</h2>
              <ul className="tp-bullets">
                <li>Traders who want a clean signal</li>
                <li>People who want macro hedges without TradFi rails</li>
                <li>Degens who prefer one button and a thesis</li>
              </ul>
            </section>
          </div>

          {/* The Goal */}
          <section className="tp-section">
            <h2 className="tp-h">The goal</h2>
            <p className="tp-body">A clean way to trade global stress.</p>
          </section>

          <div className="tp-rule" />

          {/* Roadmap */}
          <section className="tp-section">
            <h2 className="tp-h">Roadmap</h2>
            <ul className="tp-bullets">
              <li><s className="text-[var(--text-muted)]">Win hackathon</s> <span className="text-[var(--profit)] ml-2">✓</span></li>
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
          </section>

          <div className="tp-rule" />

          {/* Two-column: Built By + Links */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <section className="tp-section" style={{ marginTop: 0 }}>
                <h2 className="tp-h">Built by</h2>
                <p className="tp-body">
                  <a className="tp-link" href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                    @b1rdmania
                  </a>
                </p>
              </section>

              <section className="tp-section">
                <h2 className="tp-h">Music</h2>
                <p className="tp-body">
                  Created with{' '}
                  <a className="tp-link" href="https://wario.style" target="_blank" rel="noreferrer">
                    wario.style
                  </a>
                  —a Gameboy MIDI emulator I built over Xmas.
                </p>
              </section>
            </div>

            <div>
              <section className="tp-section" style={{ marginTop: 0 }}>
                <h2 className="tp-h">Links</h2>
                <p className="tp-body">
                  <a className="tp-link" href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">GitHub</a>
                  <span className="mx-3 text-[var(--text-muted)]">·</span>
                  <a className="tp-link" href="https://www.pear.garden/" target="_blank" rel="noreferrer">Pear Protocol</a>
                  <span className="mx-3 text-[var(--text-muted)]">·</span>
                  <a className="tp-link" href="https://hyperliquid.xyz" target="_blank" rel="noreferrer">Hyperliquid</a>
                </p>
              </section>

              <section className="tp-section">
                <h2 className="tp-h">Start</h2>
                <ul className="tp-bullets">
                  <li>
                    <Link className="tp-link" href="/markets">Browse Markets →</Link>
                  </li>
                  <li>
                    <Link className="tp-link" href="/trade">Open Trade →</Link>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}
