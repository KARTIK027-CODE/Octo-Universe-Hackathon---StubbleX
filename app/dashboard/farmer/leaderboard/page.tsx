"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Leaf, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function LeaderboardPage() {
    const { t } = useLanguage();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const authPhone = getCookie('auth_phone');

        // Mock data for other users
        const mockLeaderboard = [
            { id: '1', rank: 1, name: 'Rajesh Kumar', location: 'Punjab, India', green_score: 8200, co2_saved: '1200kg', waste_recycled: '5000kg', badge: 'Eco Champion' },
            { id: '2', rank: 2, name: 'Sunita Sharma', location: 'Haryana, India', green_score: 7500, co2_saved: '1050kg', waste_recycled: '4200kg', badge: 'Green Guardian' },
            { id: '3', rank: 3, name: 'Vikram Singh', location: 'Uttar Pradesh, India', green_score: 6800, co2_saved: '980kg', waste_recycled: '3800kg', badge: 'Sustainability Hero' },
            { id: '4', rank: 4, name: 'Amit Patel', location: 'Gujarat, India', green_score: 6100, co2_saved: '850kg', waste_recycled: '3200kg', badge: 'Earth Saver' },
            { id: '6', rank: 6, name: 'Mohammed Ali', location: 'Kerala, India', green_score: 4800, co2_saved: '720kg', waste_recycled: '2500kg', badge: 'Nature Lover' }
        ];

        const fetchUserProfile = async () => {
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
                if (data.status === 'success') {
                    const profile = data.profile;
                    setUserRank({
                        id: 'current-user',
                        rank: profile.stats?.score > 5500 ? 5 : (profile.stats?.score > 0 ? 7 : 'N/A'),
                        name: profile.name || t('lead_you'),
                        green_score: profile.stats?.score || 0,
                        co2_saved: `${profile.stats?.co2 || 0} Tons`,
                        waste_recycled: `${profile.stats?.waste || 0} Tons`
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLeaderboard(mockLeaderboard);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [t]);

    if (loading) return <div className="p-8 text-center text-earth-600">Loading Rankings...</div>;

    return (
        <div className="relative min-h-full pb-24">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-yellow-200/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 relative z-10 px-4">
                <header className="mb-12 text-center pt-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white shadow-sm text-green-800 text-sm font-bold mb-6"
                    >
                        <TrendingUp size={16} /> {t('lead_weekly')}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-black text-earth-900 mb-4 tracking-tight"
                    >
                        {t('lead_title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800">{t('lead_title_part2')}</span>
                    </motion.h1>
                    <p className="text-earth-600 max-w-lg mx-auto text-lg leading-relaxed">
                        {t('lead_subtitle')}
                        <br />
                        <span className="text-sm font-semibold text-green-700 mt-2 block">
                            {t('lead_rank_note')}
                        </span>
                    </p>
                </header>

                <div className="flex justify-center items-end gap-4 h-96 mb-16 px-2">
                    {/* Rank 2 (Silver) */}
                    <Link href={`/dashboard/farmer/profile/${leaderboard[1]?.id || '#'}`} className="w-full max-w-[200px] relative group flex flex-col justify-end cursor-pointer">
                        <motion.div
                            initial={{ height: '30%', opacity: 0 }}
                            animate={{ height: '70%', opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 60, delay: 0.2 }}
                            className="w-full h-full"
                        >
                            <div className="relative w-full h-full bg-gradient-to-b from-gray-100 to-white opacity-90 rounded-t-3xl shadow-xl backdrop-blur-sm border border-white/50 flex flex-col items-center pt-12 p-4 text-center group-hover:bg-white group-hover:scale-105 transition-all">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 rounded-full border-4 border-gray-200 shadow-lg overflow-hidden bg-gray-100 relative group-hover:-translate-y-2 transition-transform duration-300">
                                        <div className="absolute inset-0 bg-gray-400/10 z-10"></div>
                                        <img src="/images/sunita.png" alt="Sunita" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">#2</div>
                                </div>
                                <h3 className="font-bold text-earth-900 mt-4 line-clamp-1 text-lg">{leaderboard[1]?.name || 'Loading...'}</h3>
                                <div className="text-3xl font-black text-gray-400 mt-1">{leaderboard[1]?.green_score || 0}</div>
                                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">{t('lead_points')}</div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Rank 1 (Gold) */}
                    <Link href={`/dashboard/farmer/profile/${leaderboard[0]?.id || '#'}`} className="w-full max-w-[240px] relative group flex flex-col justify-end z-20 cursor-pointer">
                        <motion.div
                            initial={{ height: '30%', opacity: 0 }}
                            animate={{ height: '85%', opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 60, delay: 0.1 }}
                            className="w-full h-full"
                        >
                            <div className="absolute top-[-110px] left-1/2 -translate-x-1/2 animate-bounce-slow z-30">
                                <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-xl" fill="currentColor" />
                            </div>
                            <div className="relative w-full h-full bg-gradient-to-b from-yellow-50 to-white opacity-95 rounded-t-[2.5rem] shadow-2xl border-2 border-yellow-200/50 flex flex-col items-center pt-16 p-4 text-center group-hover:bg-white group-hover:scale-105 transition-all">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                    <div className="w-28 h-28 rounded-full border-4 border-yellow-300 shadow-xl overflow-hidden bg-yellow-50 relative group-hover:-translate-y-2 transition-transform duration-300 ring-4 ring-yellow-100">
                                        <img src="/images/rajesh.png" alt="Rajesh" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-base font-black px-4 py-1 rounded-full shadow-md flex items-center gap-1 z-20">
                                        <span className="text-yellow-101">★</span> 1
                                    </div>
                                </div>
                                <h3 className="font-bold text-2xl text-earth-900 mt-4">{leaderboard[0]?.name || 'Loading...'}</h3>
                                <div className="text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full mt-2 mb-3">
                                    {leaderboard[0]?.location || 'India'}
                                </div>
                                <div className="text-5xl font-black text-yellow-500 tracking-tight">{leaderboard[0]?.green_score || 0}</div>
                                <div className="text-xs font-bold text-yellow-300 uppercase tracking-widest mt-1">{t('lead_points')}</div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Rank 3 (Bronze) */}
                    <Link href={`/dashboard/farmer/profile/${leaderboard[2]?.id || '#'}`} className="w-full max-w-[200px] relative group flex flex-col justify-end cursor-pointer">
                        <motion.div
                            initial={{ height: '30%', opacity: 0 }}
                            animate={{ height: '60%', opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 60, delay: 0.3 }}
                            className="w-full h-full"
                        >
                            <div className="relative w-full h-full bg-gradient-to-b from-orange-50 to-white opacity-90 rounded-t-3xl shadow-xl backdrop-blur-sm border border-white/50 flex flex-col items-center pt-12 p-4 text-center group-hover:bg-white group-hover:scale-105 transition-all">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 rounded-full border-4 border-orange-200 shadow-lg overflow-hidden bg-orange-50 relative group-hover:-translate-y-2 transition-transform duration-300">
                                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-400 font-bold text-xl">VS</div>
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">#3</div>
                                </div>
                                <h3 className="font-bold text-earth-900 mt-4 line-clamp-1 text-lg">{leaderboard[2]?.name || 'Loading...'}</h3>
                                <div className="text-3xl font-black text-orange-400 mt-1">{leaderboard[2]?.green_score || 0}</div>
                                <div className="text-[10px] font-bold text-orange-300 uppercase tracking-widest mt-1">{t('lead_points')}</div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/60">
                    <div className="flex items-center justify-between px-4 pb-4 border-b border-earth-100/50 mb-2">
                        <span className="text-sm font-bold text-earth-400 uppercase tracking-wider">{t('lead_rank')}</span>
                        <span className="text-sm font-bold text-earth-400 uppercase tracking-wider">{t('lead_farmer')}</span>
                        <span className="text-sm font-bold text-earth-400 uppercase tracking-wider text-right">{t('lead_impact_score')}</span>
                    </div>
                    {leaderboard.slice(3).map((entry, index) => (
                        <Link href={`/dashboard/farmer/profile/${entry.id}`} key={entry.id}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                                className="flex items-center gap-6 p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="w-12 text-center font-bold text-earth-400 text-xl group-hover:text-green-600 transition-colors">
                                    #{entry.rank}
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-earth-100 to-earth-50 flex items-center justify-center text-earth-600 font-bold text-sm shadow-inner">
                                    {entry.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-earth-900">{entry.name}</h3>
                                        <span className="px-2.5 py-0.5 bg-earth-100 text-earth-600 text-[10px] rounded-full font-bold uppercase tracking-wider border border-earth-200">{entry.badge}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-earth-500 mt-1.5">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-earth-400" /> {entry.location}</span>
                                        <span className="flex items-center gap-1.5 text-green-700 font-medium bg-green-50 px-2.5 py-0.5 rounded-md border border-green-100"><Leaf size={14} /> {entry.co2_saved} {t('lead_co2_saved')}</span>
                                    </div>
                                </div>
                                <div className="text-right pr-4">
                                    <div className="text-2xl font-black text-earth-800 tabular-nums">{entry.green_score}</div>
                                    <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest bg-green-50 rounded-full px-2 inline-block mt-1">{t('lead_points')}</div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {userRank && (
                    <div className="sticky bottom-6 z-50">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mx-auto w-full max-w-2xl bg-earth-900 text-white p-1 rounded-2xl shadow-2xl flex items-center pr-8 ring-4 ring-white/20 relative"
                        >
                            <div className="bg-gradient-to-br from-earth-800 to-earth-900 rounded-xl p-3 px-6 flex flex-col items-center border border-earth-700 min-w-[100px]">
                                <span className="text-[10px] text-earth-400 font-bold uppercase tracking-wider mb-1">{t('lead_current_rank')}</span>
                                <span className="text-3xl font-black text-white">#{userRank.rank}</span>
                            </div>

                            <div className="flex-1 px-6 border-l border-earth-700/50 ml-2">
                                <div className="font-bold text-lg mb-1">{t('lead_your_stats')}</div>
                                <div className="text-xs text-earth-300 flex items-center gap-4">
                                    <span className="flex items-center gap-1.5"><Leaf size={12} className="text-green-400" /> {userRank.co2_saved} {t('lead_co2_saved')}</span>
                                    <span className="w-1 h-1 rounded-full bg-earth-600"></span>
                                    <span>{userRank.waste_recycled} {t('lead_recycled')}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-black text-3xl text-green-400">{userRank.green_score}</div>
                                <div className="text-xs text-green-500 font-bold uppercase tracking-wider">{t('lead_total_points')}</div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
