'use client';

import { useEffect, useMemo, useState } from 'react';
import { RiskShell } from '@/components/RiskShell';

type Slide = {
  title: string;
  kicker?: string;
  body: React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    kicker: 'Hyperliquid London Hackathon · Jan 16–18, 2026',
    title: 'WAR.MARKET',
    body: (
      <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
        <div>Trade narratives. Not tickers.</div>
        <div className="text-gray-400">
          Pear executes the basket. Hyperliquid settles it.
        </div>
        <div className="text-xs text-gray-500">
          Live: <span className="text-white">https://www.war.market</span>
        </div>
      </div>
    ),
  },
  {
    kicker: 'Slide 2 / 5',
    title: 'THE PROBLEM',
    body: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <div>Traders think in stories.</div>
        <div>Markets move in pairs.</div>
        <div>But the UI is tickers and noise.</div>
        <div className="text-gray-400">So people trade the wrong thing.</div>
      </div>
    ),
  },
  {
    kicker: 'Slide 3 / 5',
    title: 'THE SOLUTION',
    body: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <div>WAR.MARKET is a war-room terminal for trading global stress.</div>
        <div>We turn a thesis into a basket:</div>
        <div className="pl-3 border-l border-pear-lime/30">
          <div>
            <span className="text-pear-lime">LONG</span> the winners
          </div>
          <div>
            <span className="text-red-300">SHORT</span> the casualties
          </div>
        </div>
        <div className="text-gray-400">One button. One position. One thesis.</div>
      </div>
    ),
  },
  {
    kicker: 'Slide 4 / 5',
    title: 'HOW IT WORKS',
    body: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <div className="pear-border bg-black/30 p-4 font-mono text-sm">
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
        <div className="text-xs text-gray-500">
          Note: iOS is gated. This is a laptop/desktop terminal.
        </div>
      </div>
    ),
  },
  {
    kicker: 'Slide 5 / 5',
    title: 'WHY IT MATTERS',
    body: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <div>This is real execution.</div>
        <div>Pear runs the basket. Hyperliquid settles it.</div>
        <div className="text-gray-400">
          The UX stays readable under stress. That’s the product.
        </div>
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
  const total = SLIDES.length;

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
      <div className="mx-auto max-w-[980px]">
        <div className="pear-border bg-black/40 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-[0.18em]">
              {slide.kicker ?? `Slide ${idx + 1} / ${total}`}
            </div>
            <div className="text-xs font-mono text-gray-500">
              {idx + 1}/{total}
            </div>
          </div>

          <div className="mt-6 text-3xl md:text-5xl font-mono font-bold tracking-widest text-pear-lime">
            {slide.title}
          </div>

          <div className="mt-6">{slide.body}</div>

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

