import Link from 'next/link';
import { ACTIVE_THEMES } from '@/themes';
import styles from './labs/labs.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Design System Labs</h1>
        <p className={styles.lede}>
          Three full structural variants for war.market. Same narrative and trade flow, different system grammar.
        </p>
        <div className={styles.grid}>
          {ACTIVE_THEMES.map((theme) => (
            <Link key={theme.id} href={theme.route} className={styles.card}>
              <div className={styles.cardTitle}>{theme.label}</div>
              <div className={styles.cardText}>{theme.description}</div>
              <div className={styles.cardCta}>Open demo</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
