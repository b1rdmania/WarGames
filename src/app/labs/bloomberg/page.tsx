'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DEMO_MARKETS } from '../data';
import styles from './style.module.css';

export default function BloombergLabPage() {
  const [selectedId, setSelectedId] = useState(DEMO_MARKETS[1].id);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const market = useMemo(() => DEMO_MARKETS.find((m) => m.id === selectedId) ?? DEMO_MARKETS[0], [selectedId]);

  return (
    <main className={styles.page}>
      <div className={styles.topStrip}>
        <span>WAR.MARKET // BLOOMBERG LAB</span>
        <span>SESSION OPEN</span>
        <span>HL-PEAR CONNECTED</span>
        <span>LAT 38ms</span>
        <Link href="/labs" className={styles.back}>
          LAB INDEX
        </Link>
      </div>

      <div className={styles.commandLine}>
        <span className={styles.prompt}>CMD&gt;</span>
        <span>WMKT &lt;GO&gt; | TRADE &lt;GO&gt; | PORTFOLIO &lt;GO&gt;</span>
      </div>

      <div className={styles.layout}>
        <section className={styles.board}>
          <div className={styles.boardTitle}>MARKET BOARD</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>CODE</th>
                <th>THESIS</th>
                <th>LEV</th>
                <th>REGIME</th>
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
                  <td>{m.code}</td>
                  <td>{m.title}</td>
                  <td>{m.leverage}x</td>
                  <td>{m.regime}</td>
                  <td>{m.spreadBps} bps</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.ticket}>
          <div className={styles.ticketTitle}>EXECUTION TICKET</div>
          <div className={styles.marketName}>{market.title}</div>
          <div className={styles.legs}>
            <div>
              <span>LONG</span>
              <strong>{market.long}</strong>
            </div>
            <div>
              <span>SHORT</span>
              <strong>{market.short}</strong>
            </div>
          </div>
          <div className={styles.toggle}>
            <button className={side === 'BUY' ? styles.buyActive : ''} onClick={() => setSide('BUY')}>
              BUY / YES
            </button>
            <button className={side === 'SELL' ? styles.sellActive : ''} onClick={() => setSide('SELL')}>
              SELL / NO
            </button>
          </div>
          <div className={styles.size}>SIZE: 25 USDC</div>
          <button className={styles.execute}>{side} BASKET</button>
          <div className={styles.risk}>RISK CHECK: PASS · SLIPPAGE CAP 1%</div>
        </section>
      </div>

      <div className={styles.blotter}>
        <span>BLT&gt; AI-INF selected</span>
        <span>MODE: LIVE</span>
        <span>HEARTBEAT: OK</span>
      </div>
    </main>
  );
}
