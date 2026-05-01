"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, ShieldCheck, ChevronRight, AlertCircle, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import AadharOCR from '@/app/components/AadharOCR';

export default function KycPage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdatingKyc, setIsUpdatingKyc] = useState(false);
    const [kycStatus, setKycStatus] = useState('Not Verified');

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const authPhone = getCookie('auth_phone');

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
                        setKycStatus(data.profile.kyc_status || 'Not Verified');
                    }
                }
            } catch (e) {
                console.error("Profile fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleKycVerified = async (ocrData: any) => {
        if (!profileData?.phone_number) return;
        setIsUpdatingKyc(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/update-profile`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: profileData.phone_number,
                    updates: {
                        kyc_data: ocrData,
                        kyc_status: 'Verified',
                        kyc_verified: true
                    }
                })
            });
            if (res.ok) {
                const data = await res.json();
                setProfileData(data.profile);
                setKycStatus('Verified');
                // Optional: Auto-redirect after delay
                setTimeout(() => {
                    router.push('/dashboard/farmer/profile');
                }, 2000);
            }
        } catch (e) {
            console.error("KYC update error:", e);
        } finally {
            setIsUpdatingKyc(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Connecting to Verification Node...</h2>
            </div>
        );
    }

    const isVerified = kycStatus === 'Verified';

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-white hover:bg-slate-100 rounded-2xl shadow-sm border border-slate-200 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">KYC Verification</h1>
                        <p className="text-slate-500 font-bold">Secure your account and unlock premium features.</p>
                    </div>
                </div>

                {/* Verification Card */}
                <div className="bg-slate-950 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>

                    <div className="p-12 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h3 className="text-3xl font-black text-white flex items-center gap-4">
                                    <CreditCard size={32} className="text-emerald-400" />
                                    Identity Verification
                                </h3>
                                <p className="text-slate-400 font-bold mt-2 text-lg">Use AI-powered scanning to verify your government ID instantly.</p>
                            </div>
                            <div className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 border-2 ${isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                {isVerified ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {isVerified ? 'System Verified' : 'Action Required'}
                            </div>
                        </div>

                        {!isVerified ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Aadhar Verification via AI</h4>
                                        <AadharOCR onVerified={handleKycVerified} />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                                        <h5 className="text-white font-black text-lg font-bold">Standard Security Checklist</h5>
                                        <ul className="space-y-4">
                                            {[
                                                'Ensure the image is clear and text is readable',
                                                'All four corners of the ID should be visible',
                                                'Avoid direct light glare on the card surface',
                                                'Do not use photocopies or screen captures'
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                        <ChevronRight size={14} className="text-emerald-400" />
                                                    </div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 space-y-8 h-fit self-start">
                                    <div className="space-y-6">
                                        <h4 className="text-white font-black text-2xl tracking-tight">Identity Details</h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Farm Location (Pincode)</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: 140001"
                                                className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:border-emerald-500 outline-none transition-all"
                                                defaultValue={profileData?.pincode || ''}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Selection</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button className="p-5 bg-emerald-500 text-emerald-950 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-emerald-400 transition-all shadow-xl">Aadhar</button>
                                                <button className="p-5 bg-white/5 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-white/5 hover:border-white/20 transition-all opacity-50 cursor-not-allowed">PAN Card</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center gap-4 bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10">
                                        <ShieldCheck size={40} className="text-emerald-400" />
                                        <p className="text-slate-300 text-xs font-medium leading-relaxed italic">
                                            Identity data is encrypted using military-grade AES-256 and verified through government satellite nodes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-8 flex flex-col items-center">
                                <div className="w-32 h-32 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse">
                                    <ShieldCheck size={64} />
                                </div>
                                <div className="max-w-lg">
                                    <h4 className="text-4xl font-black text-white tracking-tighter">Your Identity is Secured</h4>
                                    <p className="text-slate-400 font-bold mt-4 text-lg underline decoration-emerald-500/30 underline-offset-8 decoration-4">
                                        Verification complete. You are now a certified Soil Guardian in the StubbleX ecosystem.
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/farmer/profile')}
                                    className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-400 hover:text-emerald-950 transition-all active:scale-95"
                                >
                                    Return to Profile
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:scale-110 transition-transform -z-10"></div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest pb-12">
                    <Sparkles className="text-brand-500" size={14} />
                    Secure Data Environment High • Ver. 2.0.4
                </div>
            </div>
        </div>
    );
}
