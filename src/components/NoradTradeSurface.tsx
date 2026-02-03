'use client';

import { useEffect, useMemo, useState } from 'react';
import { BetSlipPanel } from '@/components/BetSlipPanel';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './NoradTradeSurface.module.css';

type OpsLevel = 'INFO' | 'ALERT' | 'EXEC';

type OpsItem = {
  at: string;
  level: OpsLevel;
  text: string;
};

function stamp(date = new Date()) {
  return date.toTimeString().slice(0, 8);
}

function symbol(raw: string) {
  return raw.split(':').pop() ?? raw;
}

function basketLabel(assets: { asset: string }[]) {
  const names = assets.map((a) => symbol(a.asset)).filter(Boolean);
  if (names.length <= 3) return names.join('+');
  return `${names.slice(0, 2).join('+')}+${names.length - 2}`;
}

function marketCode(id: string) {
  return id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
}

function marketLegs(m: ValidatedMarket) {
  const pairs = m.resolvedPairs ?? m.pairs;
  if (pairs) return { long: symbol(pairs.long), short: symbol(pairs.short) };
  const basket = m.resolvedBasket ?? m.basket;
  if (basket) {
    return {
      long: basketLabel(basket.long),
      short: basketLabel(basket.short),
    };
  }
  return { long: '—', short: '—' };
}

