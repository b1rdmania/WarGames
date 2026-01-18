'use client';

import { useEffect, useMemo, useState } from 'react';
import { RiskShell } from '@/components/RiskShell';

type Slide = {
  title: string;
  kicker?: string;
  body: React.ReactNode;
};

const TOTAL = 5;

const SLIDES: Slide[] = [
  {
    kicker: 'Hyperliquid London Hackathon · Jan 16–18, 2026',
    title: 'WAR.MARKET',
    body: (
      <div className="space-y-6">
        <div className="text-4xl md:text-6xl font-mono font-extrabold tracking-widest text-white">
          TRADE NARRATIVES.
          <br />
          <span className="text-pear-lime">NOT TICKERS.</span>
        </div>
        <div className="text-lg md:text-xl font-mono text-gray-300 leading-relaxed">
          Pear executes the basket. Hyperliquid settles it.
        </div>
        <div className="text-sm font-mono text-gray-500">
          Live: <span className="text-white">https://www.war.market</span>
        </div>
      </div>
    ),
  },
  {
    title: 'THE PROBLEM',
    body: (
      <div className="space-y-5 text-xl md:text-2xl font-mono text-gray-200 leading-snug">
        <div>Traders think in stories.</div>
        <div>Markets move in pairs.</div>
        <div>
          But the UI is{' '}
          <span className="text-red-300">tickers and noise</span>.
        </div>
        <div className="text-gray-400">So people trade the wrong thing.</div>
      </div>
    ),
  },
  {
    title: 'THE SOLUTION',
    body: (
      <div className="space-y-6 font-mono">
        <div className="text-xl md:text-2xl text-gray-200 leading-snug">
          WAR.MARKET is a war-room terminal for trading global stress.
        </div>

        <div className="text-lg md:text-xl text-gray-300">
          We turn a thesis into a basket.
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="pear-border bg-black/30 p-5">
            <div className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">LONG</div>
            <div className="text-pear-lime text-2xl font-extrabold tracking-widest">WINNERS</div>
          </div>
          <div className="pear-border bg-black/30 p-5">
            <div className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">SHORT</div>
            <div className="text-red-300 text-2xl font-extrabold tracking-widest">CASUALTIES</div>
          </div>
        </div>

        <div className="text-gray-400 text-lg">One button. One position. One thesis.</div>

        <div className="pear-border bg-black/30 p-4">
          <div className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">
            Example market
          </div>
          <div className="text-pear-lime font-bold tracking-widest">TAIWAN STRAIT CRISIS</div>
          <div className="mt-2 text-xs text-gray-400">
            Thesis: US chip independence vs TSMC supply chain dependency
          </div>
          <div className="mt-3 text-sm">
            <div>
              <span className="text-pear-lime">LONG</span>: INTC (40%) · AMD (30%) · ORCL (30%)
            </div>
            <div>
              <span className="text-red-300">SHORT</span>: NVDA (40%) · AAPL (35%) · TSLA (25%)
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'HOW IT WORKS',
    body: (
      <div className="space-y-5 font-mono">
        <div className="pear-border bg-black/30 p-6 text-lg md:text-xl leading-relaxed">
          1) Browse <span className="text-white">/markets</span> (intel only)
          <br />
          2) Go to <span className="text-white">/trade</span> (connect wallet)
          <br />
          3) Authenticate with Pear (EIP‑712 → agent wallet)
          <br />
          4) Place bet (open position)
          <br />
          5) Track + cash out in <span className="text-white">/portfolio</span>
        </div>
        <div className="text-sm text-gray-500">
          Note: iOS is gated. This is a laptop/desktop terminal.
        </div>
      </div>
    ),
  },
  {
    title: 'WHY IT MATTERS',
    body: (
      <div className="space-y-5 font-mono">
        <div className="text-gray-300">
          <span className="text-pear-lime">✓</span> Real execution (not a mock)
        </div>
        <div className="text-gray-300">
          <span className="text-pear-lime">✓</span> New behavior: narrative → basket → one position
        </div>
        <div className="text-gray-300">
          <span className="text-pear-lime">✓</span> Tight demo loop: auth → trade → P&amp;L → cash out
        </div>
        <div className="text-gray-400 text-lg">Built in 3 days. Shipped to mainnet.</div>
        <div className="pt-2 text-xs text-gray-400">
          Repo: <span className="text-white">https://github.com/b1rdmania/WarGames</span>
          <br />
          X: <span className="text-white">https://x.com/b1rdmania</span>
        </div>
      </div>
    ),
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DeckPage() {
  const [idx, setIdx] = useState(0);

  const slide = useMemo(() => SLIDES[idx]!, [idx]);
  const total = TOTAL;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setIdx((i) => clamp(i + 1, 0, total - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIdx((i) => clamp(i - 1, 0, total - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [total]);

  return (
    <RiskShell subtitle="DECK" showMusic={false} right={null}>
      <div className="mx-auto max-w-[1200px]">
        <div className="pear-border bg-black/35 p-10 md:p-12 min-h-[62vh] flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-[0.18em]">
              {slide.kicker ?? 'WAR.MARKET DECK'}
            </div>
            <div className="text-xs font-mono text-gray-500">
              {idx + 1}/{total}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-4xl md:text-6xl font-mono font-extrabold tracking-widest text-pear-lime">
              {slide.title}
            </div>
            <div className="mt-8">{slide.body}</div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              type="button"
              className="tm-btn px-4 py-2"
              onClick={() => setIdx((i) => clamp(i - 1, 0, total - 1))}
              disabled={idx === 0}
            >
              PREV
            </button>

            <div className="text-[11px] font-mono text-gray-500 text-center">
              Use ← / → keys
            </div>

            <button
              type="button"
              className="tm-btn px-4 py-2"
              onClick={() => setIdx((i) => clamp(i + 1, 0, total - 1))}
              disabled={idx === total - 1}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}

