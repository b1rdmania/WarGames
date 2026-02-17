'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { PearSetupCard } from '@/components/PearSetupCard';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalStatusBar,
  TerminalButton,
  TerminalMarketList,
  TerminalMarketRow,
  TerminalTitle,
  TerminalThesis,
  TerminalKV,
  TerminalKVRow,
  TerminalSegment,
  TerminalSizeRow,
  TerminalNote,
  TerminalSessionBadge,
} from '@/components/terminal';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { getMarketNarrative } from '@/components/MarketDetail';
import { connectWalletSafely } from '@/lib/connectWallet';
import { GC } from '@/app/labs/geocities-gifs';

function cleanSymbol(s: string) {
  return s.split(':').pop()!.trim();
}

export default function TradeClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: effectiveMarkets } = useValidatedMarkets();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(effectiveMarkets?.[0]?.id ?? null);
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [size, setSize] = useState(25);

  const selectedMarket = effectiveMarkets?.find((m) => m.id === selectedMarketId) ?? null;
  const narrative = selectedMarket ? getMarketNarrative(selectedMarket.id) : null;

  // Right pane content based on auth state
  const renderRightPane = () => {
    if (!isConnected) {
      return (
        <>
          <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <TerminalTitle style={{ fontSize: '16px', marginBottom: '12px' }}>AUTHENTICATION REQUIRED</TerminalTitle>
            <p style={{ color: '#a8b4af', marginBottom: '20px', lineHeight: '1.5', fontSize: '14px' }}>
              Connect your wallet to execute trades.
            </p>
            <TerminalButton
              variant="primary"
              fullWidth
              disabled={isPending}
              onClick={() => {
                (async () => {
                  try {
                    await connectWalletSafely({ connectors, connectAsync, disconnect });
                  } catch (e) {
                    console.error(e);
                    toast.error((e as Error).message || 'Failed to connect wallet');
                  }
                })();
              }}
            >
              {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
            </TerminalButton>
          </div>
        </>
      );
    }

    if (!isAuthenticated) {
      return (
        <>
          <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
          <div style={{ padding: '20px 0' }}>
            <PearSetupCard />
          </div>
        </>
      );
    }

    // Fully authenticated - show execution ticket
    return (
      <>
        <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
          DIRECTION
        </div>
        <TerminalSegment
          options={[
            { value: 'YES', label: 'YES / THESIS' },
            { value: 'NO', label: 'NO / FADE' },
          ]}
          value={side}
          onChange={(v) => setSide(v as 'YES' | 'NO')}
        />
        <TerminalSizeRow sizes={[10, 25, 50]} value={size} onChange={setSize} />
        <TerminalButton fullWidth disabled={!selectedMarket}>
          ARM THESIS
        </TerminalButton>
        <TerminalButton variant="primary" fullWidth disabled={!selectedMarket}>
          EXECUTE POSITION
        </TerminalButton>
        <TerminalNote>PRESS ENTER TO CONFIRM</TerminalNote>
      </>
    );
  };

  // 3-pane layout always visible
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'OPERATIONS', 'THESIS', 'EXECUTE', 'MONITOR', 'HELP']} right={<TerminalSessionBadge />} />}
      leftPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.globeLarge} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            MARKET DIRECTORY
          </TerminalPaneTitle>
          <TerminalMarketList>
            {(effectiveMarkets ?? []).map((market) => (
              <TerminalMarketRow
                key={market.id}
                code={market.id.toUpperCase().replace(/-/g, '_')}
                status={market.isTradable ? 'LIVE' : 'PAUSED'}
                active={selectedMarketId === market.id}
                onClick={() => setSelectedMarketId(market.id)}
              />
            ))}
          </TerminalMarketList>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>THESIS CONSOLE</TerminalPaneTitle>
          {selectedMarket ? (
            <>
              <TerminalTitle>{selectedMarket.name}</TerminalTitle>
              <TerminalThesis>{narrative?.thesis ?? selectedMarket.description}</TerminalThesis>
              <TerminalKV>
                <TerminalKVRow
                  label="LONG"
                  value={
                    selectedMarket.pairs
                      ? cleanSymbol(selectedMarket.pairs.long)
                      : selectedMarket.basket
                      ? selectedMarket.basket.long.map(a => cleanSymbol(a.asset)).join('+')
                      : '—'
                  }
                />
                <TerminalKVRow
                  label="SHORT"
                  value={
                    selectedMarket.pairs
                      ? cleanSymbol(selectedMarket.pairs.short)
                      : selectedMarket.basket
                      ? selectedMarket.basket.short.map(a => cleanSymbol(a.asset)).join('+')
                      : '—'
                  }
                />
                <TerminalKVRow label="LEVERAGE" value={`${selectedMarket.leverage}x`} />
                <TerminalKVRow label="CATEGORY" value={selectedMarket.category?.toUpperCase() || 'N/A'} />
              </TerminalKV>
              <div style={{ marginTop: '16px' }}>
                <Link href={`/markets/${selectedMarket.id}`}>
                  <TerminalButton fullWidth>
                    <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    FULL INTELLIGENCE →
                  </TerminalButton>
                </Link>
              </div>
            </>
          ) : (
            <div style={{ color: '#8da294', marginTop: '20px' }}>SELECT A MARKET TO VIEW DETAILS</div>
          )}
        </>
      }
      rightPane={renderRightPane()}
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F9', label: 'ARM' },
            { key: 'F10', label: 'EXECUTE' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'SESSION', value: isAuthenticated ? 'OPERATOR' : 'BROWSE' },
            { label: 'BALANCE', value: isAuthenticated && perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '—' },
            { label: 'STATE', value: isAuthenticated ? (side === 'YES' ? 'THESIS ARMED' : 'FADE MODE') : 'READ-ONLY' },
            { label: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'GUEST' },
          ]}
        />
      }
    />
  );
}
