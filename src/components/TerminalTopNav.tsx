'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TerminalTopNav.module.css';

export function TerminalTopNav() {
  const pathname = usePathname();
  const isMarkets = pathname === '/markets';

  return (
    <nav className={styles.nav} aria-label="Primary">
      <Link className={`${styles.link} ${isMarkets ? styles.active : ''}`} href="/markets">
        MARKETS
      </Link>

      <span className={`${styles.link} ${styles.disabled}`}>STAKE</span>
      <Link className={styles.link} href="/">
        ABOUT
      </Link>
      <span className={`${styles.link} ${styles.disabled}`}>$RISK</span>
    </nav>
  );
}

