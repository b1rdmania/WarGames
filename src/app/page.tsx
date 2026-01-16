'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BridgeModal } from '@/components/BridgeModal';

export default function Home() {
  const [isBridgeOpen, setIsBridgeOpen] = useState(false);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold neon-text mb-4">
            WAR.MARKET
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Bet on narratives that move markets
          </p>

          {/* Bridge CTA */}
          <div className="mb-12 space-y-4">
            <button
              onClick={() => setIsBridgeOpen(true)}
              className="bg-war-green text-war-dark text-xl font-bold px-8 py-4 hover:opacity-80 transition-opacity neon-glow"
            >
              BRIDGE TO HYPEREVM
            </button>
            <p className="text-sm text-gray-500">
              Bridge from ETH, Arbitrum, Base, or Optimism
            </p>

            <div className="pt-4">
              <Link
                href="/markets"
                className="inline-block bg-war-panel neon-border text-war-green text-xl font-bold px-8 py-4 hover:neon-glow transition-all"
              >
                BROWSE MARKETS →
              </Link>
            </div>
          </div>

          <div className="neon-border bg-war-panel p-8 inline-block">
            <p className="text-sm text-gray-500">
              SYSTEM STATUS: OPERATIONAL
            </p>
          </div>
        </div>
      </main>

      <BridgeModal
        isOpen={isBridgeOpen}
        onClose={() => setIsBridgeOpen(false)}
      />
    </>
  );
}
