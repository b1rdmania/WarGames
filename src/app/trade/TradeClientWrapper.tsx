'use client';

import dynamic from 'next/dynamic';

const TradeClient = dynamic(() => import('./TradeClient'), { ssr: false });

export default function TradeClientWrapper() {
  return <TradeClient />;
}

