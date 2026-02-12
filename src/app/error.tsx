'use client';

import { useEffect } from 'react';
import { WarMark } from '@/components/WarMark';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-war-deep flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <WarMark size={64} className="mx-auto mb-6 opacity-60" />
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Something went wrong</h1>
        <p className="text-text-secondary mb-8">
          An unexpected error occurred. Try again or return to markets.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 border border-war-surface text-text-primary font-semibold rounded-md hover:bg-war-surface transition-colors"
          >
            Try again
          </button>
          <a
            href="/markets"
            className="px-6 py-3 font-semibold rounded-md transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--bg-deep)'
            }}
          >
            Go to Markets
          </a>
        </div>
      </div>
    </main>
  );
}
