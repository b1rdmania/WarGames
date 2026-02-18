'use client';

import Link from 'next/link';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalButton,
  TerminalStatusBar,
  TerminalSessionBadge,
} from '@/components/terminal';
import { GC } from '@/app/labs/geocities-gifs';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
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
        <div className={styles.bgNoise} />
        <div className={styles.bgScan} />
        <section className={styles.hero}>
          <div className={styles.alertChip}>
            <img src={GC.warning} width={14} height={14} alt="" />
            <span>MACRO VOLATILITY ONLINE</span>
          </div>

          <div className={styles.logoMark}>
            <img src={GC.globeLarge} width={120} height={120} alt="" />
          </div>

          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>WAR.MARKET</h1>
            <img src={GC.fire1} width={42} height={42} alt="" className={styles.sideAccent} />
          </div>

          <p className={styles.tagline}>THE GLOBAL TENSION TERMINAL</p>

          <p className={styles.subtitle}>
            Tensions don&apos;t wait. Neither should your execution.
          </p>

          <div className={styles.ctaGrid}>
            <Link href="/trade">
              <TerminalButton variant="primary" fullWidth>
                START TRADING →
              </TerminalButton>
            </Link>
            <Link href="/about">
              <TerminalButton fullWidth>
                ABOUT WAR.MARKET
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
