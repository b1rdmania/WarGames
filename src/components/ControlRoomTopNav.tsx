'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ControlRoomTopNav.module.css';

export function ControlRoomTopNav() {
  const pathname = usePathname();
  const isMarkets = pathname === '/markets' || pathname?.startsWith('/markets/');
  const isTrade = pathname === '/trade';
  const isPortfolio = pathname === '/portfolio';
  const isAbout = pathname === '/about';
  const isWarRoom = pathname === '/intel';

  return (
    <nav className={styles.nav} aria-label="Primary">
      <Link className={`${styles.link} ${isMarkets ? styles.active : ''}`} href="/markets">
        Markets
      </Link>

      <Link className={`${styles.link} ${isTrade ? styles.active : ''}`} href="/trade">
        Trade
      </Link>

      <Link className={`${styles.link} ${isPortfolio ? styles.active : ''}`} href="/portfolio">
        Portfolio
      </Link>

      <Link className={`${styles.link} ${isWarRoom ? styles.active : ''}`} href="/intel">
        War Room
      </Link>

      <Link className={`${styles.link} ${isAbout ? styles.active : ''}`} href="/about">
        About
      </Link>
    </nav>
  );
}
