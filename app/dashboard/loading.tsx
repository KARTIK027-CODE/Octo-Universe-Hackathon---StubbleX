import { Factory } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-earth-50">
            <div className="animate-spin text-earth-600 mb-4">
                <Factory size={48} />
            </div>
            <h2 className="text-xl font-bold text-earth-800 animate-pulse">Loading Dashboard...</h2>
            <p className="text-earth-500 text-sm mt-2">Preparing your sustainability data</p>
        </div>
    );
}
