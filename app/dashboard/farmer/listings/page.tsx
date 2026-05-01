'use client';
import React, { useState, useEffect } from 'react';
import { Package, XCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function MyListingsPage() {
    const { t } = useLanguage();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const fetchListings = async () => {
            const authPhone = getCookie('auth_phone');
            if (!authPhone) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/get-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone_number: authPhone })
                });
                const data = await res.json();
                if (data.status === 'success' && data.profile.listings) {
                    setListings(data.profile.listings);
                }
            } catch (e) {
                console.error("Failed to fetch listings", e);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/farmer" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('list_title')}</h1>
                        <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Your active biomass inventory</p>
                    </div>
                </div>
                <Link href="/dashboard/farmer" className="px-8 py-4 bg-emerald-900 text-white rounded-[1.5rem] font-black hover:bg-black transition-all shadow-xl flex items-center gap-3">
                    <Sparkles size={20} />
                    {t('list_new_btn').toUpperCase()}
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="animate-spin text-emerald-600" size={48} />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Pinging Storage Hub...</p>
                </div>
            ) : listings.length === 0 ? (
                <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-8">
                        <Package size={48} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">No active listings found</h2>
                    <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto">Start by creating your first listing to track your stubble inventory and earnings.</p>
                    <Link href="/dashboard/farmer" className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-100 text-emerald-700 rounded-2xl font-black hover:bg-emerald-200 transition-all uppercase tracking-widest text-sm">
                        Create Listing Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {listings.map((item, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-start justify-between group hover:border-emerald-500 transition-all">
                            <div className="flex gap-6">
                                <div className="p-6 bg-slate-50 rounded-[2rem] text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                                    <Package size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t(item.type_key) || item.type_key.replace('_', ' ').toUpperCase()}</h3>
                                    <div className="text-slate-400 font-bold text-sm tracking-tight">{t('list_on')} {item.date}</div>
                                    <div className="pt-4 flex items-center gap-3">
                                        <div className="px-5 py-2 bg-emerald-50 text-emerald-700 font-black rounded-xl text-xs uppercase tracking-widest">{item.qty} TONS</div>
                                        <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${item.status_key === 'list_status_active' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {t(item.status_key) || "ACTIVE"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Value</div>
                                <div className="text-3xl font-black text-emerald-700">{item.price || '₹0'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
