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
    title: 'WHY BUILD THIS',
    body: (
      <div className="space-y-5 text-xl md:text-2xl font-mono text-gray-200 leading-snug">
        <div>EVM chains don’t allow coherent trading of synthetic equities.</div>
        <div>
          Oracle latency is <span className="text-red-300">gameable</span>.
        </div>
        <div className="text-gray-400">The result is mush. Not a market.</div>
      </div>
    ),
  },
  {
    title: 'WHY HYPERLIQUID',
    body: (
      <div className="space-y-6 font-mono">
        <div className="text-xl md:text-2xl text-gray-200 leading-snug">
          Hyperliquid does real-time trading.
        </div>

        <div className="text-lg md:text-xl text-gray-300 leading-relaxed">
          HIP‑3 allows new markets (Trade.xyz style, real‑time stocks).
          <br />
          It’s a <span className="text-pear-lime">game-changer</span>.
        </div>

        <div className="text-lg md:text-xl text-gray-400 leading-relaxed">
          But creating index markets on-chain is expensive.
          <br />
          Roughly <span className="text-white">~$20m stake</span> scale to do it “for real”.
        </div>

        <div className="text-gray-400 text-lg">
          Pear API gives an <span className="text-white">approximation</span> now.
        </div>
      </div>
    ),
  },
  {
    title: 'WAR.MARKET',
    body: (
      <div className="space-y-5 font-mono">
        <div className="text-xl md:text-2xl text-gray-200 leading-snug">
          War Markets turns complex financial architecture into a one-click narrative trade platform.
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

        <div className="text-gray-400 text-lg">One narrative → one basket → one position.</div>

        <div className="pear-border bg-black/30 p-4">
          <div className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">
            Example basket
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
      <div className="tp-wrap">
        <div className="tp-frame min-h-[62vh] flex flex-col justify-between">
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

