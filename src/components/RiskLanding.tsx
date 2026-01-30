import Link from 'next/link';
import Image from 'next/image';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  return (
    <main className={styles.root}>
      {/* Video hero */}
      <section className={styles.videoHero} aria-label="war.market hero">
        <div className={styles.videoFallback} />
        <video autoPlay muted loop playsInline preload="metadata" className={styles.heroVideo}>
          <source src="/splash.mp4" type="video/mp4" />
        </video>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollIndicatorArrow} />
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logo}>war.market</div>
          <p className={styles.tagline}>Trade the tension.</p>
          <p className={`${styles.tagline} ${styles.taglineSmall}`}>
            One-click basket trades for macro conviction.
          </p>

          <div className={styles.ctaSection}>
            <Link href="/markets" className={`${styles.btn} ${styles.btnPrimary}`}>
              Launch App
            </Link>
            <p className={styles.poweredBy}>Pear Protocol execution · Hyperliquid settlement</p>
          </div>
        </div>
      </section>

      <section className={styles.explainerStrip} aria-label="How it works">
        <div className={styles.explainerGrid}>
          <div className={styles.explainerItem}>
            <h3>Pick a thesis</h3>
            <p>
              Macro stress becomes tradeable. AI bubble pop, Taiwan crisis, ETH dominance — find the narrative that matches your conviction.
            </p>
          </div>
          <div className={styles.explainerItem}>
            <h3>One signature</h3>
            <p>
              Connect your wallet, sign once. Pear creates an agent wallet and executes the basket atomically on Hyperliquid.
            </p>
          </div>
          <div className={styles.explainerItem}>
            <h3>Trade your view</h3>
            <p>
              Browse markets. Trade when ready. Close when done. Your thesis becomes a position with real P&L.
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
