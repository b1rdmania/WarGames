'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMusic } from '@/contexts/MusicContext';
import styles from './terminal.module.css';

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5L6.5 9H3v6h3.5L11 19V5z"
        stroke={muted ? 'var(--loss)' : 'currentColor'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="var(--loss)" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <path d="M14.5 8.5c1 .9 1.5 2.1 1.5 3.5s-.5 2.6-1.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17.5 6c1.7 1.6 2.5 3.6 2.5 6s-.8 4.4-2.5 6" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function TerminalNav() {
  const pathname = usePathname();
  const { tracks, selectedTrackId, muted, setTrack, toggleMuted } = useMusic();

  const navItems = [
    { href: '/trade', label: 'TRADE' },
    { href: '/portfolio', label: 'PORTFOLIO' },
    { href: '/stats', label: 'STATS' },
    { href: '/about', label: 'ABOUT' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <div className={styles.nav}>
      <div className={styles.navLeft}>
        <Link href="/" className={styles.navBrand}>WAR.MARKET</Link>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.navRight}>
        <div className={styles.navMusicLabel}>MUSIC</div>
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.navMusicBtn} ${t.id === selectedTrackId ? styles.navMusicBtnActive : ''}`}
            onClick={() => setTrack(t.id)}
            aria-label={`Play track ${t.label}`}
            title={`Track ${t.label}`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.navMusicBtn} ${styles.navMusicMute} ${muted ? styles.navMusicMuteMuted : styles.navMusicMuteLive}`}
          onClick={() => toggleMuted()}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          <SpeakerIcon muted={muted} />
        </button>
      </div>
    </div>
  );
}
