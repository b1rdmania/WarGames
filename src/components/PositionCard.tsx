'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { closePosition } from '@/integrations/pear/positions';
import { getMarketById } from '@/integrations/pear/markets';
import { getHyperliquidPortfolioUrl, getPearPositionUrl } from '@/integrations/pear/links';
import type { PearPosition } from '@/integrations/pear/types';

function cleanCoin(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.split(':').pop()!.trim().replace(/^[^A-Za-z0-9]+/, '');
  if (!s || s === '-' || s === '—') return null;
  return s;
}

function compactCoins(list?: Array<{ coin?: string; asset?: string }>, max = 5): string | null {
  if (!list || list.length === 0) return null;
  const coins = list
    .map((a) => cleanCoin(a.coin ?? a.asset))
    .filter((x): x is string => Boolean(x));
  if (coins.length === 0) return null;
  if (coins.length <= max) return coins.join('+');
  return `${coins.slice(0, max).join('+')}+${coins.length - max}`;
}

export function PositionCard({
  position,
  accessToken,
  onClose,
}: {
  position: PearPosition;
  accessToken: string;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);

  const pnl = Number(position.pnl);
  const pnlPercent = Number(position.pnlPercent);
  const isProfitable = pnl >= 0;

  const longLegs = position.longAssets?.map((a) => cleanCoin(a.coin)).filter(Boolean) as string[] | undefined;
  const shortLegs = position.shortAssets?.map((a) => cleanCoin(a.coin)).filter(Boolean) as string[] | undefined;
  const actualLong = compactCoins(position.longAssets) ?? cleanCoin(position.longAsset) ?? '—';
  const actualShort = compactCoins(position.shortAssets) ?? cleanCoin(position.shortAsset) ?? '—';

  const market = position.marketId && position.marketId !== 'unknown' ? getMarketById(position.marketId) : undefined;
  const displayName =
    market?.name || (actualLong !== '—' && actualShort !== '—' ? `${actualLong} vs ${actualShort}` : 'Position');

  const entryPrice = Number(position.entryPrice);
  const currentPrice = Number(position.currentPrice);
  const priceChange = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;
  const sizeUsd = Number(position.size);
  const marginUsed = position.marginUsed ? Number(position.marginUsed) : null;
  const leverageApprox = marginUsed && marginUsed > 0 ? sizeUsd / marginUsed : null;
  const timeInPosition = position.timestamp
    ? Math.floor((Date.now() - position.timestamp) / (1000 * 60 * 60 * 24))
    : 0;
  const timeDisplay = timeInPosition === 0 ? 'Today' : `${timeInPosition}d`;
  const positionIdShort =
    position.id.length > 12 ? `${position.id.slice(0, 8)}...${position.id.slice(-4)}` : position.id;
  const hasDetailedLegs = (longLegs?.length ?? 0) > 1 || (shortLegs?.length ?? 0) > 1;

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-warm)', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: '15px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              marginTop: '6px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            LONG: <span style={{ color: 'var(--primary)' }}>{actualLong}</span>
          </div>
          <div
            style={{
              marginTop: '2px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            SHORT: <span style={{ color: 'var(--loss)' }}>{actualShort}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            style={{
              color: isProfitable ? 'var(--primary)' : 'var(--loss)',
              fontSize: '36px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {isProfitable ? '+' : ''}${pnl.toFixed(2)}
          </div>
          <div style={{ color: isProfitable ? 'var(--primary)' : 'var(--loss)', fontSize: '12px', marginTop: '4px' }}>
            {isProfitable ? '+' : ''}
            {pnlPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '10px',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Size
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '40px', lineHeight: 1.05 }}>${sizeUsd.toFixed(2)}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Entry
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '40px', lineHeight: 1.05 }}>{entryPrice.toFixed(4)}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Change
          </div>
          <div style={{ color: priceChange >= 0 ? 'var(--primary)' : 'var(--loss)', fontSize: '40px', lineHeight: 1.05 }}>
            {priceChange >= 0 ? '+' : ''}
            {priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '10px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '10px',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Opened</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>{timeDisplay}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Margin</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
            {marginUsed !== null ? `$${marginUsed.toFixed(2)}` : '—'}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Leverage</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
            {leverageApprox ? `${leverageApprox.toFixed(1)}x` : '—'}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Position ID</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>{positionIdShort}</div>
        </div>
      </div>

      {hasDetailedLegs ? (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <div style={{ color: 'var(--text-muted)' }}>Composition</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
            L: {(longLegs ?? []).join(', ') || actualLong}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
            S: {(shortLegs ?? []).join(', ') || actualShort}
          </div>
        </div>
      ) : null}

      <div
        style={{
          marginTop: '12px',
          borderTop: '1px solid var(--border)',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <a
            href={getHyperliquidPortfolioUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            View on Hyperliquid ↗
          </a>
          <a
            href={getPearPositionUrl(position.id)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            View on Pear ↗
          </a>
        </div>
        <button
          onClick={async () => {
            setClosing(true);
            try {
              await closePosition(accessToken, position.id);
              toast.success('Position closed');
              onClose();
            } catch (e) {
              console.error(e);
              toast.error((e as Error).message || 'Failed to close');
            } finally {
              setClosing(false);
            }
          }}
          disabled={closing}
          style={{
            border: '1px solid var(--border)',
            background: 'var(--bg-deep)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 14px',
            cursor: closing ? 'not-allowed' : 'pointer',
            opacity: closing ? 0.55 : 1,
          }}
        >
          {closing ? 'Closing...' : 'Close Position'}
        </button>
      </div>
    </div>
  );
}
