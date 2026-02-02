import Link from 'next/link';
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
          <div className="tp-hero">
            <div className="tp-title">GTM BRIEF</div>
            <div className="tp-lede">
              For Pear Protocol · February 2026
            </div>
          </div>

          <div className="tp-rule" />

          <div className="tp-section">
            <div className="tp-h">LEAD-IN</div>
            <div className="tp-body">
              WAR.MARKET is the <span className="text-white">Hyperliquid hackathon winner</span> proving composability and showcasing Pear Protocol.
              It is the narrative trading terminal with multi-asset baskets running on Hyper-EVM + Pear rails.
            </div>
            <div className="tp-body mt-4">
              <span className="text-white">The question now:</span> move it from a functional demo into a working product, and if so, what GTM lift and angles are required?
            </div>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section">
            <div className="tp-h">WHAT IT IS TODAY</div>
            <div className="tp-kv">
              <div className="tp-kv-row">
                <div className="tp-kv-k">Composability proof</div>
                <div className="tp-kv-v">Narrative baskets (Taiwan Strait, Commodities Shock, etc.) live in read-only mode; "GO TO TRADE" opens Pear execution</div>
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
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section">
            <div className="tp-h">WHAT IT'S MISSING</div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">Quant rationale</div>
              <div className="tp-body">
                Basket composition is still "me + AI." The markets need structured financial analysis: scenario logic, risk posture, and quant-style rationale for each weight/leverage pairing.
              </div>
            </div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">Narrative packaging</div>
              <div className="tp-body">
                Users need to immediately understand the risk/return story and what makes each basket move under stress.
              </div>
            </div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">Partner support</div>
              <div className="tp-body">
                I am strategic, not a community-builder. I can automate promo (X post + targeted RTs) but this will need a wingman or partner to roll it out coherently and own the visibility operations.
              </div>
            </div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">Decision point</div>
              <div className="tp-body">
                Stay a polished demo or commit to adding the analysis + partner lift that makes it launch-ready.
              </div>
            </div>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section">
            <div className="tp-h">GTM PLAN (IF WE LAUNCH)</div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">1. Announce the win</div>
              <ul className="tp-bullets tp-body">
                <li>One focused X post + strategic RTs</li>
                <li>Start a War Markets X presence</li>
              </ul>
            </div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">2. Quant content</div>
              <ul className="tp-bullets tp-body">
                <li>Analysis notes + co-marketing with whoever provides that</li>
                <li>Articles about HL / HIP3 / geopolitical trading</li>
              </ul>
            </div>

            <div className="mt-6">
              <div className="text-white text-sm font-medium mb-2">3. Focus</div>
              <ul className="tp-bullets tp-body">
                <li>Clarity around the launch decision before layering other efforts</li>
              </ul>
            </div>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section">
            <div className="tp-h">FUTURE ANGLES</div>
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
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section">
            <div className="tp-h">LINKS</div>
            <div className="tp-body flex flex-wrap items-center">
              <a
                className="text-pear-lime underline whitespace-nowrap"
                href="https://war.market"
                target="_blank"
                rel="noreferrer"
              >
                Live demo
              </a>
              <span className="mx-3 text-gray-600">·</span>
              <a
                className="text-pear-lime underline whitespace-nowrap"
                href="https://docs.war.market"
                target="_blank"
                rel="noreferrer"
              >
                Documentation
              </a>
              <span className="mx-3 text-gray-600">·</span>
              <a
                className="text-pear-lime underline whitespace-nowrap"
                href="https://github.com/b1rdmania/WarGames"
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
            </div>
          </div>

          <div className="tp-rule mt-8" />

          <div className="tp-section text-center">
            <div className="tp-body text-war-muted">
              war.market · Hyperliquid Hackathon Winner · Pear Protocol Execution
            </div>
          </div>
        </div>
      </div>
    </RiskShell>
  );
}
