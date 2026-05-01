"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Sparkles, CheckCircle, ShieldCheck, ChevronRight, Loader2, Award, Zap, ArrowRight, UserCheck } from 'lucide-react';
import GreenScore from '@/app/components/GreenScore';

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('Farmer');
    const [kycStatus, setKycStatus] = useState('Not Verified');

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const authPhone = getCookie('auth_phone');

        // Immediate priority: check if we have a pending name from sign-up
        const pendingName = localStorage.getItem('pending_registration_name');
        if (pendingName) {
            setName(pendingName);
        }

        const fetchProfile = async () => {
            if (!authPhone) {
                setLoading(false);
                return;
            }
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/get-profile`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone_number: authPhone })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success') {
                        setProfileData(data.profile);
                        const backendName = data.profile.name;
                        const isGeneric = backendName?.startsWith('Farmer ') || backendName === 'Farmer' || backendName === 'Farmer Guest';

                        if (backendName && !isGeneric) {
                            setName(backendName);
                            localStorage.removeItem('pending_registration_name');
                        } else if (pendingName) {
                            // Backend has generic name, but we have a better one in storage
                            setName(pendingName);
                        }
                        setKycStatus(data.profile.kyc_status || 'Not Verified');
                    }
                } else {
                    setProfileData({
                        name: pendingName || `Farmer ${authPhone.slice(-4)}`,
                        phone_number: authPhone,
                        stats: { score: 0, co2: 0, waste: 0 },
                        location: "Detected Location"
                    });
                }
            } catch (e) {
                console.error("Profile fetch error:", e);
                setProfileData({
                    name: pendingName || "Farmer Guest",
                    phone_number: authPhone || "---",
                    stats: { score: 0, co2: 0, waste: 0 },
                    location: "Offline Mode"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
                <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mb-6" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Synchronizing...</h2>
            </div>
        );
    }

    const initials = name.split(' ').map((n: string) => n[0]).join('') || 'F';
    const isVerified = kycStatus === 'Verified';

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Identity Header */}
            <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 text-5xl font-black shadow-inner border-4 border-white transform group-hover:rotate-3 transition-all duration-500">
                        {initials}
                    </div>
                </div>

                <div className="text-center md:text-left space-y-3 flex-1">
                    <div className="space-y-1">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tightest leading-none">{name}</h2>
                            {isVerified && <ShieldCheck className="text-emerald-500" size={32} />}
                        </div>
                        <p className="text-slate-400 font-bold text-lg tracking-tight">Eco-Member Tier 1 • StubbleX Hero</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm">
                            <MapPin size={16} className="text-emerald-500" /> {profileData?.location || 'India'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm">
                            <Phone size={16} className="text-emerald-500" /> +91 {profileData?.phone_number || '---'}
                        </div>
                    </div>
                </div>


            </div>

            {/* 2. Compact KYC CTA (If not verified) */}
            {!isVerified && (
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-md">
                            <Award size={32} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-2xl font-black tracking-tight leading-none uppercase tracking-widest italic">Aadhar Verification Needed</h4>
                            <p className="text-emerald-100 font-bold text-sm tracking-tight">Complete your identity check to receive direct industrial payouts.</p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/farmer/profile/kyc"
                        className="bg-white text-emerald-800 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 relative z-10 shadow-xl"
                    >
                        Complete Our Verification Now <Zap size={18} className="fill-current" />
                    </Link>
                </div>
            )}

            {/* 3. Impact Grid */}
            <div className="grid grid-cols-1 gap-10">
                <GreenScore
                    score={profileData?.stats?.score || 0}
                    co2Saved={profileData?.stats?.co2 || 0}
                    wasteSold={profileData?.stats?.waste || 0}
                    farmerName={name}
                />
            </div>

            {/* 4. Verified Status Footer */}
            {isVerified && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 text-emerald-900 group">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl border border-emerald-100 transform -rotate-3 group-hover:rotate-0 transition-transform">
                        <CheckCircle size={48} />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h4 className="text-3xl font-black tracking-tight leading-none uppercase tracking-[0.1em]">Identity Protected</h4>
                        <p className="text-emerald-700/80 font-bold text-lg leading-snug">
                            Your biometrics and identification are safely encrypted. You are fully eligible for high-tier carbon credit rewards.
                        </p>
                    </div>
                    <button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95">
                        Download Badge <ShieldCheck size={18} />
                    </button>
                </div>
            )}

            {/* 5. Minimal Footer */}
            <div className="text-center pt-8 flex items-center justify-center gap-4 text-slate-300 font-black text-[10px] uppercase tracking-widest pb-10">
                <Sparkles size={14} className="text-emerald-500" /> Secure Cloud Backend Node Active • StubbleX v2.0
            </div>
        </div>
    );
}
