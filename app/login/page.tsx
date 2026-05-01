"use client";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Leaf, Factory, ArrowRight } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');
    const [activeRole, setActiveRole] = useState<'farmer' | 'buyer'>('farmer');

    // Auth State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (roleParam === 'buyer') setActiveRole('buyer');
        if (roleParam === 'farmer') setActiveRole('farmer');

        // Grab phone from registration if available
        const phoneParam = searchParams.get('phone');
        if (phoneParam) setPhone(phoneParam);
    }, [roleParam, searchParams]);

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || phone.length < 10) {
            setMessage("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            console.log(`Sending OTP request to: ${apiUrl}/api/send-otp`);

            const res = await fetch(`${apiUrl}/api/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phone })
            });
            const data = await res.json();

            if (res.ok) {
                setShowOtpInput(true);
                // For Hackathon Demo: Auto-fill or show OTP in message
                setMessage(`OTP Sent! (Demo Code: ${data.otp})`);
            } else {
                setMessage("Failed to send OTP. Try again.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error connecting to server. Is Backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            const pendingName = localStorage.getItem('pending_registration_name');
            const res = await fetch(`${apiUrl}/api/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phone,
                    otp: otp,
                    name: pendingName || undefined
                })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("OTP Verified! Setting cookie and redirecting...");
                // Set mock auth cookies
                document.cookie = `auth_role=${activeRole}; path=/; max-age=86400`; // 1 day
                document.cookie = `auth_phone=${data.phone}; path=/; max-age=86400`; // 1 day

                // Force hard navigation to ensure middleware sees the cookie
                if (activeRole === 'farmer') {
                    window.location.href = '/dashboard/farmer';
                } else {
                    window.location.href = '/dashboard/buyer';
                }
            } else {
                setMessage("Invalid OTP. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            setMessage("Login failed. Server error.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-earth-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-earth-900 mb-2">Welcome Back</h1>
                <p className="text-earth-600">Please sign in to your {activeRole} account</p>
            </div>

            {/* Role Toggles */}
            <div className="flex bg-earth-50 p-1 rounded-xl mb-8">
                <button
                    onClick={() => setActiveRole('farmer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeRole === 'farmer' ? 'bg-white text-earth-800 shadow-sm' : 'text-earth-500 hover:text-earth-700'}`}
                >
                    <Leaf size={18} /> Farmer
                </button>
                <button
                    onClick={() => setActiveRole('buyer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeRole === 'buyer' ? 'bg-white text-earth-800 shadow-sm' : 'text-earth-500 hover:text-earth-700'}`}
                >
                    <Factory size={18} /> Buyer
                </button>
            </div>

            {!showOtpInput ? (
                <form onSubmit={handleGetOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="9876543210"
                            className="w-full p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {message && <p className="text-sm text-red-500 text-center">{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-earth-800 text-white rounded-xl font-bold hover:bg-earth-900 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? 'Sending...' : 'Get OTP'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-center mb-4">
                        <p className="text-sm text-earth-600">OTP sent to +91 {phone}</p>
                        <button type="button" onClick={() => setShowOtpInput(false)} className="text-xs text-earth-500 underline mt-1">Change Number</button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1">Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 4-digit code"
                            className="w-full p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none transition-all text-center tracking-widest text-lg"
                            required
                            maxLength={4}
                        />
                    </div>

                    {message && <p className={`text-sm text-center ${message.includes('Sent') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-earth-800 text-white rounded-xl font-bold hover:bg-earth-900 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? 'Verifying...' : 'Sign In'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            )}

            <div className="mt-8 text-center text-sm text-earth-600">
                Don't have an account? <Link href="/register" className="font-semibold text-earth-800 hover:underline">Create one</Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex bg-earth-50">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-earth-800 text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="z-10">
                    <Link href="/" className="text-2xl font-bold tracking-tight">StubbleX</Link>
                </div>

                <div className="z-10 max-w-md">
                    <h2 className="text-5xl font-bold mb-6">Join the revolution.</h2>
                    <p className="text-earth-200 text-xl leading-relaxed">
                        Whether you are growing crops or powering industries, you are part of the solution.
                        Connect, trade, and impact the planet.
                    </p>
                </div>

                <div className="z-10 flex gap-4 text-sm text-earth-300">
                    <span>&copy; 2026 StubbleX</span>
                </div>

                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-earth-700/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-earth-600/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
