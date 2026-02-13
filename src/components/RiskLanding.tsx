'use client';

import Link from 'next/link';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalButton,
  TerminalStatusBar,
} from '@/components/terminal';
import { WarMark } from './WarMark';
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
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.logoMark}>
            <WarMark size={80} />
          </div>
          <h1 className={styles.title}>WAR.MARKET</h1>
          <p className={styles.tagline}>THE GLOBAL TENSION TERMINAL</p>
          <p className={styles.subtitle}>
            Trade macro stress through narrative long/short baskets.
            <br />
            One signature. Full execution. Real P&L.
          </p>

          <div className={styles.ctaGrid}>
            <Link href="/trade">
              <TerminalButton variant="primary" fullWidth>
                START TRADING
              </TerminalButton>
            </Link>
            <Link href="/markets">
              <TerminalButton fullWidth>
                BROWSE MARKETS
              </TerminalButton>
            </Link>
          </div>

          <div className={styles.poweredBy}>
            PEAR PROTOCOL EXECUTION · HYPERLIQUID SETTLEMENT
          </div>
        </section>

        {/* Explainer Grid */}
        <section className={styles.explainer}>
          <div className={styles.explainerGrid}>
            <div className={styles.explainerPane}>
              <div className={styles.explainerTitle}>PICK A THESIS</div>
              <div className={styles.explainerText}>
                Macro stress becomes tradeable. AI bubble pop, Taiwan crisis, ETH dominance — find the narrative that matches your conviction.
              </div>
            </div>

            <div className={styles.explainerPane}>
              <div className={styles.explainerTitle}>ONE SIGNATURE</div>
              <div className={styles.explainerText}>
                Connect your wallet, sign once. Pear creates an agent wallet and executes the basket atomically on Hyperliquid.
              </div>
            </div>

            <div className={styles.explainerPane}>
              <div className={styles.explainerTitle}>TRADE YOUR VIEW</div>
              <div className={styles.explainerText}>
                Browse markets. Trade when ready. Close when done. Your thesis becomes a position with real P&L.
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className={styles.quickLinks}>
          <div className={styles.quickLinksGrid}>
            <Link href="/markets" className={styles.quickLink}>
              <div className={styles.quickLinkTitle}>MARKETS</div>
              <div className={styles.quickLinkDesc}>Browse 6 narrative baskets</div>
            </Link>
            <Link href="/trade" className={styles.quickLink}>
              <div className={styles.quickLinkTitle}>TRADE</div>
              <div className={styles.quickLinkDesc}>Execute positions</div>
            </Link>
            <Link href="/portfolio" className={styles.quickLink}>
              <div className={styles.quickLinkTitle}>PORTFOLIO</div>
              <div className={styles.quickLinkDesc}>Monitor P&L</div>
            </Link>
            <Link href="/intel" className={styles.quickLink}>
              <div className={styles.quickLinkTitle}>INTEL</div>
              <div className={styles.quickLinkDesc}>Risk analysis</div>
            </Link>
          </div>
        </section>
      </div>
    </TerminalShell>
  );
}
