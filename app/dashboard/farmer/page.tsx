'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, DollarSign, MapPin, Leaf, CheckCircle, Sparkles, X, Mic, MicOff, ShieldCheck, AlertCircle, FileText, Camera, ArrowRight, TrendingUp, Truck } from 'lucide-react';
import GreenScore from '@/app/components/GreenScore';
import AadharOCR from '@/app/components/AadharOCR';
import { useLanguage } from '@/app/context/LanguageContext';

export default function FarmerDashboard() {
    const { t } = useLanguage();

    const [profileData, setProfileData] = useState<any>(null);
    const [phone, setPhone] = useState('');
    const [detectedLoc, setDetectedLoc] = useState<string>('');
    const [wasteType, setWasteType] = useState('rice_straw');
    const [quantity, setQuantity] = useState('');
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [classifying, setClassifying] = useState(false);
    const [classificationResult, setClassificationResult] = useState<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState('');
    const [isKycVerified, setIsKycVerified] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);
    const [kycStep, setKycStep] = useState(1);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const authPhone = getCookie('auth_phone');
        if (authPhone) setPhone(authPhone);

        // Immediate priority: check for pending name from sign-up
        const pendingName = localStorage.getItem('pending_registration_name');

        const fetchProfile = async () => {
            if (!authPhone) return;
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
                        const backendName = data.profile.name;
                        const isGeneric = backendName?.startsWith('Farmer ') || backendName === 'Farmer' || backendName === 'Farmer Guest';

                        if (isGeneric && pendingName) {
                            data.profile.name = pendingName;
                        } else if (backendName && !isGeneric) {
                            localStorage.removeItem('pending_registration_name');
                        }

                        setProfileData(data.profile);
                        setIsKycVerified(data.profile.kyc_verified || false);
                    }
                } else {
                    setProfileData({
                        name: pendingName || `Farmer ${authPhone.slice(-4)}`,
                        phone_number: authPhone,
                        location: "Detected Location",
                        stats: { score: 0, co2: 0, waste: 0 },
                        orders: []
                    });
                }
            } catch (e) {
                setProfileData({
                    name: "Farmer Guest",
                    phone_number: authPhone || "---",
                    location: "Offline Mode",
                    stats: { score: 0, co2: 0, waste: 0 },
                    orders: []
                });
            }
        };
        fetchProfile();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.village || data.address.state_district || "Detected City";
                    const state = data.address.state || "India";
                    setDetectedLoc(`${city}, ${state}`);
                } catch (e) {
                    setDetectedLoc("Locating...");
                }
            }, () => setDetectedLoc("GPS Disabled"));
        }
    }, [phone]);

    const handleListForSale = async () => {
        if (!isKycVerified) {
            setShowKycModal(true);
            return;
        }
        if (!quantity) return alert("Please enter quantity");
        setLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/add-listing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phone,
                    listing: { type_key: wasteType, qty: quantity, date: new Date().toLocaleDateString(), status_key: 'list_status_active', price: prediction ? `₹${prediction.total_value}` : 'Calculating' }
                })
            });
            window.location.reload();
        } catch (e) {
            alert("Listing Created!");
            setShowKycModal(false);
        } finally { setLoading(false); }
    };

    const getPrediction = async (qty: string, type: string) => {
        if (!qty) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/predict-price`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ waste_type: type, quantity: parseFloat(qty), location_pincode: "140001" })
            });
            const data = await res.json();
            setPrediction(data);
        } catch (e) { console.error(e); }
    };

    const startVoiceAssistant = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Not supported");
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.onstart = () => { setIsListening(true); setVoiceFeedback(t('voice_listening')); };
        recognition.onerror = () => { setVoiceFeedback(t('voice_error')); setIsListening(false); };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setVoiceFeedback(`${t('voice_recognized')}: "${transcript}"`);
            const qtyMatch = transcript.match(/\d+/);
            if (qtyMatch) {
                setQuantity(qtyMatch[0]);
                getPrediction(qtyMatch[0], wasteType);
            }
            if (transcript.includes('rice')) setWasteType('rice_straw');
            else if (transcript.includes('wheat')) setWasteType('wheat_stubble');
            setTimeout(() => { setIsListening(false); setVoiceFeedback(''); }, 2000);
        };
        recognition.start();
    };

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Farmer Portal Overview</p>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        {t('dash_welcome')}, <span className="text-emerald-600">{profileData?.name?.split(' ')[0] || 'Farmer'}</span>! 👋
                    </h1>
                    <p className="text-slate-500 text-base font-semibold mt-2">Track your earnings and list new harvest waste.</p>
                </div>

                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 shrink-0">
                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <MapPin size={22} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Farm Location</div>
                        <div className="text-base font-black text-slate-900">{detectedLoc || profileData?.location || 'Detecting...'}</div>
                    </div>
                </div>
            </div>

            {/* ── QUICK STATS ROW ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {/* Card 1 – Earnings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <DollarSign size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Earnings</p>
                        <p className="text-2xl font-black text-slate-900">₹{profileData?.stats?.earnings || '0'}</p>
                    </div>
                </div>
                {/* Card 2 – Waste Sold */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Waste Sold</p>
                        <p className="text-2xl font-black text-slate-900">{profileData?.stats?.waste || '0'} <span className="text-xs text-slate-400 font-bold">Tons</span></p>
                    </div>
                </div>
                {/* Card 3 – CO2 Offset */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                    <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                        <Leaf size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">CO2 Offset</p>
                        <p className="text-2xl font-black text-slate-900">{profileData?.stats?.co2 || '0'} <span className="text-xs text-slate-400 font-bold">Tons</span></p>
                    </div>
                </div>
                {/* Card 4 – Score Rank */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                    <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Score Rank</p>
                        <p className="text-2xl font-black text-slate-900">#{profileData?.rank || '42'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 1. Left Section */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Create New Listing Card - Ultra Professional */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tightest">{t('dash_create_listing')}</h3>
                                <p className="text-slate-400 text-sm font-bold">AI verified diagnostics for premium biomass pricing</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <Sparkles size={24} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                            {/* Inputs Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('dash_waste_type')}</label>
                                    <div className="relative group">
                                        <select value={wasteType} onChange={(e) => { setWasteType(e.target.value); getPrediction(quantity, e.target.value); }} className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold text-slate-800 text-lg focus:border-emerald-600 focus:bg-white outline-none transition-all cursor-pointer appearance-none pr-12">
                                            <option value="rice_straw">Rice Straw (Parali)</option>
                                            <option value="wheat_stubble">Wheat Stubble</option>
                                            <option value="corn_stalks">Corn Stalks</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ArrowRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('dash_qty_tons')}</label>
                                        <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase">Live Prediction</div>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={quantity} onChange={(e) => { setQuantity(e.target.value); getPrediction(e.target.value, wasteType); }} placeholder="0.00" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 font-black text-2xl text-slate-900 focus:border-emerald-600 focus:bg-white outline-none transition-all pr-20" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 tracking-widest uppercase">Tons</div>
                                    </div>
                                </div>

                                <button
                                    onClick={startVoiceAssistant}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isListening ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-emerald-600 shadow-sm'}`}>
                                            <Mic size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className={`text-[10px] font-black uppercase tracking-wider ${isListening ? 'text-red-600' : 'text-slate-400'}`}>
                                                {isListening ? "Listening..." : "AI Voice Search"}
                                            </div>
                                            <div className="text-xs font-bold text-slate-950">
                                                {isListening ? "Try '12 tons'..." : "Speak quantity & type"}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Upload Section */}
                            <div className="space-y-4 h-full flex flex-col">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">UPLOAD PHOTO</label>
                                {!imagePreview ? (
                                    <label className="flex-grow border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-400 transition-all bg-slate-50/30 min-h-[220px]">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300">
                                            <Camera size={24} />
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-tight">{t('dash_click_upload')}</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e: any) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setUploadedImage(file);
                                                const reader = new FileReader();
                                                reader.onloadend = () => setImagePreview(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </label>
                                ) : (
                                    <div className="relative flex-grow rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm min-h-[220px]">
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Waste" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                                            <button onClick={() => { setImagePreview(null); setClassificationResult(null); }} className="absolute top-3 right-3 bg-white/20 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X size={16} /></button>
                                            <button onClick={async () => {
                                                if (!uploadedImage) return;
                                                setClassifying(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('file', uploadedImage);
                                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/classify-waste`, {
                                                        method: 'POST',
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    setClassificationResult(data);
                                                    setWasteType(data.predicted_class);
                                                } catch (error) { console.error(error); } finally { setClassifying(false); }
                                            }} className="bg-white text-emerald-900 px-6 py-3 rounded-xl text-xs font-black shadow-xl hover:scale-105 transition-transform">
                                                {classifying ? "CLASSIFYING..." : "RE-VERIFY AI"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button onClick={handleListForSale} disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-4 group active:scale-[0.98]">
                            {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> :
                                <>{!isKycVerified ? <ShieldCheck size={24} /> : <CheckCircle size={24} />} <span className="tracking-widest uppercase">{t('list_now')}</span> <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /> </>}
                        </button>
                    </div>

                    {/* Recent Orders - Important Sales Data */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" size={20} />
                                {t('dash_recent_orders')}
                            </h3>
                            <Link href="/dashboard/farmer/listings" className="text-[10px] font-black text-emerald-700 hover:text-emerald-900 transition-all uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-lg">
                                VIEW ALL
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50">
                                        <th className="px-8 py-3">{t('dash_order_id')}</th>
                                        <th className="px-4 py-3">{t('dash_date')}</th>
                                        <th className="px-4 py-3">{t('dash_item')}</th>
                                        <th className="px-4 py-3">{t('dash_qty')}</th>
                                        <th className="px-4 py-3 text-emerald-700">{t('dash_amount')}</th>
                                        <th className="px-8 py-3 text-right">{t('dash_status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(!profileData?.orders || profileData.orders.length === 0) ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-10 text-center font-bold text-slate-300 text-sm">
                                                No recent activity.
                                            </td>
                                        </tr>
                                    ) : (
                                        profileData.orders.map((order: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-8 py-4 text-xs font-black text-slate-900">#{order.id}</td>
                                                <td className="px-4 py-4 text-xs text-slate-500 font-bold">{order.date}</td>
                                                <td className="px-4 py-4 font-black text-slate-800 text-sm">{order.item}</td>
                                                <td className="px-4 py-4 font-black text-emerald-800 text-xs">{order.qty}</td>
                                                <td className="px-4 py-4 font-black text-emerald-700 text-base">₹{order.amount.toString().replace('₹', '')}</td>
                                                <td className="px-8 py-4 text-right">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 2. Right Section - Metrics */}
                <div className="lg:col-span-4 flex flex-col gap-8">

                    {/* Price Card */}
                    <div className="bg-emerald-950 p-8 rounded-[2rem] text-white shadow-lg relative overflow-hidden group border border-emerald-800">
                        <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/10 rounded-xl flex items-center justify-center shadow-inner"><DollarSign size={20} className="text-emerald-400" /></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/80">{t('dash_price_prediction')}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-6xl font-black tracking-tighter italic">₹{prediction ? prediction.total_value : "0"}</span>
                            <span className="text-emerald-400 text-2xl font-black">↑</span>
                        </div>
                        <div className="text-sm text-emerald-200 font-bold opacity-60 mb-8">{t('dash_estimated_value')}</div>

                        <div className="space-y-8">
                            <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                <span className="text-emerald-300">Market Trend</span>
                                <span className="bg-emerald-500 text-emerald-950 px-4 py-2 rounded-full text-[10px]">SPIKING NOW</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full animate-pulse" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>

                    <GreenScore score={profileData?.stats?.score || 0} co2Saved={profileData?.stats?.co2 || 0} wasteSold={profileData?.stats?.waste || 0} farmerName={profileData?.name || 'Farmer'} />
                </div>

                {/* KYC Modal */}
                {showKycModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden p-16 md:p-20 relative animate-in zoom-in duration-300">
                            <button onClick={() => setShowKycModal(false)} className="absolute top-10 right-10 p-3 text-slate-300 hover:text-red-500 transition-all"><X size={36} /></button>
                            {kycStep === 1 ? (
                                <div className="space-y-10 text-center">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto shadow-sm"><ShieldCheck size={56} /></div>
                                    <div>
                                        <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">{t('kyc_title')}</h3>
                                        <p className="text-slate-500 mt-6 text-xl font-bold leading-relaxed">{t('kyc_desc')}</p>
                                    </div>
                                    <button onClick={() => setKycStep(2)} className="w-full py-8 bg-emerald-900 text-white rounded-2xl font-black text-2xl hover:bg-black transition-all shadow-xl">{t('kyc_start_btn')}</button>
                                </div>
                            ) : kycStep === 2 ? (
                                <div className="space-y-10">
                                    <h3 className="text-2xl font-black text-center text-slate-900">{t('kyc_verify_id')}</h3>
                                    <AadharOCR onVerified={() => {
                                        setTimeout(() => { setIsKycVerified(true); setKycStep(3); }, 2000);
                                    }} />
                                    <div className="text-[11px] text-center font-black text-slate-300 uppercase tracking-widest bg-slate-50 py-3 rounded-xl border border-slate-100">Secured by StubbleX Cloud</div>
                                </div>
                            ) : (
                                <div className="text-center space-y-10 py-6">
                                    <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border-4 border-emerald-100"><CheckCircle size={72} /></div>
                                    <div>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t('kyc_success_title')}</h3>
                                        <p className="text-slate-600 mt-4 text-xl font-bold">{t('kyc_success_desc')}</p>
                                    </div>
                                    <button onClick={() => setShowKycModal(false)} className="w-full py-8 bg-emerald-600 text-white rounded-2xl font-black text-2xl hover:bg-emerald-800 transition-all shadow-xl">{t('kyc_go_dash')}</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
