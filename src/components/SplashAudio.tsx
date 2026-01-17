'use client';

import { useEffect, useRef } from 'react';

/**
 * Splash-only background music.
 * Note: Browsers often block autoplay with sound; we attempt autoplay, then
 * start playback on the first user interaction if needed.
 */
export function SplashAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0; // per request: 100% volume
    audio.loop = true;

    let started = false;

    const tryPlay = async () => {
      if (started) return;
      try {
        await audio.play();
        started = true;
      } catch {
        // Autoplay blocked; wait for interaction.
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
    // Best-effort retries (some browsers need a tick after hydration / canplay).
    window.requestAnimationFrame(() => void tryPlay());
    window.setTimeout(() => void tryPlay(), 250);
    window.addEventListener('pointerdown', onFirstInteract);
    window.addEventListener('keydown', onFirstInteract);

    return () => {
      window.removeEventListener('pointerdown', onFirstInteract);
      window.removeEventListener('keydown', onFirstInteract);
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
    };
  }, []);

  return <audio ref={audioRef} src="/music/1.mp3" preload="auto" autoPlay playsInline loop />;
}

