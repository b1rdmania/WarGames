'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DEMO_MARKETS } from '../data';
import { GC } from '../geocities-gifs';
import styles from './style.module.css';

export default function GeoCitiesLabPage() {
  const [selectedId, setSelectedId] = useState(DEMO_MARKETS[0].id);
  const market = DEMO_MARKETS.find((m) => m.id === selectedId) ?? DEMO_MARKETS[0];

  return (
    <main className={styles.page}>
      {/* Fire border top */}
      <div className={styles.fireRow}>
        <img src={GC.fire1} width={80} height={60} alt="" />
        <img src={GC.fire2} width={60} height={60} alt="" />
        <img src={GC.fire1} width={80} height={60} alt="" />
        <img src={GC.fire2} width={60} height={60} alt="" />
        <img src={GC.fire1} width={80} height={60} alt="" />
        <img src={GC.fire2} width={60} height={60} alt="" />
        <img src={GC.fire1} width={80} height={60} alt="" />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <img src={GC.sparkle1} width={40} height={40} alt="" />
        <img src={GC.sparkle1} width={40} height={40} alt="" />
        <img src={GC.sparkle1} width={40} height={40} alt="" />
        <br />
        <span className={styles.title}>
          *~*~* W A R . M A R K E T *~*~*
        </span>
        <br />
        <span className={styles.subtitle}>
          +:.*.+ The Global Tension Terminal!! +:.*.+
        </span>
        <br />
        <img src={GC.sparkle1} width={40} height={40} alt="" />
        <img src={GC.sparkle1} width={40} height={40} alt="" />
        <img src={GC.sparkle1} width={40} height={40} alt="" />
      </div>

      {/* Marquee */}
      <marquee className={styles.marquee} behavior="scroll" direction="left" scrollamount="4">
        *** ALERT *** SCANNING FOR GLOBAL THREATS *** OIL PRICES RISING *** TAIWAN STRAIT TENSIONS HIGH *** AI BUBBLE FORMING *** TRADE NARRATIVES NOT TICKERS *** POWERED BY PEAR PROTOCOL + HYPERLIQUID *** ALERT ***
      </marquee>

      <br />

      {/* Globe */}
      <div className={styles.center}>
        <img src={GC.globeLarge} width={120} height={120} alt="" />
        <br />
        <span className={styles.welcome}>
          Welcome to my Personal WAR ROOM!!!
        </span>
        <br />
        <span className={styles.welcomeText}>
          I built this page because i am a geopolitics nerd but bad at trading!!!<br />
          So i made a thing where u can BET on what happens next in the WORLD!!!<br />
          <span style={{ color: '#FFFF00' }}>One thesis. One button. One position. LFG!!!!!!</span>
        </span>
      </div>

      <br />
      <div className={styles.center}>
        
      </div>
      <br />

      {/* How it works */}
      <div className={styles.howItWorks}>
        <span className={styles.howTitle}>
          ~~ HOW IT WORKS ~~
        </span>
      </div>

      <br />

      <div className={styles.features}>
        {[
          { icon: GC.globeLarge, title: '[THE SIGNAL]', text: 'Oil, rates, tech, war. Its all one regime!! WAR.MARKET collapses the noise into readable stress baskets.' },
          { icon: GC.computer, title: '[HOW IT TRADES]', text: 'You sign once. Pear spins up an agent wallet and executes the basket legs non-custodially. EASY!!!' },
          { icon: GC.moneyBag, title: '[THE MARKETS]', text: 'Pick a narrative like Taiwan Crisis or AI Bubble Pop. Click YES or NO. Boom. Position opened. LFG!!' },
        ].map((item) => (
          <div key={item.title} className={styles.featureCard}>
            <img src={item.icon} width={50} height={50} alt="" /><br />
            <span className={styles.featureTitle}>{item.title}</span><br />
            <span className={styles.featureText}>{item.text}</span>
          </div>
        ))}
      </div>

      <br />
      <div className={styles.center}>
        
      </div>
      <br />

      {/* Market picker */}
      <div className={styles.marketSection}>
        <img src={GC.newBadge} width={50} height={50} alt="" style={{ display: 'inline', verticalAlign: 'middle' }} />
        <span className={styles.marketTitle}> PICK YOUR BATTLE!! </span>
        <img src={GC.newBadge} width={50} height={50} alt="" style={{ display: 'inline', verticalAlign: 'middle' }} />
      </div>

      <br />

      <div className={styles.marketPills}>
        {DEMO_MARKETS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={`${styles.pill} ${market.id === m.id ? styles.pillActive : ''}`}
          >
            {m.code}
            <img src={GC.fireSmall} width={16} height={16} alt="" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
          </button>
        ))}
      </div>

      <br />

      {/* Selected market */}
      <div className={styles.marketCard}>
        <div className={styles.marketCardTitle}>
          <img src={GC.explosion} width={30} height={30} alt="" style={{ verticalAlign: 'middle' }} />
          {' '}{market.title}{' '}
          <img src={GC.explosion} width={30} height={30} alt="" style={{ verticalAlign: 'middle' }} />
        </div>
        <br />
        <span className={styles.marketThesis}>{market.thesis}</span>
        <br /><br />
        <div className={styles.marketLegs}>
          <span style={{ color: '#00FF00', fontWeight: 'bold' }}>LONG:</span> {market.long}
          <br />
          <span style={{ color: '#FF0000', fontWeight: 'bold' }}>SHORT:</span> {market.short}
        </div>
        <br />
        <div className={styles.marketStats}>
          <span><b>Leverage:</b> {market.leverage}x</span>
          <span><b>Spread:</b> {market.spreadBps} bps</span>
          <span><b>Status:</b> {market.regime}</span>
        </div>
      </div>

      <br />

      {/* CTA buttons */}
      <div className={styles.cta}>
        <button className={styles.yesButton}>
          <img src={GC.coin} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: 6 }} />
          YES!!! I BELIEVE!!!
        </button>
        <button className={styles.noButton}>
          <img src={GC.fireSmall} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: 6 }} />
          NO!!! FADE THIS!!!
        </button>
      </div>

      <br />
      <div className={styles.center}>
        <span className={styles.demoNote}>
          (This is a demo!! Real trading is on{' '}
          <a href="/trade" style={{ color: '#00FF00', textDecoration: 'underline' }}>
            /trade
          </a>
          {' '}page!!)
        </span>
      </div>

      <br />
      <div className={styles.center}>
        
      </div>
      <br />

      {/* Awards */}
      <div className={styles.awards}>
        <span className={styles.awardsTitle}>~~ AWARDS & ACHIEVEMENTS ~~</span>
        <br /><br />
        <div className={styles.awardRow}>
          {[
            { src: GC.goldMedal, label: 'HACKATHON\nWINNER!!' },
            { src: GC.coolSite, label: 'COOL SITE\nAWARD' },
            { src: GC.trophy, label: 'PEAR PROTOCOL\nTRACK 1' },
          ].map((a) => (
            <div key={a.label} className={styles.award}>
              <img src={a.src} width={80} height={80} alt="" /><br />
              <span className={styles.awardLabel}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <br />
      <div className={styles.center}>
        
      </div>
      <br />

      {/* Under construction */}
      <div className={styles.center}>
        <img src={GC.constructionWorker} width={150} height={30} alt="" /><br />
        <span className={styles.constructionText}>
          !! THIS SITE IS UNDER CONSTRUCTION !!<br />
          more markets coming soon... community markets... quant reports...<br />
          sorry its not finished yet, im just one degen with a dream!!
        </span>
      </div>

      <br />
      <div className={styles.center}>
        <Link href="/labs" className={styles.backLink}>
          [ BACK TO LAB INDEX ]
        </Link>
      </div>
      <br />

      {/* Fire border bottom */}
      <div className={styles.fireRow}>
        <img src={GC.fire1} width={80} height={60} alt="" />
        <img src={GC.fire3} width={80} height={60} alt="" />
        <img src={GC.fire1} width={80} height={60} alt="" />
        <img src={GC.fire3} width={80} height={60} alt="" />
        <img src={GC.fire1} width={80} height={60} alt="" />
        <img src={GC.fire3} width={80} height={60} alt="" />
        <img src={GC.fire1} width={80} height={60} alt="" />
      </div>

      <div className={styles.footer}>
        WAR.MARKET &copy; 2026 | Made by @b1rdmania | GeoCities Area51/Vault/1337<br />
        &quot;Trade narratives, not tickers.&quot;<br />
        Best viewed in Netscape Navigator 4.0 at 800x600
      </div>
    </main>
  );
}
