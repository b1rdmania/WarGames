'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TerminalTopNav.module.css';

export function TerminalTopNav() {
  const pathname = usePathname();
  const isMarkets = pathname === '/markets' || pathname?.startsWith('/markets/');
  const isTrade = pathname === '/trade';
  const isPortfolio = pathname === '/portfolio';
  const isAbout = pathname === '/about';

  return (
    <nav className={styles.nav} aria-label="Primary">
      <Link className={`${styles.link} ${isMarkets ? styles.active : ''}`} href="/markets">
        MARKETS
      </Link>

      <Link className={`${styles.link} ${isTrade ? styles.active : ''}`} href="/trade">
        TRADE
      </Link>

      <Link className={`${styles.link} ${isPortfolio ? styles.active : ''}`} href="/portfolio">
        PORTFOLIO
      </Link>

      <Link className={`${styles.link} ${isAbout ? styles.active : ''}`} href="/about">
        ABOUT
      </Link>
    </nav>
  );
}

