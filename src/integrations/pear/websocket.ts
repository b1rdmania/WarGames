import { emitDebugLog } from '@/lib/debugLog';

// Spec: docs/pear-docs/WEBSOCKET.md
const PEAR_WS_URL = 'wss://hl-v2.pearprotocol.io/ws';

export type PearWsChannel = 'positions' | 'open-orders' | 'trade-histories' | 'twap-details' | 'notifications' | 'account-summary' | 'market-data';

export function connectPearWebsocket(args: {
  address: string;
  channels: PearWsChannel[];
  onMessage?: (data: any) => void;
  onError?: (ev: Event) => void;
}) {
  const ws = new WebSocket(PEAR_WS_URL);

  ws.addEventListener('open', () => {
    emitDebugLog({ level: 'info', scope: 'ws', message: 'connected', data: { url: PEAR_WS_URL } });
    ws.send(
      JSON.stringify({
        action: 'subscribe',
        address: args.address,
        channels: args.channels,
      })
    );
    emitDebugLog({ level: 'info', scope: 'ws', message: 'subscribed', data: { address: args.address, channels: args.channels } });
  });

  ws.addEventListener('message', (evt) => {
    try {
      const data = JSON.parse(String(evt.data));
      args.onMessage?.(data);
    } catch {
      // Some servers send non-JSON pings; ignore but log once in debug console.
      emitDebugLog({ level: 'warn', scope: 'ws', message: 'non-json message', data: { sample: String(evt.data).slice(0, 120) } });
    }
  });

  ws.addEventListener('error', (ev) => {
    emitDebugLog({ level: 'warn', scope: 'ws', message: 'error' });
    args.onError?.(ev);
  });

  ws.addEventListener('close', () => {
    emitDebugLog({ level: 'warn', scope: 'ws', message: 'closed' });
  });

  return ws;
}

