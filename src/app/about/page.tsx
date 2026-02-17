import Link from 'next/link';
import type { Metadata } from 'next';
import { GC } from '@/app/labs/geocities-gifs';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalButton,
  TerminalStatusBar,
  TerminalTitle,
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
      menuBar={<TerminalMenuBar items={['FILE', 'OVERVIEW', 'ROADMAP', 'HELP']} />}
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
        <section className={styles.story}>
          <div className={styles.titleRow}>
            <img src={GC.fire1} width={40} height={40} alt="" />
            <TerminalTitle className={styles.titleNoMargin}>WAR.MARKET</TerminalTitle>
            <img src={GC.fire1} width={40} height={40} alt="" />
          </div>

          <p className={styles.body}>
            A terminal for trading global stress. Narrative baskets executed via Pear on Hyperliquid.
          </p>

          <div className={styles.sectionGap24}>
            <div className={styles.sectionLabel}>
              <img src={GC.warning} width={20} height={20} alt="" />
              THE PROBLEM
            </div>
            <p className={styles.body}>
              Trading global risk is fragmented. Oil, FX, tech beta, and &quot;risk-off&quot; all live in separate silos.
              You react to noise instead of the signal.
            </p>
          </div>

          <div className={styles.sectionGap20}>
            <div className={styles.sectionLabel}>
              <img src={GC.starBurst} width={20} height={20} alt="" />
              THE RESPONSE
            </div>
            <p className={styles.body}>
              WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
              No interpretation layer — just volatility packaged into clear long/short structures.
            </p>
          </div>
        </section>

        <section className={styles.sell}>
          <TerminalPaneTitle>ACTIONS</TerminalPaneTitle>

          <div className={styles.sellCard}>
            <img src={GC.trophy} width={32} height={32} alt="" />
            <div className={styles.sellBadge}>Hyperliquid Hackathon Winner</div>
            <div className={styles.sellStats}>
              6 narrative markets<br />
              Live on Pear Protocol<br />
              Settled on Hyperliquid
            </div>
          </div>

          <div className={styles.ctaStack}>
            <Link href="/markets" className={styles.linkReset}>
              <TerminalButton fullWidth>BROWSE MARKETS →</TerminalButton>
            </Link>
            <Link href="/trade" className={styles.linkReset}>
              <TerminalButton variant="primary" fullWidth>OPEN TRADE →</TerminalButton>
            </Link>
          </div>
        </section>

        <section className={styles.meta}>
          <TerminalPaneTitle>POWERED BY</TerminalPaneTitle>
          <div className={styles.body}>
            <div>EXECUTION: Pear Protocol</div>
            <div>SETTLEMENT: Hyperliquid</div>
          </div>

          <div className={styles.sectionGap20}>
            <div className={styles.sectionLabel}>WHO IT&apos;S FOR</div>
            <div className={styles.body}>
              <div>▸ Traders who want a clean signal</div>
              <div>▸ Macro hedges without TradFi rails</div>
              <div>▸ Degens who prefer one button and a thesis</div>
            </div>
          </div>

          <div className={styles.sectionGap20}>
            <div className={styles.sectionLabel}>BUILT BY</div>
            <div className={styles.body}>
              <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer" className={styles.link}>
                @b1rdmania
              </a>
            </div>
            <div className={`${styles.body} ${styles.bodySmall}`}>
              Music:{' '}
              <a href="https://wario.style" target="_blank" rel="noreferrer" className={styles.link}>
                wario.style
              </a>
            </div>
          </div>

          <div className={styles.sectionGap20}>
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
          </div>
        </section>

        <section className={styles.roadmap}>
          <div className={styles.sectionLabel}>ROADMAP</div>
          <ul className={styles.roadmapList}>
            <li className={styles.done}>
              <img src={GC.trophy} width={14} height={14} alt="" />
              Win hackathon
            </li>
            <li className={styles.done}>✓ Launch on Pear Protocol mainnet</li>
            <li>UX redesign for production</li>
            <li>Quant rationale per basket (weights + risk briefs)</li>
            <li>Charts from Hyperliquid</li>
            <li>Community market creation</li>
            <li>
              <img src={GC.explosion} width={14} height={14} alt="" />
              Go LIVE
            </li>
            <li>
              <img src={GC.moneyBag} width={14} height={14} alt="" />
              $WAR token
            </li>
            <li>HIP-3 native WAR indices on Hyperliquid</li>
            <li className={styles.separator}>——————</li>
            <li>
              <img src={GC.sparkle1} width={14} height={14} alt="" />
              World Peace
            </li>
          </ul>
        </section>
      </div>
    </TerminalShell>
  );
}
