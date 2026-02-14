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
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.logoMark}>
            <WarMark size={80} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img src={GC.fire1} width={40} height={40} alt="" />
            <img src={GC.sparkle1} width={30} height={30} alt="" />
            <img src={GC.explosion} width={35} height={35} alt="" />
            <h1 className={styles.title}>WAR.MARKET</h1>
            <img src={GC.explosion} width={35} height={35} alt="" />
            <img src={GC.sparkle1} width={30} height={30} alt="" />
            <img src={GC.fire1} width={40} height={40} alt="" />
          </div>
          <p className={styles.tagline}>
            <img src={GC.globeSmall} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <img src={GC.missile} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            THE GLOBAL TENSION TERMINAL
            <img src={GC.missile} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            <img src={GC.globeSmall} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </p>
          <p className={styles.subtitle}>
            Trade macro stress through narrative long/short baskets.
            <br />
            One signature. Full execution. Real P&L.
          </p>

          <div className={styles.ctaGrid}>
            <Link href="/trade">
              <TerminalButton variant="primary" fullWidth>
                <img src={GC.cash} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                START TRADING
                <img src={GC.cash} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              </TerminalButton>
            </Link>
            <Link href="/markets">
              <TerminalButton fullWidth>
                <img src={GC.signal} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                BROWSE MARKETS
                <img src={GC.signal} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              </TerminalButton>
            </Link>
          </div>

          <div className={styles.poweredBy}>
            <img src={GC.tech} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            PEAR PROTOCOL EXECUTION · HYPERLIQUID SETTLEMENT
            <img src={GC.tech} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </div>
        </section>

        {/* Explainer Grid */}
        <section className={styles.explainer}>
          <div className={styles.explainerGrid}>
            <div className={styles.explainerPane}>
              <div className={styles.explainerTitle}>
                <img src={GC.danger} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <img src={GC.explosion} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                PICK A THESIS
                <img src={GC.warning} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              </div>
              <div className={styles.explainerText}>
                Macro stress becomes tradeable. AI bubble pop, Taiwan crisis, ETH dominance — find the narrative that matches your conviction.
              </div>
            </div>

            <div className={styles.explainerPane}>
              <div className={styles.explainerTitle}>
                <img src={GC.tech} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <img src={GC.computer} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                ONE SIGNATURE
                <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              </div>
              <div className={styles.explainerText}>
                Connect your wallet, sign once. Pear creates an agent wallet and executes the basket atomically on Hyperliquid.
              </div>
            </div>

            <div className={styles.explainerPane}>
              <div className={styles.explainerTitle}>
                <img src={GC.cash} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <img src={GC.coin} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                TRADE YOUR VIEW
                <img src={GC.stock} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              </div>
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
