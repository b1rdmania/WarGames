'use client';

import Link from 'next/link';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalButton,
  TerminalStatusBar,
} from '@/components/terminal';
import { WarMark } from './WarMark';
import { GC } from '@/app/labs/geocities-gifs';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'MARKETS', 'TRADE', 'INTEL', 'ABOUT', 'HELP']} />}
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PROJECT', value: 'WAR.MARKET' },
            { label: 'EXECUTION', value: 'PEAR PROTOCOL' },
            { label: 'SETTLEMENT', value: 'HYPERLIQUID' },
            { label: 'STATE', value: 'LIVE' },
          ]}
        />
      }
    >
      <div className={styles.terminal}>
        <section className={styles.hero}>
          <div className={styles.logoMark}>
            <WarMark size={80} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img src={GC.fire1} width={40} height={40} alt="" />
            <img src={GC.explosion} width={35} height={35} alt="" />
            <h1 className={styles.title}>WAR.MARKET</h1>
            <img src={GC.explosion} width={35} height={35} alt="" />
            <img src={GC.fire1} width={40} height={40} alt="" />
          </div>

          <p className={styles.tagline}>THE GLOBAL TENSION TERMINAL</p>

          <p className={styles.subtitle}>
            Geopolitical chaos becomes tradeable positions.<br />
            Taiwan invasion. Oil shock. AI collapse. Six narrative baskets.
          </p>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <img src={GC.trophy} width={20} height={20} alt="" style={{ verticalAlign: 'middle' }} />
            <span style={{ color: '#02ff81', fontSize: '14px', fontWeight: 600 }}>HYPERLIQUID HACKATHON WINNER</span>
          </div>

          <div className={styles.ctaGrid}>
            <Link href="/markets">
              <TerminalButton fullWidth>
                BROWSE MARKETS
              </TerminalButton>
            </Link>
            <Link href="/trade">
              <TerminalButton variant="primary" fullWidth>
                START TRADING
              </TerminalButton>
            </Link>
          </div>

          <div className={styles.poweredBy}>
            POWERED BY PEAR PROTOCOL · HYPERLIQUID
          </div>
        </section>
      </div>
    </TerminalShell>
  );
}
