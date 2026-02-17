'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { usePear } from '@/contexts/PearContext';
import styles from './terminal.module.css';

function shortAddress(address?: string) {
  if (!address) return 'NOT CONNECTED';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function TerminalSessionBadge() {
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const pear = usePear();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const connected = Boolean(isConnected && address);

  return (
    <div className={styles.sessionWrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.sessionBadge} ${connected ? styles.sessionBadgeLive : styles.sessionBadgeIdle}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Wallet session menu"
      >
        <span className={styles.sessionDot} />
        <span className={styles.sessionText}>{shortAddress(address)}</span>
        <span className={styles.sessionChevron}>▾</span>
      </button>
      {open && (
        <div className={styles.sessionMenu}>
          <button
            type="button"
            className={styles.sessionMenuBtn}
            onClick={() => {
              disconnectWallet();
              setOpen(false);
            }}
          >
            DISCONNECT WALLET
          </button>
          <button
            type="button"
            className={styles.sessionMenuBtn}
            onClick={() => {
              pear.disconnect();
              disconnectWallet();
              setOpen(false);
            }}
          >
            DISCONNECT ALL
          </button>
          <div className={styles.sessionMeta}>
            PEAR: {pear.isAuthenticated ? 'AUTH' : 'NONE'}
          </div>
        </div>
      )}
    </div>
  );
}
