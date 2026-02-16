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
            <img src={GC.tech} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            SYSTEM SPECIFICATIONS
          </TerminalPaneTitle>
          <TerminalKV>
            <TerminalKVRow label="EXECUTION" value="Pear Protocol" />
            <TerminalKVRow label="SETTLEMENT" value="Hyperliquid" />
            <TerminalKVRow label="INTERFACE" value="Next.js + wagmi" />
          </TerminalKV>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.fire2} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              WHO IT&apos;S FOR
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px', lineHeight: '1.6' }}>
              <div>▸ Traders who want a clean signal</div>
              <div>▸ People who want macro hedges without TradFi rails</div>
              <div>▸ Degens who prefer one button and a thesis</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img src={GC.dividerChain} width={100} height={16} alt="" style={{ opacity: 0.6 }} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              BUILT BY
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px' }}>
              <img src={GC.sparkle1} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                @b1rdmania
              </a>
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
              <img src={GC.globeSmall} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              LINKS
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px', display: 'grid', gap: '4px' }}>
              <a href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                GitHub
              </a>
              <a href="https://www.pear.garden/" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                Pear Protocol
              </a>
              <a href="https://hyperliquid.xyz" target="_blank" rel="noreferrer" style={{ color: '#02ff81', textDecoration: 'none' }}>
                Hyperliquid
              </a>
            </div>
          </div>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.globeLarge} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            PROJECT OVERVIEW
          </TerminalPaneTitle>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <img src={GC.fire1} width={40} height={40} alt="" />
            <TerminalTitle style={{ margin: 0 }}>WAR.MARKET</TerminalTitle>
            <img src={GC.explosion} width={36} height={36} alt="" />
          </div>

          <TerminalThesis>
            A terminal for trading global stress. Narrative baskets executed via Pear on Hyperliquid.
          </TerminalThesis>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img src={GC.dividerChain} width={140} height={16} alt="" style={{ opacity: 0.7 }} />
          </div>

          <div style={{ marginTop: '24px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.warning} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              THE PROBLEM
            </div>
            <TerminalThesis>
              Trading global risk is fragmented. Oil, FX, tech beta, and &quot;risk-off&quot; all live in separate silos.
              You react to noise instead of the signal.
            </TerminalThesis>
          </div>

          <div style={{ marginTop: '24px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <img src={GC.starBurst} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              THE RESPONSE
            </div>
            <TerminalThesis>
              WAR.MARKET creates one view. You see the stress signal. You trade the stress signal.
              No interpretation layer—just volatility packaged into clear long/short structures.
            </TerminalThesis>
          </div>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <img src={GC.dividerColor} width={140} height={16} alt="" style={{ opacity: 0.7 }} />
          </div>

          <div style={{ marginTop: '24px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              <img src={GC.constructionWorker} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              ROADMAP
            </div>
            <div style={{ color: '#a8b4af', fontSize: '12px', lineHeight: '1.7' }}>
              <div style={{ textDecoration: 'line-through', color: '#8da294' }}>
                <img src={GC.trophy} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                ✓ Win hackathon
              </div>
              <div>UX redesign for production</div>
              <div>Audit / codebase review</div>
              <div>Quant advice on market structures</div>
              <div>Integrate charts from HL</div>
              <div>
                <img src={GC.fire1} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Build GTM team of rabid degens
              </div>
              <div>Launch X</div>
              <div>
                <img src={GC.explosion} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Go LIVE
              </div>
              <div>
                <img src={GC.moneyBag} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                $WAR token
              </div>
              <div>HIP-3 markets for novel WAR indices</div>
              <div>
                <img src={GC.sparkle1} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
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
