import Link from 'next/link';
import type { Metadata } from 'next';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { ControlRoomPanel, ControlRoomButton, ControlRoomStatusRail } from '@/components/control-room';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  openGraph: {
    title: 'About — WAR.MARKET',
    description:
      'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  },
  twitter: {
    title: 'About — WAR.MARKET',
    description:
      'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  },
};

export default function AboutPage() {
  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.shell}>
        {/* Situation Board - Main Content */}
        <div className={styles.situationBoard}>
          <ControlRoomPanel title="SITUATION BOARD" subtitle="PROJECT OVERVIEW">
            <div className={styles.boardContent}>
              {/* Header */}
              <div className={styles.hero}>
                <h1 className={styles.title}>WAR.MARKET</h1>
                <p className={styles.lede}>
                  A terminal for trading global stress.<br />
                  Narrative baskets executed via Pear on Hyperliquid.
                </p>
              </div>

              {/* The Problem */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>THE PROBLEM</h2>
                <p className={styles.body}>
                  Trading global risk is fragmented. Oil, FX, tech beta, and "risk‑off" all live in separate silos.
                  You react to noise instead of the signal.
                </p>
              </section>

              {/* The Response */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>THE RESPONSE</h2>
                <p className={styles.body}>
                  WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
                  No interpretation layer—just volatility packaged into clear long/short structures.
                </p>
              </section>

              {/* The Markets */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>THE MARKETS</h2>
                <p className={styles.body}>
                  Each market is a readable macro narrative expressed as a leveraged long/short basket.
                  You're betting on <strong>relative performance</strong>, not absolute direction.
                </p>
              </section>

              {/* How It Works */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>HOW IT WORKS</h2>
                <ul className={styles.bulletList}>
                  <li>Browse markets (intel only)</li>
                  <li>Connect wallet when you want to trade</li>
                  <li>Authenticate with Pear (non‑custodial agent wallet)</li>
                  <li>Pear executes basket legs on Hyperliquid</li>
                  <li>Monitor + cash out from the terminal</li>
                </ul>
              </section>

              {/* Roadmap */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>ROADMAP</h2>
                <ul className={styles.bulletList}>
                  <li className={styles.completed}>
                    <s>Win hackathon</s> <span className={styles.check}>✓</span>
                  </li>
                  <li>UX redesign for production</li>
                  <li>Audit / codebase review</li>
                  <li>Quant advice on market structures</li>
                  <li>Integrate charts from HL</li>
                  <li>Custom historic charts per market</li>
                  <li>Build GTM team of rabid degens</li>
                  <li>Launch X</li>
                  <li>Go LIVE</li>
                  <li>$WAR token</li>
                  <li>Raise stake for HIP-3 auction</li>
                  <li>HIP-3 markets for novel WAR indices</li>
                  <li>World Peace</li>
                </ul>
              </section>
            </div>
          </ControlRoomPanel>
        </div>

        {/* Mission Console - Project Details */}
        <div className={styles.missionConsole}>
          <ControlRoomPanel title="MISSION CONSOLE" subtitle="SYSTEM SPECIFICATIONS">
            <div className={styles.consoleContent}>
              {/* The Engine */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>THE ENGINE</h2>
                <div className={styles.specGrid}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>EXECUTION</span>
                    <span className={styles.specValue}>Pear Protocol</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>SETTLEMENT</span>
                    <span className={styles.specValue}>Hyperliquid</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>INTERFACE</span>
                    <span className={styles.specValue}>Next.js + wagmi</span>
                  </div>
                </div>
              </section>

              {/* Who It's For */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>WHO IT'S FOR</h2>
                <ul className={styles.bulletList}>
                  <li>Traders who want a clean signal</li>
                  <li>People who want macro hedges without TradFi rails</li>
                  <li>Degens who prefer one button and a thesis</li>
                </ul>
              </section>

              {/* Built By */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>BUILT BY</h2>
                <p className={styles.body}>
                  <a className={styles.link} href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">
                    @b1rdmania
                  </a>
                </p>
                <p className={styles.bodySmall}>
                  Music created with{' '}
                  <a className={styles.link} href="https://wario.style" target="_blank" rel="noreferrer">
                    wario.style
                  </a>
                  —a Gameboy MIDI emulator.
                </p>
              </section>

              {/* Links */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>LINKS</h2>
                <div className={styles.linkGrid}>
                  <a className={styles.link} href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a className={styles.link} href="https://www.pear.garden/" target="_blank" rel="noreferrer">
                    Pear Protocol
                  </a>
                  <a className={styles.link} href="https://hyperliquid.xyz" target="_blank" rel="noreferrer">
                    Hyperliquid
                  </a>
                </div>
              </section>

              {/* CTAs */}
              <div className={styles.actions}>
                <Link href="/markets">
                  <ControlRoomButton fullWidth>BROWSE MARKETS →</ControlRoomButton>
                </Link>
                <Link href="/trade">
                  <ControlRoomButton variant="primary" fullWidth>OPEN TRADE →</ControlRoomButton>
                </Link>
              </div>
            </div>
          </ControlRoomPanel>
        </div>
      </div>

      {/* Status Rail */}
      <ControlRoomStatusRail
        leftItems={[
          { key: 'PROJECT', value: 'WAR.MARKET' },
          { key: 'STATUS', value: 'HACKATHON WINNER' },
        ]}
        rightItems={[
          { key: 'PHASE', value: 'PRE-GTM' },
          { key: 'STATE', value: 'BUILDING' },
        ]}
      />
    </RiskShell>
  );
}
