'use client';

import Link from 'next/link';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import {
  ControlRoomPanel,
  ControlRoomTable,
  ControlRoomTableHeader,
  ControlRoomTableBody,
  ControlRoomTableRow,
  ControlRoomTableCell,
  ControlRoomButton,
} from '@/components/control-room';
import styles from './MarketsClient.module.css';

export default function MarketsClient() {
  const { markets: validatedMarkets } = useValidatedMarkets();
  // Markets page shows only geopolitical/macro markets (the key narratives)
  // Crypto markets are available on the /trade page
  const effectiveMarkets = (validatedMarkets ?? []).filter(m => m.category !== 'crypto');

  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.wrapper}>
        <ControlRoomPanel title="SITUATION BOARD" subtitle="NARRATIVE MARKETS // BROWSE">
          <ControlRoomTable>
            <ControlRoomTableHeader>
              <ControlRoomTableRow>
                <ControlRoomTableCell header>CODE</ControlRoomTableCell>
                <ControlRoomTableCell header>THESIS</ControlRoomTableCell>
                <ControlRoomTableCell header>REGIME</ControlRoomTableCell>
                <ControlRoomTableCell header>LEV</ControlRoomTableCell>
                <ControlRoomTableCell header>ACTION</ControlRoomTableCell>
              </ControlRoomTableRow>
            </ControlRoomTableHeader>
            <ControlRoomTableBody>
              {effectiveMarkets.map((market) => (
                <ControlRoomTableRow key={market.id}>
                  <ControlRoomTableCell mono>{market.id.toUpperCase().replace(/-/g, '_')}</ControlRoomTableCell>
                  <ControlRoomTableCell>{market.name}</ControlRoomTableCell>
                  <ControlRoomTableCell>{market.category?.toUpperCase() || 'N/A'}</ControlRoomTableCell>
                  <ControlRoomTableCell>{market.leverage}x</ControlRoomTableCell>
                  <ControlRoomTableCell>
                    <Link href={`/markets/${market.id}`}>
                      <ControlRoomButton>VIEW DETAIL</ControlRoomButton>
                    </Link>
                  </ControlRoomTableCell>
                </ControlRoomTableRow>
              ))}
            </ControlRoomTableBody>
          </ControlRoomTable>
        </ControlRoomPanel>
      </div>
    </RiskShell>
  );
}
