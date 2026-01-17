'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { MarketPreview } from '@/components/MarketPreview';
import { WalletConnectModal } from '@/components/WalletConnectModal';

export default function Home() {
  const router = useRouter();
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero
        onConnect={() => setConnectModalOpen(true)}
        onViewMarkets={() => router.push('/markets')}
      />

      <Features />

      <MarketPreview onConnect={() => setConnectModalOpen(true)} />

      {/* Footer */}
      <footer className="border-t border-pear-lime/20 py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            Built for Hyperliquid Hackathon 2026 · Powered by{' '}
            <a
              href="https://pear.garden"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pear-lime hover:underline"
            >
              Pear Protocol
            </a>{' '}
            &{' '}
            <a
              href="https://li.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pear-lime hover:underline"
            >
              LI.FI
            </a>
          </p>
        </div>
      </footer>

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}
