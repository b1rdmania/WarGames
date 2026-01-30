import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './RiskShell.module.css';
import { MusicControls } from './MusicControls';
import { HeaderWalletWidget } from './HeaderWalletWidget';

export function RiskShell({
  title = 'war.market',
  nav,
  right,
  showMusic = true,
  children,
}: {
  title?: string;
  nav?: ReactNode;
  right?: ReactNode | null;
  showMusic?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerInner}>
              <div className={styles.brand}>
                <Link href="/markets" className={styles.title} aria-label="war.market home">
                  {title}
                </Link>
              </div>
              {nav ? <div className={styles.nav}>{nav}</div> : null}
              <div className={styles.headerRight}>
                <div className={styles.headerWidgets}>
                  {showMusic ? <MusicControls /> : null}
                  {right === undefined ? <HeaderWalletWidget /> : right}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          {children}

          <footer className={styles.footer}>
            <div className={styles.footerLeft}>
              <a className={styles.footerLink} href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                made by b1rdmania
              </a>
            </div>
            <div className={styles.footerPear}>
              <a className={styles.footerPearLink} href="https://www.pear.garden/" target="_blank" rel="noreferrer">
                <Image
                  src="/pearwordmark.png"
                  alt="Pear Protocol"
                  width={120}
                  height={24}
                  className={styles.footerPearLogo}
                />
              </a>
            </div>
            <div className={styles.footerLinks}>
              <a
                className={styles.footerLink}
                href="https://github.com/b1rdmania/WarGames"
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>
              <span className={styles.footerSep}>·</span>
              <a className={styles.footerLink} href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                x
              </a>
              <span className={styles.footerSep}>·</span>
              <span className={styles.footerRight}>
                music made in{' '}
                <a className={styles.footerLink} href="https://wario.style" target="_blank" rel="noreferrer">
                  wario.style
                </a>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

