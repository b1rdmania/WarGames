import type { Connector } from 'wagmi';

type ConnectAsync = (args: { connector: Connector }) => Promise<unknown>;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getErrMessage(e: unknown): string {
  const anyE = e as any;
  return (anyE?.shortMessage || anyE?.message || '').toString();
}

function isAlreadyConnectedErr(msg: string) {
  return msg.toLowerCase().includes('connector already connected');
}

function isUserRejected(e: unknown, msg: string) {
  const anyE = e as any;
  return anyE?.code === 4001 || msg.toLowerCase().includes('user rejected') || msg.toLowerCase().includes('rejected');
}

function isMobileBrowser() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod/i.test(ua);
}

function getConnectorId(c: Connector): string {
  return ((c as any)?.id || '').toString().toLowerCase();
}

function orderConnectors(connectors: readonly Connector[]): Connector[] {
  const mobile = isMobileBrowser();
  const ranked = [...connectors];
  ranked.sort((a, b) => {
    const aid = getConnectorId(a);
    const bid = getConnectorId(b);
    const rank = (id: string) => {
      if (mobile && id.includes('walletconnect')) return 0;
      if (mobile && id.includes('coinbase')) return 1;
      if (id.includes('injected')) return 2;
      return 3;
    };
    return rank(aid) - rank(bid);
  });
  return ranked;
}

/**
 * Connect wallet robustly across browsers/wallet states.
 * Handles the wagmi "Connector already connected" case which can happen when the
 * injected provider is "connected to the site" but the wallet is locked / no account is exposed.
 */
export async function connectWalletSafely(opts: {
  connectors: readonly Connector[];
  connectAsync: ConnectAsync;
  disconnect?: () => void;
}) {
  const { connectors, connectAsync, disconnect } = opts;
  if (!connectors?.length) throw new Error('No wallet connector available');

  const ordered = orderConnectors(connectors);
  let lastErrorMessage = '';
  const mobile = isMobileBrowser();

  for (const connector of ordered) {
    try {
      await connectAsync({ connector });
      return;
    } catch (e) {
      const msg = getErrMessage(e);
      lastErrorMessage = msg || 'Failed to connect wallet';

      if (isUserRejected(e, msg)) {
        throw new Error('Connection rejected in wallet.');
      }

      if (isAlreadyConnectedErr(msg)) {
        // Try clearing stale connector state, then retry.
        try {
          disconnect?.();
        } catch {
          // ignore
        }
        await sleep(50);

        try {
          await connectAsync({ connector });
          return;
        } catch {
          // Last resort: ask the provider directly for accounts (helps when wallet is locked).
          try {
            const provider: any = await (connector as any).getProvider?.();
            await provider?.request?.({ method: 'eth_requestAccounts' });
            await connectAsync({ connector });
            return;
          } catch {
            lastErrorMessage =
              'Wallet appears connected but locked. Open your wallet, unlock it, then click CONNECT again.';
          }
        }
      }
    }
  }

  if (mobile) {
    throw new Error(
      `${lastErrorMessage || 'Failed to connect wallet'}. On mobile, use wallet in-app browser or set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID for deep-link connection.`
    );
  }
  throw new Error(lastErrorMessage || 'Failed to connect wallet');
}
