'use client';

import dynamic from 'next/dynamic';

// Disable SSR for the wallet-driven UI to prevent hydration mismatches caused by
// extension-injected HTML and wagmi connection state differences.
const MarketsClient = dynamic(() => import('./MarketsClient'), { ssr: false });

export default function MarketsClientWrapper() {
  return <MarketsClient />;
}

