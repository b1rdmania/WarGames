import Image from 'next/image';
import Link from 'next/link';
import { GC } from '@/app/labs/geocities-gifs';
import { TerminalMenuBar, TerminalPaneTitle, TerminalShell, TerminalStatusBar } from '@/components/terminal';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <TerminalShell
      menuBar={
        <TerminalMenuBar
          items={['THESIS CONSOLE', 'ROUTER STATUS', '404 EVENT']}
          right={<span>ALERT: UNDER CONSTRUCTION</span>}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'CODE', value: '404' },
            { label: 'STATE', value: 'MISSING PAGE' },
            { label: 'ACTION', value: 'RETURN TO MARKETS' },
          ]}
        />
      }
    >
      <section className={styles.wrapper}>
        <div className={styles.panel}>
          <TerminalPaneTitle>PAGE NOT FOUND // CONSTRUCTION MODE</TerminalPaneTitle>

          <div className={styles.gifs}>
            <Image
              src={GC.warning}
              width={180}
              height={40}
              alt="Animated warning sign"
              className={styles.warningGif}
              unoptimized
            />
            <Image
              src={GC.constructionWorker}
              width={150}
              height={30}
              alt="Animated under construction worker"
              className={styles.constructionGif}
              unoptimized
            />
          </div>

          <h1 className={styles.title}>404 // This Route Is Off-Grid</h1>
          <p className={styles.copy}>
            The page you requested is unavailable, moved, or still being rebuilt.
            Terminal routing is sending you back to active sectors.
          </p>

          <div className={styles.kv}>
            <div className={styles.kvRow}>
              <span>STATUS</span>
              <strong>DEGRADED</strong>
            </div>
            <div className={styles.kvRow}>
              <span>RECOMMENDED ROUTE</span>
              <strong>/markets</strong>
            </div>
            <div className={styles.kvRow}>
              <span>FALLBACK</span>
              <strong>/trade</strong>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/markets" className={styles.primaryLink}>
              Return to Markets
            </Link>
            <Link href="/trade" className={styles.secondaryLink}>
              Open Trade Console
            </Link>
          </div>
        </div>
      </section>
    </TerminalShell>
  );
}
