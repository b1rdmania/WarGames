import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WAR.MARKET — Briefing',
  robots: { index: false, follow: false },
};

export default function BriefingPage() {
  return (
    <main className="min-h-screen bg-pear-dark text-white">
      <div className="mx-auto max-w-[980px] px-6 py-12">
        <div className="pear-border bg-black/40 p-6">
          <div className="text-pear-lime font-mono font-bold tracking-widest text-2xl">WAR.MARKET</div>
          <div className="mt-2 text-xs font-mono text-gray-500 uppercase tracking-[0.18em]">
            Briefing · Hyperliquid London Hackathon · Jan 16–18, 2026
          </div>

          <div className="mt-10 space-y-10 font-mono">
            <section>
              <div className="text-pear-lime font-bold tracking-widest mb-2">THE PROBLEM</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                Traders think in narratives.
                <br />
                But they trade tickers.
                <br />
                Expressing a thesis means multiple legs and too many steps.
              </div>
            </section>

            <section>
              <div className="text-pear-lime font-bold tracking-widest mb-2">THE SOLUTION</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                Curated narrative markets as pre-built long/short baskets.
                <br />
                One button. One position. One thesis.
              </div>
            </section>

            <section>
              <div className="text-pear-lime font-bold tracking-widest mb-2">HOW IT WORKS</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                1) Browse `/markets` (intel only)
                <br />
                2) Go to `/trade` (connect wallet)
                <br />
                3) Authenticate with Pear (EIP‑712 → agent wallet)
                <br />
                4) Place bet (open position)
                <br />
                5) Track + cash out in `/portfolio`
              </div>
            </section>

            <section>
              <div className="text-pear-lime font-bold tracking-widest mb-2">WHY IT MATTERS</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                This is real execution.
                <br />
                Pear runs the basket.
                <br />
                Hyperliquid settles it.
                <br />
                The UI stays readable under stress.
              </div>
            </section>

            <section>
              <div className="text-pear-lime font-bold tracking-widest mb-2">LINKS</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                Live: <span className="text-white">https://war-markets.vercel.app</span>
                <br />
                Repo: <span className="text-white">https://github.com/b1rdmania/WarGames</span>
                <br />
                X: <span className="text-white">https://x.com/b1rdmania</span>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Note: iOS is gated. This is a laptop/desktop terminal.
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

