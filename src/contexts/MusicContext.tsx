'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedTrackId, setSelectedTrackId] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(true); // start muted, user opts in

  const selectedTrack = useMemo(
    () => TRACKS.find((t) => t.id === selectedTrackId) ?? TRACKS[0],
    [selectedTrackId]
  );

  const hardSwitch = useCallback(
    async (nextTrackId: number, nextMuted: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      const next = TRACKS.find((t) => t.id === nextTrackId) ?? TRACKS[0];
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }

      audio.loop = true;
      audio.volume = 1.0;
      audio.muted = nextMuted;
      audio.src = next.url;
      try {
        audio.load();
      } catch {
        // ignore
      }

      // If user is unmuting / selecting track, attempt play right away (best chance to bypass autoplay restrictions).
      if (!nextMuted) {
        try {
          await audio.play();
        } catch {
          // still may be blocked; will be handled by interaction listeners in the effect below
        }
      }
    },
    []
  );

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

    // Set source to the selected track.
    if (audio.src !== window.location.origin + selectedTrack.url) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
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
  }, [muted, selectedTrack.url]);

  const setTrack = useCallback(
    (id: number) => {
      if (!TRACKS.some((t) => t.id === id)) return;
      // Stop ALL audio elements first (in case of stray players)
      document.querySelectorAll('audio').forEach((el) => {
        try {
          el.pause();
          el.currentTime = 0;
        } catch {
          // ignore
        }
      });
      // Selecting a track implies intent to listen.
      setMuted(false);
      setSelectedTrackId(id);
      // Hard switch immediately during the click gesture.
      void hardSwitch(id, false);
    },
    [hardSwitch]
  );

  const toggleMuted = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      const audio = audioRef.current;
      // If muting, fully stop playback
      if (next) {
        if (audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = true;
          } catch {
            // ignore
          }
        }
        // Also stop any other audio elements on the page (in case of stray players)
        document.querySelectorAll('audio').forEach((el) => {
          try {
            el.pause();
            el.muted = true;
          } catch {
            // ignore
          }
        });
      } else {
        // Unmuting - restart the selected track
        void hardSwitch(selectedTrackId, false);
      }
      return next;
    });
  }, [hardSwitch, selectedTrackId]);

  const value: MusicState = useMemo(
    () => ({
      tracks: TRACKS,
      selectedTrackId,
      muted,
      setTrack,
      toggleMuted,
    }),
    [muted, selectedTrackId, setTrack, toggleMuted]
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
