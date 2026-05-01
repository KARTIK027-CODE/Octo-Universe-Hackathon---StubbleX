import React from 'react';
import { Leaf, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import ImpactCertificate from './ImpactCertificate';

interface GreenScoreProps {
    score?: number;
    co2Saved?: number;
    wasteSold?: number;
    farmerName?: string;
}

export default function GreenScore({ score = 0, co2Saved = 0, wasteSold = 0, farmerName = 'Farmer' }: GreenScoreProps) {
    let badge = { name: 'Seedling', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Leaf };
    if (score > 800) badge = { name: 'Eco-Warrior', color: 'text-blue-600', bg: 'bg-blue-50', icon: ShieldCheck };
    else if (score > 500) badge = { name: 'Guardian', color: 'text-teal-600', bg: 'bg-teal-50', icon: Award };

    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(score / 10000, 1);
    const dashoffset = circumference - progress * circumference;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">

            {/* Header row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Leaf className="text-emerald-500" size={20} />
                    <div>
                        <h3 className="text-lg font-black text-slate-900 leading-none">Green Score</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Environmental Impact</p>
                    </div>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${badge.bg} ${badge.color}`}>
                    <badge.icon size={12} />
                    {badge.name}
                </span>
            </div>

            {/* Score circle row */}
            <div className="flex items-center gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                {/* Circle */}
                <div className="relative shrink-0">
                    <svg width="100" height="100" className="-rotate-90">
                        <circle cx="50" cy="50" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
                        <circle
                            cx="50" cy="50" r={radius}
                            stroke="#10b981" strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Leaf className="text-emerald-200" size={28} />
                    </div>
                </div>
                {/* Score number */}
                <div>
                    <p className="text-5xl font-black text-slate-900 leading-none">{score}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sustainability Points</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CO2 Saved</p>
                    <p className="text-xl font-black text-slate-900">{co2Saved} <span className="text-xs text-slate-400 font-bold">Tons</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1.5">
                        <TrendingUp size={10} /> +2.4
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Waste Recycled</p>
                    <p className="text-xl font-black text-slate-900">{wasteSold} <span className="text-xs text-slate-400 font-bold">Tons</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1.5">
                        <TrendingUp size={10} /> Top 10%
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        Next: <span className="text-emerald-600">{score > 500 ? 'Eco-Warrior' : 'Guardian'}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{1000 - (score % 1000)} pts left</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min((score % 1000) / 10, 100)}%` }}
                    />
                </div>
            </div>

            {/* Certificate */}
            <ImpactCertificate
                farmerName={farmerName}
                co2Saved={co2Saved}
                wasteRecycled={wasteSold}
                date={new Date().toLocaleDateString()}
                certificateId={`SX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
            />
        </div>
    );
}
