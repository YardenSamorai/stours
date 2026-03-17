'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-8 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">משהו השתבש</h1>
        <p className="text-slate-600 mb-8">
          אירעה שגיאה בלתי צפויה. אנא נסו שוב או חזרו לדף הבית.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
          >
            נסו שוב
          </button>
          <a
            href="/"
            className="px-8 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl font-semibold transition-all"
          >
            חזרה לדף הבית
          </a>
        </div>
      </div>
    </div>
  );
}
