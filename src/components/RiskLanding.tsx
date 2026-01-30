import Link from 'next/link';
import Image from 'next/image';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  return (
    <main className={styles.root}>
      <div className={styles.mapBackground} />
      <div className={styles.scanLine} />
      <div className={styles.noise} />

      {/* Video hero */}
      <section className={styles.videoHero} aria-label="war.market hero">
        <div className={styles.videoFallback} />
        <video autoPlay muted loop playsInline preload="metadata" className={styles.heroVideo}>
          <source src="/splash.mp4" type="video/mp4" />
        </video>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollIndicatorText}>Scroll</div>
          <div className={styles.scrollIndicatorArrow} />
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logo}>war.market</div>
          <div className={styles.tagline}>Trade the tension.</div>
          <div className={`${styles.tagline} ${styles.taglineSmall}`}>
            One-click basket trades for macro conviction.
          </div>

          <div className={styles.ctaSection}>
            <Link href="/markets" className={`${styles.btn} ${styles.btnPrimary}`}>
              Launch App
            </Link>
            <div className={styles.poweredBy}>Pear Protocol execution · Hyperliquid settlement</div>
          </div>
        </div>
      </section>

      <section className={styles.explainerStrip} aria-label="How it works">
        <div className={styles.explainerGrid}>
          <div className={styles.explainerItem}>
            <h3>The Signal</h3>
            <p>
              Macro stress becomes tradeable. Pick a thesis — AI bubble, Taiwan crisis, ETH dominance — and express it as a position.
            </p>
          </div>
          <div className={styles.explainerItem}>
            <h3>One Click</h3>
            <p>
              Sign once. Pear creates an agent wallet. The basket executes atomically on Hyperliquid. No manual leg construction.
            </p>
          </div>
          <div className={styles.explainerItem}>
            <h3>Your Conviction</h3>
            <p>
              Browse markets as intel. Trade when you&apos;re ready. Close when you&apos;re done. Thesis → Position → P&L.
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>war.market © 2026</span>
          <Link href="/markets" className={styles.footerLink}>
            Markets
          </Link>
          <Link href="/about" className={styles.footerLink}>
            About
          </Link>
        </div>
        <div className={styles.footerRight}>
          <a href="https://www.pear.garden/" target="_blank" rel="noreferrer" className={styles.footerPear}>
            <Image src="/pearwordmark.png" alt="Pear Protocol" width={100} height={20} />
          </a>
        </div>
      </footer>
    </main>
  );
}
