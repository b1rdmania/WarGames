 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from './ConnectButton';

export function Navbar() {
  const pathname = usePathname();

  // Landing page is a full-screen hero; hide the app chrome there.
  if (pathname === '/') return null;

  return (
    <nav className="border-b pear-border bg-pear-panel">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="pear-text text-xl font-bold hover:opacity-80 transition-opacity">
              WAR.MARKET
            </Link>
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/markets" className="text-gray-400 hover:text-pear-lime transition-colors">
                MARKETS
              </Link>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
