'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-earth-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-red-100 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-earth-900 mb-2">Something went wrong!</h2>
                <p className="text-earth-600 mb-6 text-sm">
                    {error.message || "Failed to load the dashboard."}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 bg-earth-900 text-white rounded-xl font-semibold hover:bg-black transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
