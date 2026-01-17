'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Track = { id: number; url: string; label: string };

const TRACKS: Track[] = [
  { id: 1, url: '/music/1.mp3', label: '1' },
  { id: 2, url: '/music/2.mp3', label: '2' },
  { id: 3, url: '/music/3.mp3', label: '3' },
  { id: 4, url: '/music/4.mp3', label: '4' },
];

type MusicState = {
  tracks: Track[];
  selectedTrackId: number;
  muted: boolean;
  setTrack: (id: number) => void;
  toggleMuted: () => void;
};

const MusicContext = createContext<MusicState | undefined>(undefined);

const STORAGE_KEYS = {
  trackId: 'wm_music_track_id',
  muted: 'wm_music_muted',
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSplash = pathname === '/';

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedTrackId, setSelectedTrackId] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false); // attempt autoplay on main app pages

  const selectedTrack = useMemo(
    () => TRACKS.find((t) => t.id === selectedTrackId) ?? TRACKS[0],
    [selectedTrackId]
  );

  // Load persisted settings once.
  useEffect(() => {
    try {
      const rawTrack = localStorage.getItem(STORAGE_KEYS.trackId);
      const rawMuted = localStorage.getItem(STORAGE_KEYS.muted);
      if (rawTrack) {
        const n = Number(rawTrack);
        if (Number.isFinite(n) && TRACKS.some((t) => t.id === n)) setSelectedTrackId(n);
      }
      if (rawMuted === 'true' || rawMuted === 'false') setMuted(rawMuted === 'true');
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.trackId, String(selectedTrackId));
      localStorage.setItem(STORAGE_KEYS.muted, String(muted));
    } catch {
      // ignore
    }
  }, [selectedTrackId, muted]);

  // Keep audio element in sync.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 1.0;
    audio.muted = muted;

    // Splash page: always stop/pause (splash has its own splash-only audio).
    if (isSplash) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
      return;
    }

    // Set source to the selected track.
    if (audio.src !== window.location.origin + selectedTrack.url) {
      audio.src = selectedTrack.url;
      try {
        audio.load();
      } catch {
        // ignore
      }
    }

    // Try to play if unmuted (user opted in). If blocked, it will start on first interaction.
    let started = false;
    const tryPlay = async () => {
      if (muted || started) return;
      try {
        await audio.play();
        started = true;
      } catch {
        // autoplay blocked
      }
    };

    const onFirstInteract = () => {
      void tryPlay();
      if (started) {
        window.removeEventListener('pointerdown', onFirstInteract);
        window.removeEventListener('keydown', onFirstInteract);
      }
    };

    void tryPlay();
    window.addEventListener('pointerdown', onFirstInteract);
    window.addEventListener('keydown', onFirstInteract);

    return () => {
      window.removeEventListener('pointerdown', onFirstInteract);
      window.removeEventListener('keydown', onFirstInteract);
    };
  }, [isSplash, muted, selectedTrack.url]);

  const value: MusicState = useMemo(
    () => ({
      tracks: TRACKS,
      selectedTrackId,
      muted,
      setTrack: (id: number) => {
        if (!TRACKS.some((t) => t.id === id)) return;
        setSelectedTrackId(id);
        // Selecting a track implies intent to listen.
        setMuted(false);
      },
      toggleMuted: () => setMuted((m) => !m),
    }),
    [muted, selectedTrackId]
  );

  return (
    <MusicContext.Provider value={value}>
      {/* Single audio instance for the whole app */}
      <audio ref={audioRef} preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}

