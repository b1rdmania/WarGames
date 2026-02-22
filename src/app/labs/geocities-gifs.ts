/**
 * Curated animated GIF catalog - now served locally from /public/gifs/
 * Original source: gifcities.org (Internet Archive Geocities collection)
 */
import { GIF_LIBRARY, GIF_LIBRARY_BY_ALIAS } from '@/lib/gif-library';

const LIBRARY_GIFS: Record<string, string> = Object.fromEntries(
  GIF_LIBRARY.map((item) => [`lib_${item.alias}`, item.path])
);
const libraryPath = (alias: string, fallback: string) => GIF_LIBRARY_BY_ALIAS[alias]?.path ?? fallback;

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
  libAlien: libraryPath('alien', '/gifs/library/retro/alien.gif'),
  libCountdown: libraryPath('countdown', '/gifs/library/markets/countdown.gif'),
  libCountdown2: libraryPath('countdown-2', '/gifs/library/markets/countdown-2.gif'),
  libMatrixNumbers: libraryPath('matrix-numbers', '/gifs/library/markets/matrix-numbers.gif'),
  libLineChart: libraryPath('line-chart', '/gifs/library/markets/line-chart.gif'),
  libDollar: libraryPath('dollar', '/gifs/library/markets/dollar.gif'),
  libDollar2: libraryPath('dollar-2', '/gifs/library/markets/dollar-2.gif'),
  libRadar: libraryPath('radar', '/gifs/library/intel/radar.gif'),
  libReticle: libraryPath('reticle', '/gifs/library/intel/reticle.gif'),
  libTank: libraryPath('tank', '/gifs/library/threat/tank.gif'),

  // In use — kept as named references
  warning: '/gifs/warning.gif',
  signal: '/gifs/signal.gif',
  ...LIBRARY_GIFS,
} as const;
