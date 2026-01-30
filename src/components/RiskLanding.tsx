import Link from 'next/link';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  return (
    <main className={styles.root}>
      {/* Video section */}
      <section className={styles.videoSection}>
        <video autoPlay muted loop playsInline preload="metadata" className={styles.video}>
          <source src="/splash.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
        <div className={styles.scrollHint}>
          <span>SCROLL</span>
          <div className={styles.scrollArrow} />
        </div>
      </section>

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.title}>WAR.MARKET</h1>
        <p className={styles.tagline}>TRADE THE TENSION</p>
        <p className={styles.subtitle}>One-click basket trades for macro conviction.</p>

        <div className={styles.cta}>
          <Link href="/markets" className={styles.btn}>
            ENTER TERMINAL
          </Link>
        </div>

        <div className={styles.meta}>
          <span>PEAR PROTOCOL EXECUTION</span>
          <span className={styles.sep}>|</span>
          <span>HYPERLIQUID SETTLEMENT</span>
        </div>
      </section>

      {/* Info grid */}
      <section className={styles.info}>
        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <div className={styles.infoHeader}>01 — SIGNAL</div>
            <p className={styles.infoBody}>
              Macro stress becomes tradeable. Pick a thesis — AI bubble, Taiwan crisis, ETH dominance — and express it as a position.
            </p>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoHeader}>02 — EXECUTE</div>
            <p className={styles.infoBody}>
              Sign once. Pear creates an agent wallet. The basket executes atomically on Hyperliquid. No manual leg construction.
            </p>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoHeader}>03 — CONVICTION</div>
            <p className={styles.infoBody}>
              Browse markets as intel. Trade when ready. Close when done. Thesis → Position → P&L.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>WAR.MARKET</span>
          <span className={styles.sep}>|</span>
          <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer" className={styles.footerLink}>
            B1RDMANIA
          </a>
        </div>
        <div className={styles.footerRight}>
          <Link href="/markets" className={styles.footerLink}>MARKETS</Link>
          <span className={styles.sep}>|</span>
          <Link href="/about" className={styles.footerLink}>ABOUT</Link>
          <span className={styles.sep}>|</span>
          <a href="https://www.pear.garden/" target="_blank" rel="noreferrer" className={styles.footerLink}>
            PEAR
          </a>
        </div>
      </footer>
    </main>
  );
}
