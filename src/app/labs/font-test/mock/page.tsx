'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './style.module.css';

type FontMode = 'current' | 'obscureA' | 'obscureB';

const FONT_MODE_LABEL: Record<FontMode, string> = {
  current: 'Current',
  obscureA: 'Obscure A',
  obscureB: 'Obscure B',
};

export default function FontMockPage() {
  const [fontMode, setFontMode] = useState<FontMode>('current');

  const frameClassName = useMemo(() => {
    if (fontMode === 'obscureA') return `${styles.frame} ${styles.fontObscureA}`;
    if (fontMode === 'obscureB') return `${styles.frame} ${styles.fontObscureB}`;
    return `${styles.frame} ${styles.fontCurrent}`;
  }, [fontMode]);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          <div className={styles.brand}>WAR.MARKET FONT MOCK</div>
          <div className={styles.controls}>
            {(Object.keys(FONT_MODE_LABEL) as FontMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`${styles.modeBtn} ${mode === fontMode ? styles.modeBtnActive : ''}`}
                onClick={() => setFontMode(mode)}
              >
                {FONT_MODE_LABEL[mode]}
              </button>
            ))}
            <Link href="/labs/font-test" className={styles.backLink}>
              Back
            </Link>
          </div>
        </div>

        <div className={frameClassName}>
          <section className={styles.card}>
            <div className={styles.cardHead}>Market Directory</div>
            <div className={styles.row}>▸ MACRO</div>
            <div className={styles.row}>▸ GEOPOLITICS</div>
            <div className={styles.row}>▸ CRYPTO</div>
            <div className={styles.row}>▸ DEGEN</div>
            <div className={styles.meta}>SESSION: US · STATUS: OPEN</div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>Position Thesis</div>
            <div className={styles.title}>HYPE VS L1 BASKET</div>
            <div className={styles.copy}>
              HYPE keeps taking mindshare while legacy L1 beta fragments. Relative momentum stays with
              Hyperliquid.
            </div>
            <div className={styles.kvGrid}>
              <div className={styles.kvLabel}>LONG</div>
              <div className={styles.kvValue}>HYPE (HYPERLIQUID)</div>
              <div className={styles.kvLabel}>SHORT</div>
              <div className={styles.kvValue}>ETH + SOL + AVAX + SUI + APT</div>
              <div className={styles.kvLabel}>LEVERAGE</div>
              <div className={styles.kvValue}>3x</div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>Execution Ticket</div>
            <div className={styles.segment}>
              <button type="button" className={`${styles.segBtn} ${styles.segBtnActive}`}>
                YES / THESIS
              </button>
              <button type="button" className={styles.segBtn}>
                NO / FADE
              </button>
            </div>
            <div className={styles.statRow}>
              <span>SIZE $50</span>
              <span>AVAIL $2057.76</span>
            </div>
            <div className={styles.rule} />
            <button type="button" className={styles.executeBtn}>
              EXECUTE POSITION
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
