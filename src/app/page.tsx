import Link from 'next/link';
import styles from './labs/labs.module.css';

const demos = [
  {
    href: '/labs/dos-norton',
    title: 'DOS/Norton',
    subtitle: 'Function-key command bars, hard pane geometry, keyboard-first rails.',
  },
  {
    href: '/labs/bloomberg',
    title: 'Bloomberg',
    subtitle: 'Status strip, dense market board, execution ticket discipline.',
  },
  {
    href: '/labs/norad',
    title: 'NORAD',
    subtitle: 'Situation board, event log, mission console with explicit risk states.',
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Design System Labs</h1>
        <p className={styles.lede}>
          Three full structural variants for war.market. Same narrative and trade flow, different system grammar.
        </p>
        <div className={styles.grid}>
          {demos.map((demo) => (
            <Link key={demo.href} href={demo.href} className={styles.card}>
              <div className={styles.cardTitle}>{demo.title}</div>
              <div className={styles.cardText}>{demo.subtitle}</div>
              <div className={styles.cardCta}>Open demo</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
