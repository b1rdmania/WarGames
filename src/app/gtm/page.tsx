import type { Metadata } from 'next';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalStatusBar,
} from '@/components/terminal';

export const metadata: Metadata = {
  title: 'GTM Brief',
  description: 'WAR.MARKET GTM brief for Pear Protocol partnership.',
  robots: 'noindex, nofollow',
};

const section: React.CSSProperties = {
  marginBottom: '28px',
};

const h: React.CSSProperties = {
  color: 'var(--primary)',
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '10px',
};

const body: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '12px',
  lineHeight: 1.8,
};

const bullet: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '12px',
  lineHeight: 1.8,
  paddingLeft: '14px',
  position: 'relative',
};

const rule: React.CSSProperties = {
  borderTop: '1px solid var(--border)',
  margin: '20px 0',
};

const link: React.CSSProperties = {
  color: 'var(--primary)',
  textDecoration: 'none',
};

export default function GTMPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'GTM', 'OVERVIEW', 'HELP']} />}
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'DOC', value: 'GTM BRIEF' },
            { label: 'FOR', value: 'PEAR PROTOCOL' },
            { label: 'DATE', value: 'FEBRUARY 2026' },
            { label: 'ACCESS', value: 'RESTRICTED' },
          ]}
        />
      }
    >
      <div style={{
        marginTop: '8px',
        border: '1px solid var(--border)',
        minHeight: '62vh',
        padding: '24px',
        maxWidth: '760px',
      }}>
        <TerminalPaneTitle>GTM BRIEF — PEAR PROTOCOL · FEBRUARY 2026</TerminalPaneTitle>

        <div style={rule} />

        <div style={section}>
          <div style={h}>Lead-in</div>
          <p style={body}>
            <strong style={{ color: 'var(--text-primary)' }}>WAR.MARKET</strong> is the Hyperliquid hackathon winner proving composability and showcasing Pear Protocol. It is the narrative trading terminal demo that proves multi-asset baskets on Hyper-EVM + Pear rails. The question now: move it from a functional demo into a working product — and if so, what GTM lift and angles are required?
          </p>
        </div>

        <div style={rule} />

        <div style={section}>
          <div style={h}>What it is today</div>
          {[
            'Functional Hyperliquid composability proof: narrative baskets (Taiwan Strait, Commodities Shock, etc.) live in read-only mode; "GO TO TRADE" opens Pear execution.',
            'Flow exists from landing → markets → detail → trade → portfolio. The experience demonstrates HIP3 markets composability.',
            'Proof-of-concept stage — browse the story, test the rails, but it is not yet a partner-grade live product.',
          ].map((item) => (
            <div key={item} style={{ ...bullet, marginBottom: '8px' }}>
              <span style={{ color: 'var(--primary)', marginRight: '8px' }}>▸</span>{item}
            </div>
          ))}
        </div>

        <div style={rule} />

        <div style={section}>
          <div style={h}>What it&apos;s missing</div>
          {[
            'Basket composition still "me + AI." The markets/baskets need structured financial analysis: scenario logic, risk posture, and quant-style rationale for each weight/leverage pairing.',
            'Narrative packaging: users need to immediately understand the risk/return story and what makes each basket move under stress.',
            'Visibility partner: I am strategic, not a community-builder. I can automate promo (X post + targeted RTs), but this needs a wingman or partner to roll it out coherently and own visibility operations.',
            'Budget/ownership: No easy monetization beyond trading fees. Open to Pear adopting it internally or leaning into a broader partner/co-promotion model. Long-term optionality includes a dedicated HIP3 market, composability with other Hyper-EVM builds, or a deeper commodities basket thesis.',
            'Decision point: stay a polished demo or commit to adding the analysis + partner lift that makes it launch-ready.',
          ].map((item) => (
            <div key={item} style={{ ...bullet, marginBottom: '8px' }}>
              <span style={{ color: 'var(--primary)', marginRight: '8px' }}>▸</span>{item}
            </div>
          ))}
        </div>

        <div style={rule} />

        <div style={section}>
          <div style={h}>GTM plan (if we launch)</div>
          {[
            'Announce the Hyperliquid hackathon win with one focused X post, strategic RTs to start a War Markets X presence.',
            'Deliver quant/analysis notes + co-marketing with whoever does that. Articles about HL / HIP3 / geopolitical trading, etc.',
            'Some UX help needed — docs and design refresh underway but needs to graduate from degen to partner-grade.',
          ].map((item) => (
            <div key={item} style={{ ...bullet, marginBottom: '8px' }}>
              <span style={{ color: 'var(--primary)', marginRight: '8px' }}>▸</span>{item}
            </div>
          ))}
        </div>

        <div style={rule} />

        <div style={section}>
          <div style={h}>Links</div>
          <div style={{ display: 'grid', gap: '6px' }}>
            <div><a style={link} href="https://war.market" target="_blank" rel="noreferrer">war.market</a> — Live demo</div>
            <div><a style={link} href="https://docs.war.market" target="_blank" rel="noreferrer">docs.war.market</a> — Documentation</div>
            <div><a style={link} href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">github.com/b1rdmania/WarGames</a> — Source</div>
          </div>
        </div>
      </div>
    </TerminalShell>
  );
}
