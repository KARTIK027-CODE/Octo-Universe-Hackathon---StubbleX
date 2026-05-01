import { redirect } from 'next/navigation';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string }>
}) {
    const params = await searchParams;

    if (params.role === 'farmer') {
        redirect('/dashboard/farmer');
    } else if (params.role === 'buyer') {
        redirect('/dashboard/buyer');
    }

    return (
        <div className="min-h-screen bg-earth-50 p-8">
            <h1 className="text-3xl font-bold text-earth-900 mb-6">Dashboard</h1>
            <div className="p-12 border-2 border-dashed border-earth-300 rounded-xl flex items-center justify-center text-earth-500">
                Select a role to view dashboard
            </div>
        </div>
    )
}
