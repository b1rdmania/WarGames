'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DEMO_MARKETS, EVENT_LOG } from '../data';
import styles from './style.module.css';

export default function NoradLabPage() {
  const [selectedId, setSelectedId] = useState(DEMO_MARKETS[0].id);
  const [armed, setArmed] = useState(false);
  const [side, setSide] = useState<'LONG BIAS' | 'SHORT BIAS'>('LONG BIAS');
  const market = useMemo(() => DEMO_MARKETS.find((m) => m.id === selectedId) ?? DEMO_MARKETS[0], [selectedId]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>WAR.MARKET // NORAD SITUATION LAB</div>
        <div className={styles.headerRight}>
          <span>MODE: OPERATOR</span>
          <span>THREAT: ELEVATED</span>
          <Link href="/labs" className={styles.back}>
            LAB INDEX
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.board}>
          <div className={styles.sectionTitle}>SITUATION BOARD</div>
          <div className={styles.mapCard}>
            <div className={styles.mapOverlay}>GLOBAL STRESS MAP</div>
          </div>
          <div className={styles.marketPills}>
            {DEMO_MARKETS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`${styles.pill} ${market.id === m.id ? styles.pillActive : ''}`}
              >
                {m.code}
              </button>
            ))}
          </div>
          <div className={styles.thesisCard}>
            <div className={styles.thesisTitle}>{market.title}</div>
            <p>{market.thesis}</p>
            <div className={styles.pairs}>
              <span>LONG {market.long}</span>
              <span>SHORT {market.short}</span>
            </div>
          </div>
        </section>

        <section className={styles.log}>
          <div className={styles.sectionTitle}>EVENT LOG</div>
          <div className={styles.logList}>
            {EVENT_LOG.map((line) => (
              <div key={line} className={styles.logRow}>
                {line}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.console}>
          <div className={styles.sectionTitle}>MISSION CONSOLE</div>
          <div className={styles.consoleBody}>
            <div className={styles.state}>
              {armed ? 'THESIS ARMED' : 'STANDBY'}
              <span>{market.regime}</span>
            </div>
            <div className={styles.bias}>
              <button onClick={() => setSide('LONG BIAS')} className={side === 'LONG BIAS' ? styles.biasActive : ''}>
                LONG BIAS
              </button>
              <button onClick={() => setSide('SHORT BIAS')} className={side === 'SHORT BIAS' ? styles.biasActive : ''}>
                SHORT BIAS
              </button>
            </div>
            <button className={styles.armButton} onClick={() => setArmed((v) => !v)}>
              {armed ? 'DISARM THESIS' : 'ARM THESIS'}
            </button>
            <button className={styles.execute} disabled={!armed}>
              EXECUTE POSITION
            </button>
            <div className={styles.miniStats}>
              <div>
                <span>LEVERAGE</span>
                <strong>{market.leverage}x</strong>
              </div>
              <div>
                <span>SPREAD</span>
                <strong>{market.spreadBps} bps</strong>
              </div>
              <div>
                <span>RISK REGIME</span>
                <strong>ELEVATED</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.footerRail}>
        <span>STATUS: {armed ? 'ARMED' : 'IDLE'}</span>
        <span>BIAS: {side}</span>
        <span>DATA FRESHNESS: 00:00:03</span>
      </div>
    </main>
  );
}
