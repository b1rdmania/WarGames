'use client';

import styles from './MusicControls.module.css';
import { useMusic } from '@/contexts/MusicContext';

function SpeakerIcon({ muted }: { muted: boolean }) {
  // Minimal inline SVG so we don't rely on emoji fonts.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5L6.5 9H3v6h3.5L11 19V5z"
        stroke={muted ? 'rgba(224,224,224,0.55)' : 'rgba(2,255,129,1)'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="rgba(255,90,90,0.9)" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <path d="M14.5 8.5c1 .9 1.5 2.1 1.5 3.5s-.5 2.6-1.5 3.5" stroke="rgba(2,255,129,1)" strokeWidth="2" strokeLinecap="round" />
          <path d="M17.5 6c1.7 1.6 2.5 3.6 2.5 6s-.8 4.4-2.5 6" stroke="rgba(2,255,129,0.65)" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function MusicControls() {
  const { tracks, selectedTrackId, muted, setTrack, toggleMuted } = useMusic();

  return (
    <div className={styles.root}>
      <div className={styles.label}>MUSIC</div>
      <div className={styles.btnRow}>
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.btn} ${t.id === selectedTrackId ? styles.active : ''}`}
            onClick={() => setTrack(t.id)}
            aria-label={`Play track ${t.label}`}
            title={`Track ${t.label}`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.btn} ${styles.muteBtn} ${muted ? '' : styles.active}`}
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

