import Link from 'next/link';
import { ConnectButton } from './ConnectButton';

export function Navbar() {
  return (
    <nav className="border-b neon-border bg-war-panel">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="neon-text text-xl font-bold hover:opacity-80 transition-opacity">
              WAR.MARKET
            </Link>
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/markets" className="text-gray-400 hover:text-war-green transition-colors">
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
