'use client';

import styles from './MusicControls.module.css';
import { useMusic } from '@/contexts/MusicContext';

export function MusicControls() {
  const { tracks, selectedTrackId, muted, setTrack, toggleMuted } = useMusic();

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={`${styles.btn} ${muted ? styles.muted : ''}`}
        onClick={() => toggleMuted()}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? 'MUTED' : `TRK ${selectedTrackId}`}
      </button>
      {!muted && (
        <div className={styles.trackBtns}>
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.trackBtn} ${t.id === selectedTrackId ? styles.active : ''}`}
              onClick={() => setTrack(t.id)}
              aria-label={`Track ${t.label}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
