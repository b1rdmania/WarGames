'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DEMO_MARKETS } from '../data';
import styles from './style.module.css';

export default function DosNortonLabPage() {
  const [selectedId, setSelectedId] = useState(DEMO_MARKETS[0].id);
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [size, setSize] = useState(25);
  const market = useMemo(() => DEMO_MARKETS.find((m) => m.id === selectedId) ?? DEMO_MARKETS[0], [selectedId]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>WAR.MARKET DOS/NORTON LAB</div>
        <Link href="/labs" className={styles.back}>
          BACK TO LABS
        </Link>
      </div>

      <div className={styles.menu}>FILE  OPERATIONS  THESIS  EXECUTE  MONITOR  HELP</div>

      <div className={styles.shell}>
        <section className={styles.pane}>
          <div className={styles.paneTitle}>MARKET DIRECTORY</div>
          <div className={styles.marketList}>
            {DEMO_MARKETS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`${styles.marketRow} ${m.id === market.id ? styles.marketRowActive : ''}`}
              >
                <span>{m.code}</span>
                <span>{m.regime}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.pane}>
          <div className={styles.paneTitle}>THESIS CONSOLE</div>
          <div className={styles.title}>{market.title}</div>
          <div className={styles.thesis}>{market.thesis}</div>
          <div className={styles.kv}>
            <div>
              <span>LONG</span>
              <strong>{market.long}</strong>
            </div>
            <div>
              <span>SHORT</span>
              <strong>{market.short}</strong>
            </div>
            <div>
              <span>LEVERAGE</span>
              <strong>{market.leverage}x</strong>
            </div>
            <div>
              <span>SPREAD</span>
              <strong>{market.spreadBps} bps</strong>
            </div>
          </div>
        </section>

        <section className={styles.pane}>
          <div className={styles.paneTitle}>EXECUTION TICKET</div>
          <div className={styles.segment}>
            <button onClick={() => setSide('YES')} className={side === 'YES' ? styles.segmentActive : ''}>
              YES
            </button>
            <button onClick={() => setSide('NO')} className={side === 'NO' ? styles.segmentActive : ''}>
              NO
            </button>
          </div>
          <div className={styles.sizeRow}>
            {[10, 25, 50].map((preset) => (
              <button key={preset} onClick={() => setSize(preset)} className={size === preset ? styles.segmentActive : ''}>
                ${preset}
              </button>
            ))}
          </div>
          <button className={styles.action}>ARM THESIS</button>
          <button className={styles.actionPrimary}>EXECUTE POSITION</button>
          <div className={styles.note}>PRESS ENTER TO CONFIRM</div>
        </section>
      </div>

      <div className={styles.commandBar}>
        <span>F1 HELP</span>
        <span>F2 MARKETS</span>
        <span>F3 TRADE</span>
        <span>F4 PORTFOLIO</span>
        <span>F9 ARM</span>
        <span>F10 EXECUTE</span>
      </div>

      <div className={styles.statusBar}>
        <span>SESSION: OPERATOR</span>
        <span>STATE: {side === 'YES' ? 'THESIS ARMED' : 'HEDGE MODE'}</span>
        <span>LATENCY: 41ms</span>
      </div>
    </main>
  );
}
