import { executeRoute, resumeRoute } from '@lifi/sdk';
import type { Route } from '@lifi/sdk';

export interface ExecutionCallbacks {
  onStatusUpdate: (status: string) => void;
  onTxHash: (hash: string) => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export async function executeBridge(
  route: Route,
  callbacks: ExecutionCallbacks
) {
  try {
    callbacks.onStatusUpdate('Preparing transaction...');

    await executeRoute(route, {
      updateRouteHook(updatedRoute) {
        const step = updatedRoute.steps[0];
        const status = step.execution?.status;

        if (status) {
          callbacks.onStatusUpdate(formatStatus(status));
        }

        // Extract transaction hash
        step.execution?.process.forEach(process => {
          if (process.txHash) {
            callbacks.onTxHash(process.txHash);
          }
        });
      },

      acceptExchangeRateUpdateHook: async (params) => {
        const { oldToAmount, newToAmount } = params;
        const change = Math.abs((Number(newToAmount) - Number(oldToAmount)) / Number(oldToAmount));
        return change < 0.02; // Accept up to 2% slippage
      },

      switchChainHook: async (requiredChainId) => {
        callbacks.onStatusUpdate(`Please switch to chain ${requiredChainId}`);
        // Wagmi will handle the actual switch
        return {} as any;
      },
    });

    callbacks.onSuccess();
  } catch (error) {
    console.error('Bridge execution failed:', error);

    // Try to resume
    if (typeof window !== 'undefined') {
      const savedRoute = localStorage.getItem('activeRoute');
      if (savedRoute) {
        try {
          await resumeRoute(JSON.parse(savedRoute));
          callbacks.onSuccess();
          return;
        } catch (resumeError) {
          console.error('Resume failed:', resumeError);
        }
      }
    }

    callbacks.onError(error as Error);
  }
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'NOT_STARTED': 'Waiting to start...',
    'PENDING': 'Transaction pending...',
    'DONE': 'Transaction complete!',
    'FAILED': 'Transaction failed',
  };

  return statusMap[status] || status;
}
