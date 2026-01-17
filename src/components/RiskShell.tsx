import type { ReactNode } from 'react';
import styles from './RiskShell.module.css';

export function RiskShell({
  title = 'WAR.MARKET',
  subtitle = 'TERMINAL',
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.mapBackground} />
      <div className={styles.scanLine} />
      <div className={styles.noise} />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>{title}</div>
              <div className={styles.subtitle}>{subtitle}</div>
            </div>
            {right}
          </div>

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
              <span className={styles.footerRight}>music made in wario.style</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

