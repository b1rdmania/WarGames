import Link from 'next/link';
import Image from 'next/image';
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
          <div className={styles.tagline}>A terminal for trading global stress.</div>
          <div className={`${styles.tagline} ${styles.taglineSmall}`}>
            Macro tension, packaged into tradable long/short baskets.
          </div>

          <div className={styles.ctaSection}>
            <Link href="/markets" className={`${styles.btn} ${styles.btnPrimary}`}>
              LAUNCH APP
            </Link>
            <div className={styles.poweredBy}>Powered by Pear Protocol execution · Hyperliquid settlement</div>
          </div>
        </div>
      </section>

      <section className={styles.explainerStrip} aria-label="How it works">
        <div className={styles.explainerGrid}>
          <div className={styles.explainerItem}>
            <h3>[THE SIGNAL]</h3>
            <p>
              Oil, rates, tech, war. It’s all one regime. WAR.MARKET collapses the noise into readable stress baskets.
            </p>
          </div>
          <div className={styles.explainerItem}>
            <h3>[HOW IT TRADES]</h3>
            <p>You sign once. Pear spins up an agent wallet and executes the basket legs non‑custodially.</p>
          </div>
          <div className={styles.explainerItem}>
            <h3>[THE INTERFACE]</h3>
            <p>Browse markets as pure intel. Trade only from the terminal when you’re ready.</p>
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
        <div className={styles.footerRight}>
          <a href="https://pearprotocol.io" target="_blank" rel="noreferrer" className={styles.footerPear}>
            <Image src="/pearwordmark.png" alt="Pear Protocol" width={120} height={24} />
            <span>Created on Pear Protocol</span>
          </a>
        </div>
      </footer>
    </main>
  );
}

