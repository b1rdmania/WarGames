'use client';

import dynamic from 'next/dynamic';

const MarketDetailClient = dynamic(() => import('./MarketDetailClient'), { ssr: false });

export default function MarketDetailClientWrapper({ marketId }: { marketId: string }) {
  return <MarketDetailClient marketId={marketId} />;
}

