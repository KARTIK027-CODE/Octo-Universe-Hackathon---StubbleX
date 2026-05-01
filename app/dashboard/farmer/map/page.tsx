'use client';
import React, { useEffect, useState } from 'react';
import VillageImpactMap from '@/app/components/ImpactMap';
import { useLanguage } from '@/app/context/LanguageContext';
import { AlertTriangle, MapPin, Zap, ShieldCheck } from 'lucide-react';

export default function FarmerMapPage() {
    const { t } = useLanguage();
    const [profileData, setProfileData] = useState<any>(null);
    const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto');
    const [manualPincode, setManualPincode] = useState('');
    const [forcedLoc, setForcedLoc] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const authPhone = getCookie('auth_phone');

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
                        setProfileData(data.profile);
                        if (data.profile.pincode) setManualPincode(data.profile.pincode);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchProfile();
    }, []);

    const handleManualSearch = async () => {
        if (!manualPincode) return;
        setIsLocating(true);
        try {
            // Simple geocoding for demo purposes - in real life use a proper geocoding API
            // For now we simulate moving to a known Punjab location based on common pincodes
            const mockCoords: { [key: string]: [number, number] } = {
                '141001': [30.9010, 75.8573], // Ludhiana
                '140001': [30.9664, 76.5331], // Rupnagar
                '143001': [31.6340, 74.8723], // Amritsar
                '151001': [30.2110, 74.9455], // Bathinda
            };

            const coords = mockCoords[manualPincode] || [31.1471, 75.3412];
            setForcedLoc(coords);
            setLocationMode('manual');
        } catch (e) {
            console.error(e);
        } finally {
            setIsLocating(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 px-2">
                <div>
                    <h1 className="text-4xl font-black text-earth-900 tracking-tightest">
                        {t('dash_map_title')} 🗺️
                    </h1>
                    <p className="text-earth-500 font-bold mt-1 text-lg">Real-time satellite detection of burning hotspots near you.</p>
                </div>

                {/* Location Selection UI */}
                <div className="bg-white p-2 rounded-3xl border border-earth-100 shadow-xl flex flex-col md:flex-row items-center gap-2 w-full xl:w-auto">
                    <div className="flex bg-earth-50 p-1 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => { setLocationMode('auto'); setForcedLoc(null); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${locationMode === 'auto' ? 'bg-white text-emerald-700 shadow-sm shadow-emerald-500/10' : 'text-earth-400 hover:text-earth-600'}`}
                        >
                            <Zap size={14} className={locationMode === 'auto' ? 'animate-pulse' : ''} /> Device GPS
                        </button>
                        <button
                            onClick={() => setLocationMode('manual')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${locationMode === 'manual' ? 'bg-white text-emerald-700 shadow-sm shadow-emerald-500/10' : 'text-earth-400 hover:text-earth-600'}`}
                        >
                            <MapPin size={14} /> Farm Pincode
                        </button>
                    </div>

                    {locationMode === 'manual' && (
                        <div className="flex items-center gap-2 w-full md:w-auto px-2 md:px-0">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                className="bg-earth-50 border border-earth-100 px-4 py-2.5 rounded-xl text-sm font-bold text-earth-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full md:w-32"
                                value={manualPincode}
                                onChange={(e) => setManualPincode(e.target.value)}
                            />
                            <button
                                onClick={handleManualSearch}
                                disabled={isLocating}
                                className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLocating ? 'Scanning...' : 'Locate'}
                            </button>
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-3 px-4 py-3 border-l border-earth-100 ml-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest whitespace-nowrap">Live Alerts Active</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-earth-100 overflow-hidden h-[70vh] relative">
                <VillageImpactMap profileData={profileData} forcedLocation={forcedLoc} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                <div className="bg-white p-8 rounded-[2rem] border border-earth-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-red-100 rounded-2xl text-red-600 shrink-0">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h4 className="font-black text-earth-900 text-lg">Demand Bonus</h4>
                        <p className="text-sm text-earth-500 mt-2 font-bold leading-relaxed">Collecting waste from burning zones earns premium ₹500/ton extra.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-earth-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 shrink-0">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <h4 className="font-black text-earth-900 text-lg">Nearest Center</h4>
                        <p className="text-sm text-earth-500 mt-2 font-bold leading-relaxed">Found 3 collection centers within 12km of your current location.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-earth-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-green-100 rounded-2xl text-green-600 shrink-0">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h4 className="font-black text-earth-900 text-lg">Safe Handling</h4>
                        <p className="text-sm text-earth-500 mt-2 font-bold leading-relaxed">Certified logistics partners available for immediate emergency pickups.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
