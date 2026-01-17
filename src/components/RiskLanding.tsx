import Link from 'next/link';
import styles from './RiskLanding.module.css';

export function RiskLanding() {
  return (
    <main className={styles.root}>
      <div className={styles.mapBackground} />
      <div className={styles.scanLine} />
      <div className={styles.noise} />
      <div className={styles.scanningLabel}>SCANNING REGION...</div>

      {/* Video hero (optional). If no mp4 is present, the fallback still gives the same look. */}
      <section className={styles.videoHero} aria-label="WAR.MARKET hero">
        <div className={styles.videoFallback} />
        <video autoPlay muted loop playsInline preload="metadata" className={styles.heroVideo}>
          <source src="/splash.mp4" type="video/mp4" />
        </video>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollIndicatorText}>Scroll Down</div>
          <div className={styles.scrollIndicatorArrow} />
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logo}>WAR.MARKET</div>
          <div className={styles.tagline}>The Global Tension Terminal.</div>
          <div className={`${styles.tagline} ${styles.taglineSmall}`}>Narrative pair trading on mainnet</div>

          <div className={styles.ctaSection}>
            <Link href="/markets" className={`${styles.btn} ${styles.btnPrimary}`}>
              LAUNCH APP
            </Link>
            <div className={styles.poweredBy}>Powered by Pear Protocol · Hyperliquid</div>
          </div>
        </div>
      </section>

      <section className={styles.explainerStrip} aria-label="How it works">
        <div className={styles.explainerGrid}>
          <div className={styles.explainerItem}>
            <h3>[NARRATIVE MARKETS]</h3>
            <p>Pick a story, pick a direction, and express the view with a leveraged pair.</p>
          </div>
          <div className={styles.explainerItem}>
            <h3>[NON-CUSTODIAL]</h3>
            <p>You sign. Pear creates an agent wallet. Trades execute on your behalf.</p>
          </div>
          <div className={styles.explainerItem}>
            <h3>[MAINNET]</h3>
            <p>Designed for a fast demo loop: place → watch → close.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span style={{ color: 'var(--rm-text-primary)' }}>WAR.MARKET © 2026</span>
          <Link href="/markets" className={styles.footerLink}>
            Terminal
          </Link>
        </div>
        <div className={styles.footerRight}>build v0.1</div>
      </footer>
    </main>
  );
}

