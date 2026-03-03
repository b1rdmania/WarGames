import Link from "next/link";
import styles from "./style.module.css";

export default function FontTestPage() {
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Font Test Lab</h1>
          <Link href="/trade" className={styles.link}>
            Back to app
          </Link>
        </div>

        <p className={styles.lede}>
          A/B test for terminal typography before beta. Left is current monospace feel. Right is an
          obscure sci-fi direction using Iceland for headings and Azeret Mono for body text.
        </p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.kicker}>Current vibe</div>
            <h2 className={styles.currentHeading}>WAR.MARKET TERMINAL</h2>
            <p className={styles.currentBody}>
              One-click macro baskets on Hyperliquid.
              <br />
              Taiwan invasion. Oil shock. AI collapse.
            </p>
            <div className={styles.currentMeta}>STATUS: PRE-BETA</div>
          </section>

          <section className={`${styles.card} ${styles.experimentalCard}`}>
            <div className={`${styles.kicker} ${styles.experimentalKicker}`}>Experimental obscure</div>
            <h2 className={styles.experimentalHeading}>WAR.MARKET SIGNAL CONSOLE</h2>
            <p className={styles.experimentalBody}>
              Experimental narrative baskets settled on Hyperliquid.
              <br />
              Stress events. Asymmetric reactions. One execution path.
            </p>
            <div className={styles.experimentalMeta}>STATUS: TEST FONT CANDIDATE</div>
          </section>
        </div>

        <div className={styles.mockCtaWrap}>
          <Link href="/labs/font-test/mock" className={styles.link}>
            Open contextual mock
          </Link>
        </div>
      </div>
    </main>
  );
}