export function NoradTradeSurface({
  markets,
  selectedMarketId,
  selectedSide,
  balance,
  accessToken,
  operatorAddress,
  onSelectMarket,
  onSelectSide,
  onClearSelection,
  onPlaced,
}: {
  markets: ValidatedMarket[];
  selectedMarketId: string | null;
  selectedSide: 'long' | 'short' | null;
  balance: string | null;
  accessToken: string;
  operatorAddress?: string;
  onSelectMarket: (id: string) => void;
  onSelectSide: (side: 'long' | 'short') => void;
  onClearSelection: () => void;
  onPlaced: () => void;
}) {
  const [tick, setTick] = useState(() => Date.now());
  const [lastPlacedAt, setLastPlacedAt] = useState<string | null>(null);
  const [dataSeenAt, setDataSeenAt] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const selectedMarket = useMemo(
    () => markets.find((m) => m.id === selectedMarketId) ?? markets[0] ?? null,
    [markets, selectedMarketId]
  );

  const dataAgeSeconds = Math.max(0, Math.floor((tick - dataSeenAt) / 1000));
  const addressLabel = operatorAddress
    ? `${operatorAddress.slice(0, 6)}...${operatorAddress.slice(-4)}`
    : 'UNKNOWN';

  const opsLog = useMemo<OpsItem[]>(() => {
    const items: OpsItem[] = [
      { at: stamp(), level: 'INFO', text: `Operator session live (${addressLabel}).` },
      { at: stamp(), level: 'INFO', text: `Market feed synchronized (${markets.length} markets).` },
    ];

    if (balance) {
      items.push({
        at: stamp(),
        level: 'INFO',
        text: `Collateral linked: $${Number(balance).toFixed(2)} USDC.`,
      });
    }

    if (selectedMarket) {
      const legs = marketLegs(selectedMarket);
      items.push({
        at: stamp(),
        level: selectedMarket.isTradable ? 'EXEC' : 'ALERT',
        text: `Thesis selected: ${selectedMarket.name} (${legs.long} vs ${legs.short}).`,
      });
      if (!selectedMarket.isTradable && selectedMarket.unavailableReason) {
        items.push({
          at: stamp(),
          level: 'ALERT',
          text: `Execution blocked: ${selectedMarket.unavailableReason}.`,
        });
      }
    }

    if (selectedSide) {
      items.push({
        at: stamp(),
        level: 'EXEC',
        text: `Bias armed: ${selectedSide === 'long' ? 'YES/LONG' : 'NO/SHORT'}.`,
      });
    }

    if (lastPlacedAt) {
      items.push({
        at: lastPlacedAt,
        level: 'EXEC',
        text: 'Position live. Execution accepted.',
      });
    }

    return items.slice(0, 8);
  }, [addressLabel, balance, lastPlacedAt, markets.length, selectedMarket, selectedSide]);

  return (
    <section className={styles.root}>
      <div className={styles.grid}>
        <div className={styles.board}>
          <div className={styles.sectionTitle}>Situation Board</div>
          <div className={styles.map}>
            <div className={styles.mapLabel}>Global stress map</div>
            <span className={`${styles.hotspot} ${styles.hotspotOne}`} />
            <span className={`${styles.hotspot} ${styles.hotspotTwo}`} />
            <span className={`${styles.hotspot} ${styles.hotspotThree}`} />
          </div>
          <div className={styles.marketList}>
            {markets.map((m) => {
              const legs = marketLegs(m);
              const active = m.id === selectedMarket?.id;
              return (
                <button
                  key={m.id}
                  className={`${styles.marketRow} ${active ? styles.marketRowActive : ''}`}
                  onClick={() => {
                    setDataSeenAt(Date.now());
                    onSelectMarket(m.id);
                  }}
                  type="button"
                >
                  <span className={styles.marketCode}>{marketCode(m.id)}</span>
                  <span className={styles.marketName}>{m.name}</span>
                  <span className={`${styles.marketState} ${m.isTradable ? styles.stateLive : styles.stateAlert}`}>
                    {m.isTradable ? 'LIVE' : 'PAUSED'}
                  </span>
                  <span className={styles.marketLegs}>
                    {legs.long} vs {legs.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.log}>
          <div className={styles.sectionTitle}>Event Log</div>
          <div className={styles.logList}>
            {opsLog.map((item) => (
              <div key={`${item.at}-${item.level}-${item.text}`} className={styles.logRow}>
                <span className={styles.logAt}>{item.at}</span>
                <span
                  className={`${styles.logLevel} ${
                    item.level === 'ALERT' ? styles.logAlert : item.level === 'EXEC' ? styles.logExec : styles.logInfo
                  }`}
                >
                  {item.level}
                </span>
                <span className={styles.logText}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.console}>
          <div className={styles.sectionTitle}>Mission Console</div>
          <div className={styles.consoleMeta}>
            <span>{selectedSide ? 'THESIS ARMED' : 'STANDBY'}</span>
            <span>INTEL: SIGMA-PURPLE</span>
          </div>
          <div className={styles.quickBias}>
            <button
              type="button"
              onClick={() => {
                setDataSeenAt(Date.now());
                onSelectSide('long');
              }}
              className={selectedSide === 'long' ? styles.quickBiasActive : ''}
            >
              LONG BIAS
            </button>
            <button
              type="button"
              onClick={() => {
                setDataSeenAt(Date.now());
                onSelectSide('short');
              }}
              className={selectedSide === 'short' ? styles.quickBiasActive : ''}
            >
              SHORT BIAS
            </button>
          </div>
          <BetSlipPanel
            market={selectedMarket}
            side={selectedSide}
            balance={balance}
            accessToken={accessToken}
            onSideChange={(nextSide) => {
              setDataSeenAt(Date.now());
              onSelectSide(nextSide);
            }}
            onClear={() => {
              setDataSeenAt(Date.now());
              onClearSelection();
            }}
            onPlaced={() => {
              setLastPlacedAt(stamp());
              setDataSeenAt(Date.now());
              onPlaced();
            }}
          />
        </div>
      </div>

      <div className={styles.rail}>
        <span>STATUS: {selectedSide ? 'ARMED' : 'IDLE'}</span>
        <span>OPERATOR: {addressLabel}</span>
        <span>MARKET: {selectedMarket ? marketCode(selectedMarket.id) : 'NONE'}</span>
        <span>DATA AGE: {String(dataAgeSeconds).padStart(2, '0')}s</span>
      </div>
    </section>
  );
}
