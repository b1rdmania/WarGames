import type { Metadata } from 'next';
import { GC } from '@/app/labs/geocities-gifs';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalStatusBar,
  TerminalTitle,
  TerminalSessionBadge,
} from '@/components/terminal';
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
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PROJECT', value: 'WAR.MARKET' },
            { label: 'STATUS', value: 'HACKATHON WINNER' },
            { label: 'PHASE', value: 'PRE-GTM' },
            { label: 'STATE', value: 'BUILDING' },
          ]}
        />
      }
    >
      <div className={styles.grid}>
        <section className={styles.visual}>
          <TerminalPaneTitle>VISUAL LOG</TerminalPaneTitle>
          <div className={styles.visualStack}>
            <div className={styles.visualCard}>
              <img src={GC.earthSpin} width={94} height={94} alt="" />
              <div className={styles.visualCaption}>GLOBAL STRESS MAP</div>
            </div>
            <div className={styles.visualCard}>
              <img src={GC.radar} width={88} height={88} alt="" />
              <div className={styles.visualCaption}>SIGNAL SCAN</div>
            </div>
            <div className={styles.visualCard}>
              <img src={GC.worldMap} width={116} height={56} alt="" />
              <div className={styles.visualCaption}>NARRATIVE ROUTING</div>
            </div>
          </div>
          <div className={styles.visualFooter}>
            <img src={GC.coolSite} width={88} height={31} alt="GeoCities cool site badge" />
          </div>
        </section>

        <section className={styles.story}>
          <div className={styles.titleRow}>
            <TerminalTitle className={styles.titleNoMargin}>WAR.MARKET</TerminalTitle>
          </div>
          <p className={styles.body}>
            Trade global stress through narrative long/short baskets.
          </p>

          <div className={styles.sectionGap24}>
            <div className={styles.sectionLabel}>THE PROBLEM</div>
            <p className={styles.body}>
              Global risk moves as one system. Execution doesn&apos;t. A single macro shock can hit chips, energy, FX, and beta at once,
              but most traders still build exposure leg-by-leg across fragmented rails.
            </p>
          </div>

          <div className={styles.sectionGap20}>
            <div className={styles.sectionLabel}>THE RESPONSE</div>
            <p className={styles.body}>
              WAR.MARKET turns narrative views into pre-defined long/short baskets. You pick a thesis, size it, and execute one coherent position.
            </p>
          </div>

          <div className={styles.sectionGap20}>
            <div className={styles.sectionLabel}>HOW IT WORKS</div>
            <p className={styles.body}>
              1) Select a market thesis.<br />
              2) Choose direction, size, leverage.<br />
              3) Execute and monitor in portfolio.
            </p>
          </div>
        </section>

        <section className={styles.credits}>
          <TerminalPaneTitle>CREDITS & LINKS</TerminalPaneTitle>
          <div className={styles.metaBlock}>
            <div className={styles.sectionLabel}>STACK</div>
            <div className={styles.body}>
              <div>Execution: Pear Protocol</div>
              <div>Settlement: Hyperliquid</div>
              <div>Interface: Next.js + Wagmi</div>
            </div>
          </div>
          <div className={styles.metaBlock}>
            <div className={styles.sectionLabel}>LINKS</div>
            <div className={styles.links}>
              <a href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer" className={styles.link}>
                GitHub
              </a>
              <a href="https://www.pear.garden/" target="_blank" rel="noreferrer" className={styles.link}>
                Pear Protocol
              </a>
              <a href="https://hyperliquid.xyz" target="_blank" rel="noreferrer" className={styles.link}>
                Hyperliquid
              </a>
            </div>
            <div className={styles.linksGif}>
              <img src={GC.tank} width={56} height={56} alt="" />
            </div>
          </div>
          <div className={`${styles.metaBlock} ${styles.creditsFooter}`}>
            <div className={styles.sectionLabel}>BUILT BY</div>
            <div className={styles.body}>
              <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer" className={styles.link}>
                @b1rdmania
              </a>
            </div>
            <div className={`${styles.sectionLabel} ${styles.subLabel}`}>MUSIC</div>
            <div className={styles.body}>
              <a href="https://wario.style" target="_blank" rel="noreferrer" className={styles.link}>
                wario.style
              </a>
            </div>
          </div>
        </section>
      </div>
    </TerminalShell>
  );
}
