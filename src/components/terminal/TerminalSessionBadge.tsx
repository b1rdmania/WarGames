'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePear } from '@/contexts/PearContext';
import { connectWalletSafely } from '@/lib/connectWallet';
import styles from './terminal.module.css';

function shortAddress(address?: string) {
  if (!address) return 'NOT CONNECTED';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function TerminalSessionBadge() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
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
          {!connected ? (
            <button
              type="button"
              className={styles.sessionMenuBtn}
              disabled={isPending}
              onClick={() => {
                (async () => {
                  try {
                    await connectWalletSafely({ connectors, connectAsync, disconnect: disconnectWallet });
                    setOpen(false);
                  } catch (e) {
                    console.error(e);
                    toast.error((e as Error).message || 'Failed to connect wallet');
                  }
                })();
              }}
            >
              {isPending ? 'CONNECTING...' : 'CONNECT WALLET'}
            </button>
          ) : null}
          <button
            type="button"
            className={styles.sessionMenuBtn}
            disabled={!connected}
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
            disabled={!connected && !pear.isAuthenticated}
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
