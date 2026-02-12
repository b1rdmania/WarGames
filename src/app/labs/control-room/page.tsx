'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DEMO_MARKETS } from '../data';
import styles from './style.module.css';

export default function ControlRoomLabPage() {
  const [selectedId, setSelectedId] = useState(DEMO_MARKETS[0].id);
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [size, setSize] = useState(25);
  const market = useMemo(() => DEMO_MARKETS.find((m) => m.id === selectedId) ?? DEMO_MARKETS[0], [selectedId]);

  return (
    <main className={styles.page} data-theme="control-room">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>WAR.MARKET // CONTROL ROOM</div>
        <div className={styles.headerStatus}>
          <div className={styles.statusItem}>
            <span className={styles.statusDot}></span>
            <span>LIVE</span>
          </div>
          <div className={styles.statusItem}>
            <span>LATENCY: 42ms</span>
          </div>
          <div className={styles.statusItem}>
            <span>PEAR: CONNECTED</span>
          </div>
          <Link href="/labs" className={styles.headerBack}>
            BACK TO LABS
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Situation Board */}
        <div className={styles.situationBoard}>
          <div className={styles.boardHeader}>
            <div className={styles.boardTitle}>SITUATION BOARD</div>
            <div className={styles.boardSubtitle}>NARRATIVE MARKETS // LIVE FEED</div>
          </div>
          <div className={styles.boardContent}>
            <table className={styles.marketTable}>
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>THESIS</th>
                  <th>REGIME</th>
                  <th>LEV</th>
                  <th>SPREAD</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_MARKETS.map((m) => (
                  <tr
                    key={m.id}
                    className={m.id === market.id ? styles.rowActive : ''}
                    onClick={() => setSelectedId(m.id)}
                  >
                    <td className={styles.marketCode}>{m.code}</td>
                    <td className={styles.marketName}>{m.title}</td>
                    <td className={styles.marketRegime}>{m.regime}</td>
                    <td>{m.leverage}x</td>
                    <td>{m.spreadBps} bps</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mission Console */}
        <div className={styles.missionConsole}>
          <div className={styles.consoleHeader}>
            <div className={styles.consoleTitle}>MISSION CONSOLE</div>
          </div>
          <div className={styles.consoleContent}>
            <div className={styles.consoleSection}>
              <div className={styles.sectionLabel}>SELECTED MARKET</div>
              <div className={styles.consoleValue}>{market.code}</div>
            </div>

            <div className={styles.consoleSection}>
              <div className={styles.sectionLabel}>THESIS</div>
              <div className={styles.thesisText}>{market.thesis}</div>
            </div>

            <div className={styles.consoleSection}>
              <div className={styles.sectionLabel}>POSITION SIZE (USDC)</div>
              <input type="number" className={styles.consoleInput} value={size} onChange={(e) => setSize(Number(e.target.value))} />
            </div>

            <div className={styles.consoleSection}>
              <div className={styles.sectionLabel}>DIRECTION</div>
              <button className={side === 'YES' ? styles.consoleBtnActive : styles.consoleBtn} onClick={() => setSide('YES')}>
                YES / THESIS
              </button>
              <button className={side === 'NO' ? styles.consoleBtnActive : styles.consoleBtn} onClick={() => setSide('NO')}>
                NO / HEDGE
              </button>
            </div>

            <div className={styles.consoleSection}>
              <button className={styles.consoleBtnPrimary}>EXECUTE POSITION</button>
            </div>
          </div>

          {/* Event Log */}
          <div className={styles.eventLog}>
            <div className={styles.eventItem}>
              <span className={styles.eventTime}>14:32:18</span>
              <span className={`${styles.eventMsg} ${styles.eventSuccess}`}>POSITION OPENED: +$50 {market.code} YES</span>
            </div>
            <div className={styles.eventItem}>
              <span className={styles.eventTime}>14:29:04</span>
              <span className={styles.eventMsg}>WALLET CONNECTED: 0x7a4f...</span>
            </div>
            <div className={styles.eventItem}>
              <span className={styles.eventTime}>14:28:52</span>
              <span className={`${styles.eventMsg} ${styles.eventWarning}`}>PEAR AUTH: SIGNATURE REQUIRED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGroup}>
          <div className={styles.footerItem}>
            <span>SESSION:</span>
            <span className={styles.footerValue}>OPERATOR</span>
          </div>
          <div className={styles.footerItem}>
            <span>BALANCE:</span>
            <span className={styles.footerValue}>$1,247.50</span>
          </div>
        </div>
        <div className={styles.footerGroup}>
          <div className={styles.footerItem}>
            <span>STATE:</span>
            <span className={styles.footerValue}>{side === 'YES' ? 'THESIS ARMED' : 'HEDGE MODE'}</span>
          </div>
          <div className={styles.footerItem}>
            <span>HEARTBEAT:</span>
            <span className={styles.footerValue}>OK</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
