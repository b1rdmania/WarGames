import type { Metadata } from 'next';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';

export const metadata: Metadata = {
  title: 'GTM Brief',
  description: 'WAR.MARKET GTM brief for Pear Protocol partnership.',
  robots: 'noindex, nofollow',
};

export default function GTMPage() {
  return (
    <RiskShell nav={<ControlRoomTopNav />}>
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
              <strong>WAR.MARKET</strong> is the Hyperliquid hackathon winner proving composability and showcasing Pear Protocol. It is the narrative trading terminal demo that proves multi-asset baskets on Hyper-EVM + Pear rails. The question now: move it from a functional demo into a working product—and if so, what GTM lift and angles are required?
            </p>
          </section>

          <div className="tp-rule" />

          {/* What it is today */}
          <section className="tp-section">
            <h2 className="tp-h">What it is today</h2>
            <ul className="tp-bullets">
              <li>Functional Hyperliquid composability proof: narrative baskets (Taiwan Strait, Commodities Shock, etc.) live in read-only mode; "GO TO TRADE" opens Pear execution.</li>
              <li>Flow exists from landing → markets → detail → trade → portfolio. The experience demonstrates HIP3 markets composability.</li>
              <li>Proof-of-concept stage—browse the story, test the rails, but it is not yet a partner-grade live product.</li>
            </ul>
          </section>

          <div className="tp-rule" />

          {/* What it's missing */}
          <section className="tp-section">
            <h2 className="tp-h">What it's missing</h2>
            <ul className="tp-bullets">
              <li>Basket composition still "me + AI." The markets/baskets need structured financial analysis: scenario logic, risk posture, and quant-style rationale for each weight/leverage pairing.</li>
              <li>Narrative packaging: users need to immediately understand the risk/return story and what makes each basket move under stress.</li>
              <li>Visibility partner: I am strategic, not a community-builder. I can automate promo (X post + targeted RTs), but this needs a wingman or partner to roll it out coherently and own visibility operations.</li>
              <li>Budget/ownership: There is no easy monetization beyond trading fees. I'm open to Pear adopting it internally or leaning into a broader partner/co-promotion model—get it working, get it interesting, let it snowball, and see where it leads. Long-term optionality includes a dedicated HIP3 market, composability with other Hyper-EVM builds, or a deeper commodities basket thesis if the buzz continues (hitting ~5k on Twitter unlocks additional plays), but the GTM plan keeps the focus tight on launch readiness for now.</li>
              <li>Decision point: stay a polished demo or commit to adding the analysis + partner lift that makes it launch-ready.</li>
            </ul>
          </section>

          <div className="tp-rule" />

          {/* GTM Plan */}
          <section className="tp-section">
            <h2 className="tp-h">GTM plan (if we launch)</h2>
            <ul className="tp-bullets">
              <li>Announce the Hyperliquid hackathon win with one focused X post strategic RTs to start a War Markets X presence.</li>
              <li>Deliver quant/analysis notes + co-marketing with whoever does that. Articles about HL / HIP3 / geopolitical trading, etc.</li>
              <li>Might need some UX help—I can do most of it and have started docs and a design refresh, but it's gone from degen to a bit too generic.</li>
            </ul>
          </section>

          <div className="tp-rule" />

          {/* Links */}
          <section className="tp-section">
            <h2 className="tp-h">Links</h2>
            <ul className="tp-bullets">
              <li><a className="tp-link" href="https://war.market" target="_blank" rel="noreferrer">Live demo</a></li>
              <li><a className="tp-link" href="https://docs.war.market" target="_blank" rel="noreferrer">Documentation</a></li>
              <li><a className="tp-link" href="https://github.com/b1rdmania/WarGames" target="_blank" rel="noreferrer">Source</a></li>
            </ul>
          </section>
        </div>
      </div>
    </RiskShell>
  );
}
