"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Leaf, Factory, ArrowRight, User, Sparkles } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [activeRole, setActiveRole] = useState<'farmer' | 'buyer'>('farmer');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        // CRITICAL: Save identity to localStorage for cross-page sync
        if (fullName) {
            localStorage.setItem('pending_registration_name', fullName);
            console.log("StubbleX Sync: Identity stored for profile ->", fullName);
        }

        // Auto-redirect to Login with prefilled data
        setTimeout(() => {
            router.push(`/login?phone=${formData.phone || ''}`);
        }, 800);
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-[45%] bg-emerald-950 text-white p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="z-10 relative">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-xl shadow-xl shadow-emerald-500/20">
                            <Leaf className="text-white" size={24} />
                        </div>
                        <span className="text-3xl font-black tracking-tightest">StubbleX</span>
                    </Link>
                </div>

                <div className="z-10 max-w-lg relative">
                    <div className="inline-flex items-center gap-2 bg-emerald-400/20 px-4 py-2 rounded-full border border-emerald-400/30 mb-8 backdrop-blur-md">
                        <Sparkles size={16} className="text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-100">Zero-Waste Revolution</span>
                    </div>
                    <h2 className="text-6xl font-black mb-8 leading-[1.1] tracking-tightest">Grow crops. Save our sky.</h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed tracking-tight">
                        The ultimate marketplace for crop waste. Turn your stubble into smart capital and join thousands of farmers building a sustainable future.
                    </p>
                </div>

                <div className="z-10 flex flex-col gap-6 relative">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-emerald-950 bg-emerald-800 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
                                {i}
                            </div>
                        ))}
                        <div className="flex items-center justify-center px-4 text-sm font-bold text-emerald-400">+2.5k Farmers Joined This Week</div>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-500 font-bold uppercase tracking-widest">
                        <span>&copy; 2026 StubbleX Labs</span>
                        <span>Terms & Privacy</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-white relative">
                <div className="max-w-md w-full animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="text-center md:text-left mb-12">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tightest mb-4">Start your journey.</h1>
                        <p className="text-slate-500 text-lg font-bold tracking-tight">Register as a new member to access the live marketplace.</p>
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 shadow-inner">
                        <button
                            onClick={() => setActiveRole('farmer')}
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeRole === 'farmer' ? 'bg-white text-emerald-700 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Leaf size={18} /> Farmer
                        </button>
                        <button
                            onClick={() => setActiveRole('buyer')}
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeRole === 'buyer' ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Factory size={18} /> Industrial Buyer
                        </button>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Phone Member</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</div>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    className="w-full pl-14 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Farm Pincode</label>
                            <input
                                type="text"
                                placeholder="140001"
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-4 group mt-6 active:scale-95 disabled:opacity-50 transition-all border-b-4 border-slate-950 hover:border-emerald-700"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Create My Account'}
                            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm font-bold text-slate-500 tracking-tight">
                        Already part of the ecosystem? <Link href="/login" className="text-emerald-700 hover:text-emerald-800 underline decoration-emerald-500/30 underline-offset-4">Sign In Instead</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}
