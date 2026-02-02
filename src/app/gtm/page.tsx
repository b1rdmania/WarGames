import type { Metadata } from 'next';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';

export const metadata: Metadata = {
  title: 'GTM Brief',
  description: 'WAR.MARKET GTM brief for Pear Protocol partnership.',
  robots: 'noindex, nofollow',
};

export default function GTMPage() {
  return (
    <RiskShell nav={<TerminalTopNav />}>
      <div className="tp-wrap">
        <div className="tp-frame">
          {/* Page Header */}
          <div className="tp-hero">
            <h1 className="tp-title">GTM Brief</h1>
            <p className="tp-lede">For Pear Protocol · February 2026</p>
          </div>

          <div className="tp-rule" style={{ marginTop: 0 }} />

          {/* Lead-in */}
          <section className="tp-section">
            <h2 className="tp-h">Lead-in</h2>
            <p className="tp-body">
              <strong>WAR.MARKET</strong> is the Hyperliquid hackathon winner proving composability and showcasing Pear Protocol. It is the narrative trading terminal with multi-asset baskets running on Hyper-EVM + Pear rails.
            </p>
            <p className="tp-body">
              <strong>The question now:</strong> move it from a functional demo into a working product, and if so, what GTM lift and angles are required?
            </p>
          </section>

          <div className="tp-rule" />

          {/* What it is today */}
          <section className="tp-section">
            <h2 className="tp-h">What it is today</h2>
            <div className="tp-kv">
              <div className="tp-kv-row">
                <div className="tp-kv-k">Composability proof</div>
                <div className="tp-kv-v">Narrative baskets (Taiwan Strait, Commodities Shock, etc.) live in read-only mode; "Go to Trade" opens Pear execution</div>
              </div>
              <div className="tp-kv-row">
                <div className="tp-kv-k">Full funnel</div>
                <div className="tp-kv-v">Landing → Markets → Detail → Trade → Portfolio</div>
              </div>
              <div className="tp-kv-row">
                <div className="tp-kv-k">HIP3 demo</div>
                <div className="tp-kv-v">The experience demonstrates HIP3 markets composability</div>
              </div>
              <div className="tp-kv-row">
                <div className="tp-kv-k">Stage</div>
                <div className="tp-kv-v">Proof-of-concept—browse the story, test the rails, but not yet partner-grade live product</div>
              </div>
            </div>
          </section>

          <div className="tp-rule" />

          {/* What it's missing */}
          <section className="tp-section">
            <h2 className="tp-h">What it's missing</h2>

            <h3 className="tp-h2">Quant rationale</h3>
            <p className="tp-body">
              Basket composition is still "me + AI." The markets need structured financial analysis: scenario logic, risk posture, and quant-style rationale for each weight/leverage pairing.
            </p>

            <h3 className="tp-h2">Narrative packaging</h3>
            <p className="tp-body">
              Users need to immediately understand the risk/return story and what makes each basket move under stress.
            </p>

            <h3 className="tp-h2">Partner support</h3>
            <p className="tp-body">
              I am strategic, not a community-builder. I can automate promo (X post + targeted RTs) but this will need a wingman or partner to roll it out coherently and own the visibility operations.
            </p>

            <h3 className="tp-h2">Decision point</h3>
            <p className="tp-body">
              Stay a polished demo or commit to adding the analysis + partner lift that makes it launch-ready.
            </p>
          </section>

          <div className="tp-rule" />

          {/* GTM Plan */}
          <section className="tp-section">
            <h2 className="tp-h">GTM plan (if we launch)</h2>

            <h3 className="tp-h2">1. Announce the win</h3>
            <ul className="tp-bullets">
              <li>One focused X post + strategic RTs</li>
              <li>Start a War Markets X presence</li>
            </ul>

            <h3 className="tp-h2">2. Quant content</h3>
            <ul className="tp-bullets">
              <li>Analysis notes + co-marketing with whoever provides that</li>
              <li>Articles about HL / HIP3 / geopolitical trading</li>
            </ul>

            <h3 className="tp-h2">3. Focus</h3>
            <ul className="tp-bullets">
              <li>Clarity around the launch decision before layering other efforts</li>
            </ul>
          </section>

          <div className="tp-rule" />

          {/* Future angles */}
          <section className="tp-section">
            <h2 className="tp-h">Future angles</h2>
            <div className="tp-kv">
              <div className="tp-kv-row">
                <div className="tp-kv-k">HIP3 market</div>
                <div className="tp-kv-v">Spin the idea into its own HIP3 market</div>
              </div>
              <div className="tp-kv-row">
                <div className="tp-kv-k">Composability</div>
                <div className="tp-kv-v">Explore composability with other Hyper-EVM builds</div>
              </div>
              <div className="tp-kv-row">
                <div className="tp-kv-k">Commodities</div>
                <div className="tp-kv-v">Go deeper into real commodities basket thesis if buzz continues</div>
              </div>
              <div className="tp-kv-row">
                <div className="tp-kv-k">Scale trigger</div>
                <div className="tp-kv-v">~5k Twitter unlocks optional plays, but GTM keeps focus tight on launch readiness for now</div>
              </div>
            </div>
          </section>

          <div className="tp-rule" />

          {/* Links */}
          <section className="tp-section">
            <h2 className="tp-h">Links</h2>
            <p className="tp-body">
              <a className="tp-link" href="https://war.market" target="_blank" rel="noreferrer">Live demo</a>
              <span className="mx-3 text-[var(--text-muted)]">·</span>
              <a className="tp-link" href="https://docs.war.market" target="_blank" rel="noreferrer">Documentation</a>
              <span className="mx-3 text-[var(--text-muted)]">·</span>
              <a className="tp-link" href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">Source</a>
            </p>
          </section>

          <div className="tp-rule" />

          {/* Footer */}
          <footer className="tp-footer">
            war.market · Hyperliquid Hackathon Winner · Pear Protocol Execution
          </footer>
        </div>
      </div>
    </RiskShell>
  );
}
