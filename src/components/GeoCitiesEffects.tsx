'use client';

import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Renders nothing visible. Attaches/detaches GeoCities-era JS effects
 * (cursor trail, right-click protection) based on the active theme.
 */
export function GeoCitiesEffects() {
  const { isGeoCities } = useTheme();

  useEffect(() => {
    if (!isGeoCities) return;

    /* ---------- Right-click "protection" ---------- */
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert(
        '!! CLASSIFIED INTEL !!\n\nDo NOT steal my HTML!!\nThis page is PROTECTED by the Pentagon!!\n\n- The Webmaster',
      );
    };

    /* ---------- Cursor trail ---------- */
    const TRAIL = 8;
    const dots: { el: HTMLDivElement; x: number; y: number }[] = [];
    let mx = 0;
    let my = 0;

    for (let i = 0; i < TRAIL; i++) {
      const d = document.createElement('div');
      const size = 12 - i;
      Object.assign(d.style, {
        position: 'fixed',
        width: `${size}px`,
        height: `${size}px`,
        background: i % 2 === 0 ? '#FF0000' : '#FFFF00',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'none',
      });
      document.body.appendChild(d);
      dots.push({ el: d, x: 0, y: 0 });
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    let raf: number;
    const animate = () => {
      let x = mx;
      let y = my;
      for (const dot of dots) {
        dot.x += (x - dot.x) * 0.4;
        dot.y += (y - dot.y) * 0.4;
        dot.el.style.left = `${dot.x}px`;
        dot.el.style.top = `${dot.y}px`;
        x = dot.x;
        y = dot.y;
      }
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.el.remove());
    };
  }, [isGeoCities]);

  return null;
}
