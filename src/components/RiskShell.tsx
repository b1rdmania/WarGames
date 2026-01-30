import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './RiskShell.module.css';
import { MusicControls } from './MusicControls';
import { HeaderWalletWidget } from './HeaderWalletWidget';

export function RiskShell({
  nav,
  right,
  showMusic = true,
  children,
}: {
  nav?: ReactNode;
  right?: ReactNode | null;
  showMusic?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/markets" className={styles.logo}>
            WAR.MARKET
          </Link>

          {nav ? <nav className={styles.nav}>{nav}</nav> : null}

          <div className={styles.headerRight}>
            {showMusic ? <MusicControls /> : null}
            {right === undefined ? <HeaderWalletWidget /> : right}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerMuted}>WAR.MARKET</span>
          <span className={styles.footerSep}>|</span>
          <a className={styles.footerLink} href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
            B1RDMANIA
          </a>
        </div>
        <div className={styles.footerRight}>
          <a className={styles.footerLink} href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">
            GITHUB
          </a>
          <span className={styles.footerSep}>|</span>
          <a className={styles.footerLink} href="https://www.pear.garden/" target="_blank" rel="noreferrer">
            PEAR PROTOCOL
          </a>
        </div>
      </footer>
    </div>
  );
}
