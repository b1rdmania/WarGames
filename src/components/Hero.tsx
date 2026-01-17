'use client';

import { useState } from 'react';

export function Hero({
  onConnect,
  onViewMarkets,
}: {
  onConnect: () => void;
  onViewMarkets: () => void;
}) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-pear-lime/5 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-pear-panel border border-pear-lime/30 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-pear-lime rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Powered by Pear Protocol</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
          Bet on{' '}
          <span className="bg-gradient-to-r from-pear-lime to-pear-lime-light bg-clip-text text-transparent">
            Macro Narratives
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Trade leveraged pair positions on geopolitical and tech trends.
          <br />
          One click from any chain via LI.FI.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onConnect}
            className="bg-pear-lime hover:bg-pear-lime-light text-pear-dark font-bold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
          >
            Connect Wallet
          </button>
          <button
            onClick={onViewMarkets}
            className="border-2 border-pear-lime text-pear-lime hover:bg-pear-lime hover:text-pear-dark font-bold px-8 py-4 rounded-lg text-lg transition-all w-full sm:w-auto"
          >
            View Markets
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-pear-lime">3x</div>
            <div className="text-sm text-gray-500 mt-1">Leverage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pear-lime">7</div>
            <div className="text-sm text-gray-500 mt-1">Markets</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pear-lime">4</div>
            <div className="text-sm text-gray-500 mt-1">Chains</div>
          </div>
        </div>
      </div>
    </section>
  );
}
