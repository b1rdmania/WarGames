'use client';

import Link from 'next/link';
import { WarMark } from '@/components/WarMark';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-war-deep flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <WarMark size={64} className="mx-auto mb-6 opacity-60" />
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Page not found</h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/markets"
          className="inline-block px-6 py-3 font-semibold rounded-md transition-colors hover:opacity-90"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--bg-deep)'
          }}
        >
          Go to Markets
        </Link>
      </div>
    </main>
  );
}
