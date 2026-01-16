import { ConnectButton } from './ConnectButton';

export function Navbar() {
  return (
    <nav className="border-b neon-border bg-war-panel">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="neon-text text-xl font-bold">
            WAR.MARKET
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
