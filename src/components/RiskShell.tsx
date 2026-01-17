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
        </div>
      </div>
    </div>
  );
}

