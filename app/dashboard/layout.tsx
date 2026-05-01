"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, UserCircle, Sparkles, Trophy, Map } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();
    const isFarmer = pathname.includes('/farmer');

    const links = isFarmer
        ? [
            { name: t('dash_nav_overview'), href: '/dashboard/farmer', icon: LayoutDashboard },
            { name: t('dash_nav_map'), href: '/dashboard/farmer/map', icon: Map },
            { name: t('dash_nav_listings'), href: '/dashboard/farmer/listings', icon: ShoppingBag },
            { name: t('dash_nav_classify'), href: '/dashboard/farmer/classify-waste', icon: Sparkles },
            { name: t('dash_nav_leaderboard'), href: '/dashboard/farmer/leaderboard', icon: Trophy },
            { name: t('dash_nav_profile'), href: '/dashboard/farmer/profile', icon: UserCircle },
        ]
        : [
            { name: t('nav_marketplace'), href: '/dashboard/buyer', icon: ShoppingBag },
            { name: t('dash_nav_orders'), href: '/dashboard/buyer/orders', icon: LayoutDashboard },
            { name: t('dash_nav_company'), href: '/dashboard/buyer/profile', icon: UserCircle },
        ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-earth-50">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-white border-r border-earth-100 flex flex-col fixed h-full z-10 md:relative hidden md:flex">
                <div className="p-6 border-b border-earth-100">
                    <Link href="/" className="text-2xl font-bold text-earth-800 tracking-tight">StubbleX</Link>
                    <div className="mt-2 text-xs font-semibold uppercase text-earth-400 tracking-wider">
                        {isFarmer ? 'Farmer Portal' : 'Buyer Portal'}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-900' : 'text-earth-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
                            >
                                <Icon size={20} />
                                {link.name}
                            </Link>
                        )
                    })}

                    <Link
                        href="/login"
                        onClick={(e) => {
                            localStorage.clear();
                            sessionStorage.clear();
                            document.cookie = "auth_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "auth_phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        {t('dash_nav_signout')}
                    </Link>
                </nav>

                <div className="p-4 border-t border-earth-100">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-earth-600 hover:bg-earth-50 hover:text-earth-900 transition-colors">
                        <Settings size={20} /> {t('dash_nav_settings')}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-earth-100 p-4 flex justify-between items-center z-50 relative">
                    <Link href="/" className="font-bold text-earth-800">StubbleX</Link>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-earth-500">{isFarmer ? 'Farmer' : 'Buyer'}</div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-earth-600">
                            {mobileMenuOpen ? <LogOut size={24} className="rotate-180" /> : <LayoutDashboard size={24} />}
                        </button>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-earth-900/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="mb-8 pt-4 px-2">
                                <span className="text-xl font-bold text-earth-800">Menu</span>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {links.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-earth-100 text-earth-900' : 'text-earth-600 hover:bg-earth-50 hover:text-earth-900'}`}
                                        >
                                            <Icon size={20} />
                                            {link.name}
                                        </Link>
                                    )
                                })}
                                <Link
                                    href="/login"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                                >
                                    <LogOut size={20} />
                                    {t('dash_nav_signout')}
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

