import type { ReactNode } from 'react';
import styles from './RiskShell.module.css';

export function RiskShell({
  title = 'WAR.MARKET',
  subtitle = 'TERMINAL',
  nav,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  nav?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.mapBackground} />
      <div className={styles.scanLine} />
      <div className={styles.noise} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerInner}>
              <div className={styles.brand}>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtitle}>{subtitle}</div>
              </div>
              {nav ? <div className={styles.nav}>{nav}</div> : null}
              <div className={styles.headerRight}>{right}</div>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          {children}

          <footer className={styles.footer}>
            <div className={styles.footerLeft}>made by b1rdmania</div>
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

