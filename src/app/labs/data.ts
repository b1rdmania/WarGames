export type DemoMarket = {
  id: string;
  code: string;
  title: string;
  thesis: string;
  long: string;
  short: string;
  leverage: number;
  regime: 'LIVE' | 'WATCH' | 'PAUSED';
  spreadBps: number;
};

export type DemoEvent = {
  at: string;
  level: 'INFO' | 'ALERT' | 'EXEC' | 'FAIL';
  text: string;
};

export const DEMO_MARKETS: DemoMarket[] = [
  {
    id: 'taiwan-semiconductor-shock',
    code: 'TWN-SHK',
    title: 'Taiwan Strait Escalation',
    thesis: 'Defense and legacy chips outperform consumer hardware names.',
    long: 'LMT+INTC+ORCL',
    short: 'AAPL+TSLA',
    leverage: 4,
    regime: 'LIVE',
    spreadBps: 9,
  },
  {
    id: 'ai-infra-squeeze',
    code: 'AI-INF',
    title: 'AI Infra Squeeze',
    thesis: 'Compute suppliers outrun app-layer names in capex cycle.',
    long: 'NVDA+AMD+ANET',
    short: 'SNOW+CRM',
    leverage: 3,
    regime: 'LIVE',
    spreadBps: 8,
  },
  {
    id: 'oil-supply-shock',
    code: 'OIL-SHK',
    title: 'Gulf Supply Shock',
    thesis: 'Energy majors benefit while airlines and freight compress.',
    long: 'XOM+CVX',
    short: 'DAL+FDX',
    leverage: 5,
    regime: 'WATCH',
    spreadBps: 12,
  },
  {
    id: 'usd-risk-off',
    code: 'USD-RSK',
    title: 'Dollar Risk-Off',
    thesis: 'Dollar strength pressures EM and high beta growth.',
    long: 'UUP+GLD',
    short: 'EEM+ARKK',
    leverage: 3,
    regime: 'LIVE',
    spreadBps: 11,
  },
  {
    id: 'eth-dominance-shift',
    code: 'ETH-DOM',
    title: 'ETH Dominance Shift',
    thesis: 'ETH beta outpaces BTC and alt index mean-reverts.',
    long: 'ETH',
    short: 'BTC+ALT',
    leverage: 4,
    regime: 'PAUSED',
    spreadBps: 15,
  },
];

export const EVENT_LOG = [
  '18:42:11  FEED ONLINE    24 markets synchronized',
  '18:43:02  AUTH SUCCESS   Operator session signed',
  '18:43:14  THESIS ARMED   AI-INF / YES / $25',
  '18:43:18  ORDER ACCEPTED Venue ack 41ms',
  '18:43:21  POSITION LIVE  Ticket WM-8831',
  '18:44:05  RISK ALERT     Spread widened on OIL-SHK',
  '18:44:12  HEARTBEAT OK   All systems nominal',
];

export const EVENT_ENTRIES: DemoEvent[] = [
  { at: '18:42:11', level: 'INFO', text: 'Feed online. 24 markets synchronized.' },
  { at: '18:43:02', level: 'INFO', text: 'Operator session authenticated.' },
  { at: '18:43:14', level: 'EXEC', text: 'Thesis armed on AI-INF / YES / $25.' },
  { at: '18:43:18', level: 'EXEC', text: 'Order accepted by venue in 41ms.' },
  { at: '18:43:21', level: 'EXEC', text: 'Position live. Ticket WM-8831.' },
  { at: '18:44:05', level: 'ALERT', text: 'Spread widened on OIL-SHK.' },
  { at: '18:44:12', level: 'INFO', text: 'Heartbeat normal across centers.' },
];
