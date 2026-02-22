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
import { getGifPath } from '@/lib/gifPaths';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  const earthSpinGif = getGifPath('earth-spin', GC.earthSpin);
  const fireHeroGif = getGifPath('fire3', GC.fire1);
  const satelliteGif = getGifPath('satellite', '/gifs/library/intel/satellite.gif');

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PROJECT', value: 'WAR.MARKET' },
            { label: 'PRODUCT', value: 'NARRATIVE BASKETS' },
            { label: 'SETTLEMENT', value: 'HYPERLIQUID' },
            { label: 'STATE', value: 'LIVE' },
          ]}
        />
      }
    >
      <div className={styles.terminal}>
        <section className={styles.hero}>
          <div className={styles.logoMark}>
            <img src={earthSpinGif} width={120} height={120} alt="" />
          </div>

          <div className={styles.titleWrapper}>
            <img src={fireHeroGif} width={48} height={48} alt="" />
            <h1 className={styles.title}>WAR.MARKET</h1>
            <img src={fireHeroGif} width={48} height={48} alt="" />
          </div>

          <p className={styles.tagline}>THE GLOBAL TENSION TERMINAL</p>

          <p className={styles.subtitle}>
            One-click macro baskets on Hyperliquid.<br />
            Taiwan invasion. Oil shock. AI collapse. One click.
          </p>

          <div className={styles.intelStrip} aria-hidden="true">
            <img src={satelliteGif} width={46} height={28} alt="" />
            <div className={styles.intelRule} />
            <img src="/gifs/library/misc/scan.gif" width={88} height={18} alt="" />
          </div>

          <div className={styles.badge}>
            <img src={GC.trophy} width={20} height={20} alt="" />
            <span className={styles.badgeText}>TRADE HIP3 MARKETS ON HYPERLIQUID</span>
          </div>

          <div className={styles.ctaGrid}>
            <Link href="/about">
              <TerminalButton fullWidth>
                ABOUT
              </TerminalButton>
            </Link>
            <Link href="/trade">
              <TerminalButton variant="primary" fullWidth>
                START TRADING →
              </TerminalButton>
            </Link>
          </div>

        </section>
      </div>
    </TerminalShell>
  );
}
