'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold pear-text mb-4">
          WAR.MARKET
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Bet on narratives that move markets
        </p>

        <div className="mb-12 space-y-4">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Pear-first demo: connect your wallet, authenticate, confirm you’re funded (spot/perp USDC),
            then place a BET UP/DOWN.
          </p>

          <div className="pt-2">
            <Link
              href="/markets"
              className="inline-block bg-pear-panel pear-border text-pear-lime text-xl font-bold px-8 py-4 hover:pear-glow transition-all"
            >
              BROWSE MARKETS →
            </Link>
          </div>
        </div>

        <div className="pear-border bg-pear-panel p-8 inline-block">
          <p className="text-sm text-gray-500">
            SYSTEM STATUS: OPERATIONAL
          </p>
        </div>
      </div>
    </main>
  );
}
