"use client";
import React, { use } from 'react';
import { User, MapPin, Phone, Mail, Award, Leaf, Calendar } from 'lucide-react';

// Mock data for demo purposes since we don't have a database yet
const MOCK_PROFILES: Record<string, any> = {
    "1": {
        name: "Rajesh Kumar",
        location: "Punjab, India",
        role: "Eco-Warrior",
        bio: "Pioneering sustainable farming practices in Punjab since 2010. Specialized in stubble management.",
        stats: { co2: "1200kg", recycled: "5000kg", score: 12500 },
        image: "/images/rajesh.png"
    },
    "2": {
        name: "Sunita Sharma",
        location: "Haryana, India",
        role: "Soil Guardian",
        bio: "Passionate about organic compost and soil health. Leading a cooperative of 50 women farmers.",
        stats: { co2: "1050kg", recycled: "4200kg", score: 11200 },
        image: "/images/sunita.png"
    },
    "3": {
        name: "Vikram Singh",
        location: "Uttar Pradesh, India",
        role: "Green Hero",
        bio: "Innovator in waste-to-energy solutions. Transforming farm waste into bio-fuel pellets.",
        stats: { co2: "980kg", recycled: "3800kg", score: 10500 },
        image: null
    }
};

export default function FarmerProfileView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const profile = MOCK_PROFILES[id] || {
        name: "Community Farmer",
        location: "India",
        role: "Eco-Guardian",
        bio: "Part of the StubbleX sustainability network.",
        stats: { co2: "0 Tons", recycled: "0 Tons", score: 0 },
        image: null
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header / Cover */}
            <div className="relative mb-20">
                <div className="h-48 bg-gradient-to-r from-green-600 to-emerald-800 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                </div>
                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
                        {profile.image ? (
                            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-earth-100 flex items-center justify-center text-earth-400 font-bold text-3xl">
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                {/* Left Sidebar Info */}
                <div className="md:col-span-1 space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-earth-900 leading-tight">{profile.name}</h1>
                        <p className="text-green-600 font-bold mb-1">{profile.role}</p>
                        <div className="flex items-center gap-2 text-earth-500 text-sm">
                            <MapPin size={16} /> {profile.location}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-earth-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-earth-700">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <Award size={16} />
                            </div>
                            <div>
                                <div className="text-xs text-earth-400 uppercase font-bold">Green Score</div>
                                <div className="font-black text-xl">{profile.stats.score}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-earth-700">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Leaf size={16} />
                            </div>
                            <div>
                                <div className="text-xs text-earth-400 uppercase font-bold">CO2 Saved</div>
                                <div className="font-black text-xl">{profile.stats.co2}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100">
                        <h3 className="text-xl font-bold text-earth-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-earth-400" /> About
                        </h3>
                        <p className="text-earth-600 leading-relaxed text-lg">
                            {profile.bio}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
                        <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-green-600" /> Achievements
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                                <div className="font-bold text-green-800">Top Recycler</div>
                                <div className="text-sm text-green-600">Jan 2026</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                                <div className="font-bold text-green-800">Community Leader</div>
                                <div className="text-sm text-green-600">2025</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
