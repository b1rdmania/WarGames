/**
 * Curated animated GIF catalog - now served locally from /public/gifs/
 * Original source: gifcities.org (Internet Archive Geocities collection)
 */
import { GIF_LIBRARY } from '@/lib/gif-library';

const LIBRARY_GIFS: Record<string, string> = Object.fromEntries(
  GIF_LIBRARY.map((item) => [`lib_${item.alias}`, item.path])
);

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

  // Under construction
  constructionWorker: '/gifs/constructionWorker.gif',
  newBadge: '/gifs/newBadge.gif',

  // Globes / world
  globeLarge: '/gifs/globeLarge.gif',
  globe2: '/gifs/globe2.gif',
  earthSpin: '/gifs/earthSpin.gif',
  worldMap: '/gifs/worldMap.gif',

  // Money / gold
  coin: '/gifs/coin.gif',
  moneyBag: '/gifs/moneyBag.gif',

  // Awards / trophies
  coolSite: '/gifs/coolSite.gif',
  trophy: '/gifs/trophy.gif',
  goldMedal: '/gifs/goldMedal.gif',

  // Computer / tech
  computer: '/gifs/computer.gif',

  // Military / war room
  missile2: '/gifs/missile2.gif',
  bomb: '/gifs/bomb.gif',
  tank: '/gifs/tank.gif',
  nuclear: '/gifs/nuclear.gif',
  skull: '/gifs/skull.gif',
  radar: '/gifs/radar.gif',
  target: '/gifs/target.gif',
  satellite: '/gifs/satellite.gif',

  // Markets / urgency
  dollar: '/gifs/dollar.gif',
  chart: '/gifs/chart.gif',
  atom: '/gifs/atom.gif',

  // Reviewed library (accepted picks)
  libAlien: '/gifs/library/retro/alien.gif',
  libCountdown: '/gifs/library/stats/countdown.gif',
  libCountdown2: '/gifs/library/stats/countdown-2.gif',
  libMatrixNumbers: '/gifs/library/stats/matrix-numbers.gif',
  libLineChart: '/gifs/library/charts/line-chart.gif',
  libDollar: '/gifs/library/money/dollar.gif',
  libDollar2: '/gifs/library/money/dollar-2.gif',
  libRadar: '/gifs/library/intel/radar.gif',
  libReticle: '/gifs/library/intel/reticle.gif',
  libTank: '/gifs/library/threat/tank.gif',

  // In use — kept as named references
  warning: '/gifs/warning.gif',
  signal: '/gifs/signal.gif',
  ...LIBRARY_GIFS,
} as const;
