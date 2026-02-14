/**
 * Curated animated GIF catalog - now served locally from /public/gifs/
 * Original source: gifcities.org (Internet Archive Geocities collection)
 */

export const GC = {
  // Fire / flames
  fire1: '/gifs/fire1.gif',
  fire2: '/gifs/fire2.gif',
  fire3: '/gifs/fire3.gif',
  fireSmall: '/gifs/fireSmall.gif',
  explosion: '/gifs/explosion.gif',

  // Stars / sparkles
  sparkle1: '/gifs/sparkle1.gif',
  sparkle2: '/gifs/sparkle2.gif',
  starBurst: '/gifs/starBurst.gif',

  // Dividers
  dividerChain: '/gifs/dividerChain.gif',
  dividerColor: '/gifs/dividerColor.gif',

  // Under construction
  constructionWorker: '/gifs/constructionWorker.gif',
  newBadge: '/gifs/newBadge.gif',

  // Globe
  globeLarge: '/gifs/globeLarge.gif',
  globeSmall: '/gifs/globeSmall.gif',

  // Money / gold
  coin: '/gifs/coin.gif',
  moneyBag: '/gifs/moneyBag.gif',

  // Awards / trophies
  coolSite: '/gifs/coolSite.gif',
  trophy: '/gifs/trophy.gif',
  goldMedal: '/gifs/goldMedal.gif',

  // Computer / tech
  computer: '/gifs/computer.gif',

  // War themes (aliases of working GIFs)
  blast: '/gifs/blast.gif',        // explosion
  alert: '/gifs/alert.gif',        // fireSmall
  impact: '/gifs/impact.gif',      // starBurst
  danger: '/gifs/danger.gif',      // fire1
  warning: '/gifs/warning.gif',    // sparkle2

  // Market/theme specific
  energy: '/gifs/energy.gif',      // fire2 - for oil markets
  oilFire: '/gifs/oilFire.gif',    // fire3 - for oil shock
  tech: '/gifs/tech.gif',          // computer - for AI/tech themes
  stock: '/gifs/stock.gif',        // coin - for trading
  cash: '/gifs/cash.gif',          // moneyBag - for money themes
  missile: '/gifs/missile.gif',    // explosion - for military
  signal: '/gifs/signal.gif',      // starBurst - for alerts/signals
} as const;
