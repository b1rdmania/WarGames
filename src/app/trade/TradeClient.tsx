'use client';

import { useState } from 'react';
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
} from '@/components/terminal';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { getMarketNarrative } from '@/components/MarketDetail';
import { connectWalletSafely } from '@/lib/connectWallet';
import { PUBLIC_GIFTS } from '@/lib/publicGifts';

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

  // Auth screen
  if (!isAuthenticated) {
    return (
      <TerminalShell
        statusBar={<TerminalStatusBar items={[{ label: 'STATE', value: 'AUTH REQUIRED' }]} />}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '60vh' }}>
          {!isConnected ? (
            <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
              <TerminalTitle>OPERATOR AUTHENTICATION</TerminalTitle>
              <p style={{ color: '#a8b4af', marginTop: '16px', marginBottom: '24px', lineHeight: '1.5' }}>
                Connect wallet to access trade terminal.
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
          ) : (
            <div style={{ maxWidth: '420px', width: '100%' }}>
              <PearSetupCard />
            </div>
          )}
        </div>
      </TerminalShell>
    );
  }

  // Trading interface
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'OPERATIONS', 'THESIS', 'EXECUTE', 'MONITOR', 'HELP']} />}
      leftPane={
        <>
          <TerminalPaneTitle>MARKET DIRECTORY</TerminalPaneTitle>
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
            </>
          ) : (
            <div style={{ color: '#8da294', marginTop: '20px' }}>SELECT A MARKET TO VIEW DETAILS</div>
          )}
        </>
      }
      rightPane={
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
            <img src={PUBLIC_GIFTS.rotatingDollar} alt="" width={28} height={28} />
          </div>
          <TerminalSegment
            options={[
              { value: 'YES', label: 'YES' },
              { value: 'NO', label: 'NO' },
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
          <div style={{ marginTop: '12px', display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <img key={i} src={i % 2 ? PUBLIC_GIFTS.flameA : PUBLIC_GIFTS.flameB} alt="" width={42} height={20} />
            ))}
          </div>
        </>
      }
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
            { label: 'SESSION', value: 'OPERATOR' },
            { label: 'BALANCE', value: perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '$0.00' },
            { label: 'STATE', value: side === 'YES' ? 'THESIS ARMED' : 'HEDGE MODE' },
            { label: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'NONE' },
          ]}
        />
      }
    />
  );
}
