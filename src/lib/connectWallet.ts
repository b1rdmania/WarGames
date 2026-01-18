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
  const connector = connectors?.[0];
  if (!connector) throw new Error('No wallet connector available');

  try {
    await connectAsync({ connector });
    return;
  } catch (e) {
    const msg = getErrMessage(e);

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
      } catch (e2) {
        // Last resort: ask the provider directly for accounts (helps when wallet is locked).
        try {
          const provider: any = await (connector as any).getProvider?.();
          await provider?.request?.({ method: 'eth_requestAccounts' });
          await connectAsync({ connector });
          return;
        } catch {
          throw new Error('Wallet appears connected but locked. Open your wallet, unlock it, then click CONNECT again.');
        }
      }
    }

    throw new Error(msg || 'Failed to connect wallet');
  }
}

