'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        An error occurred while processing your request. Please check the details below.
      </p>
      <div className="w-full max-w-lg rounded-lg border bg-muted/50 p-4 text-left text-sm font-mono text-red-600 overflow-auto whitespace-pre-wrap">
        {error.message || 'Unknown error occurred'}
      </div>
      <div className="flex space-x-4 pt-4">
        <button
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <Link 
          href="/admin/dashboard"
          className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
