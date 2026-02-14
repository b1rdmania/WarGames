import Link from 'next/link';
import type { Metadata } from 'next';
import { GC } from '@/app/labs/geocities-gifs';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalStatusBar,
  TerminalButton,
  TerminalTitle,
  TerminalThesis,
  TerminalKV,
  TerminalKVRow,
} from '@/components/terminal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  openGraph: {
    title: 'About — WAR.MARKET',
    description:
      'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  },
  twitter: {
    title: 'About — WAR.MARKET',
    description:
      'WAR.MARKET is a war-room terminal for trading global stress: narrative long/short baskets executed via Pear Protocol on Hyperliquid.',
  },
};

export default function AboutPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'OVERVIEW', 'TECHNICAL', 'ROADMAP', 'HELP']} />}
      leftPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.computer} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <img src={GC.tech} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            SYSTEM SPECIFICATIONS
            <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </TerminalPaneTitle>
          <TerminalKV>
            <TerminalKVRow
              label={
                <>
                  <img src={GC.tech} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  EXECUTION
                </>
              }
              value={
                <>
                  Pear Protocol
                  <img src={GC.fireSmall} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                </>
              }
            />
            <TerminalKVRow
              label={
                <>
                  <img src={GC.stock} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  SETTLEMENT
                </>
              }
              value={
                <>
                  Hyperliquid
                  <img src={GC.cash} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                </>
              }
            />
            <TerminalKVRow
              label={
                <>
                  <img src={GC.computer} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  INTERFACE
                </>
              }
              value={
                <>
                  Next.js + wagmi
                  <img src={GC.signal} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                </>
              }
            />
          </TerminalKV>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.starBurst} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.fire2} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              WHO IT'S FOR
              <img src={GC.sparkle1} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px', lineHeight: '1.6' }}>
              <div>
                <img src={GC.signal} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                ▸ Traders who want a clean signal
              </div>
              <div>
                <img src={GC.stock} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                ▸ People who want macro hedges without TradFi rails
              </div>
              <div>
                <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                <img src={GC.fire1} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                ▸ Degens who prefer one button and a thesis
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <img src={GC.dividerChain} width={100} height={16} alt="" style={{ opacity: 0.6 }} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.computer} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              BUILT BY
              <img src={GC.coolSite} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px' }}>
              <img src={GC.sparkle2} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                @b1rdmania
              </a>
              <img src={GC.starBurst} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
            </div>
            <div style={{ color: '#8da294', fontSize: '11px', marginTop: '8px' }}>
              <img src={GC.fireSmall} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Music: <a href="https://wario.style" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                wario.style
              </a> (Gameboy MIDI emulator)
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.globeLarge} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              LINKS
              <img src={GC.tech} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px', display: 'grid', gap: '4px' }}>
              <a href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                <img src={GC.computer} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                GitHub
              </a>
              <a href="https://www.pear.garden/" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                <img src={GC.tech} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Pear Protocol
              </a>
              <a href="https://hyperliquid.xyz" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                <img src={GC.stock} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Hyperliquid
              </a>
            </div>
          </div>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.globeSmall} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            PROJECT OVERVIEW
            <img src={GC.fire1} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </TerminalPaneTitle>
          <TerminalTitle>
            <img src={GC.fire1} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <img src={GC.sparkle1} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <img src={GC.explosion} width={22} height={22} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            WAR.MARKET
            <img src={GC.explosion} width={22} height={22} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            <img src={GC.sparkle1} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            <img src={GC.fire1} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </TerminalTitle>
          <TerminalThesis>
            <img src={GC.missile} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            A terminal for trading global stress. Narrative baskets executed via Pear on Hyperliquid.
            <img src={GC.blast} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </TerminalThesis>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <img src={GC.dividerChain} width={120} height={16} alt="" style={{ opacity: 0.7 }} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.warning} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.alert} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              THE PROBLEM
              <img src={GC.danger} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </div>
            <TerminalThesis>
              <img src={GC.oilFire} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Trading global risk is fragmented. Oil, FX, tech beta, and "risk-off" all live in separate silos.
              You react to noise instead of the signal.
              <img src={GC.signal} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </TerminalThesis>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.starBurst} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.impact} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              THE RESPONSE
              <img src={GC.fire2} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </div>
            <TerminalThesis>
              <img src={GC.tech} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
              No interpretation layer—just volatility packaged into clear long/short structures.
              <img src={GC.stock} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </TerminalThesis>
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <img src={GC.dividerColor} width={120} height={16} alt="" style={{ opacity: 0.7 }} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.constructionWorker} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.newBadge} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              ROADMAP
              <img src={GC.fire3} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px', lineHeight: '1.6' }}>
              <div style={{ textDecoration: 'line-through', color: '#8da294' }}>
                <img src={GC.trophy} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <img src={GC.goldMedal} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                ✓ Win hackathon
              </div>
              <div>
                <img src={GC.computer} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                UX redesign for production
              </div>
              <div>
                <img src={GC.tech} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Audit / codebase review
              </div>
              <div>
                <img src={GC.stock} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Quant advice on market structures
              </div>
              <div>
                <img src={GC.signal} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Integrate charts from HL
              </div>
              <div>
                <img src={GC.fire1} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Build GTM team of rabid degens
              </div>
              <div>
                <img src={GC.starBurst} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Launch X
              </div>
              <div>
                <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <img src={GC.blast} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Go LIVE
              </div>
              <div>
                <img src={GC.coin} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <img src={GC.moneyBag} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                $WAR token
              </div>
              <div>
                <img src={GC.tech} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                HIP-3 markets for novel WAR indices
              </div>
              <div>
                <img src={GC.sparkle1} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <img src={GC.sparkle2} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                World Peace
              </div>
            </div>
          </div>
        </>
      }
      rightPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.starBurst} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <img src={GC.explosion} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            ACTIONS
            <img src={GC.fire1} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            <img src={GC.blast} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </TerminalPaneTitle>
          <Link href="/markets">
            <TerminalButton fullWidth>
              <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.stock} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              BROWSE MARKETS →
              <img src={GC.signal} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </TerminalButton>
          </Link>
          <Link href="/trade">
            <TerminalButton variant="primary" fullWidth>
              <img src={GC.coin} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.cash} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <img src={GC.fire2} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              OPEN TRADE →
              <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
              <img src={GC.blast} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </TerminalButton>
          </Link>
        </>
      }
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F5', label: 'HOME' },
            { key: 'F10', label: 'ABOUT' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PROJECT', value: 'WAR.MARKET' },
            { label: 'STATUS', value: 'HACKATHON WINNER' },
            { label: 'PHASE', value: 'PRE-GTM' },
            { label: 'STATE', value: 'BUILDING' },
          ]}
        />
      }
    />
  );
}
