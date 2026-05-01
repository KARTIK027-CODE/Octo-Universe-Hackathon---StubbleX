"use client";
import React from 'react';
import { Filter, Search, Truck } from 'lucide-react';
import { Footer } from '../../components/Footer';
import { useLanguage } from '@/app/context/LanguageContext';

export default function BuyerDashboard() {
    const { t } = useLanguage();
    const listings = [
        { id: 1, crop: 'Rice Straw', qty: '5 Tons', price: '₹2,200', loc: 'Bathinda, Punjab', dist: '15km', reliability: 'High', image: '/images/rice_straw.png' },
        { id: 2, crop: 'Wheat Stubble', qty: '12 Tons', price: '₹4,800', loc: 'Karnal, Haryana', dist: '42km', reliability: 'Checked', image: '/images/wheat_stubble.png' },
        { id: 3, crop: 'Sugarcane', qty: '8 Tons', price: '₹3,100', loc: 'Patiala, Punjab', dist: '28km', reliability: 'High', image: '/images/sugarcane_trash.png' },
    ];

    return (
        <>
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-earth-900">{t('buyer_dash_title')}</h1>
                    <p className="text-earth-600">{t('buyer_dash_subtitle')}</p>
                </div>

                {/* Buyer Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
                        <div className="flex items-center gap-3 mb-2 text-earth-600">
                            <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                <span className="text-xl">🌿</span>
                            </div>
                            <span className="font-medium text-sm">{t('buyer_stat_offset')}</span>
                        </div>
                        <div className="text-3xl font-extrabold text-earth-900">142 Tons</div>
                        <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                            +12% this month
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
                        <div className="flex items-center gap-3 mb-2 text-earth-600">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                <span className="text-xl">🚚</span>
                            </div>
                            <span className="font-medium text-sm">{t('buyer_stat_biomass')}</span>
                        </div>
                        <div className="text-3xl font-extrabold text-earth-900">850 Tons</div>
                        <div className="text-xs text-earth-400 mt-1">{t('buyer_stat_target')}: 1000 Tons</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
                        <div className="flex items-center gap-3 mb-2 text-earth-600">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                                <span className="text-xl">💰</span>
                            </div>
                            <span className="font-medium text-sm">{t('buyer_stat_spend')}</span>
                        </div>
                        <div className="text-3xl font-extrabold text-earth-900">₹3.2 Lakh</div>
                        <div className="text-xs text-earth-400 mt-1">{t('buyer_stat_avg_cost')}: ₹375/ton</div>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-earth-900">{t('buyer_marketplace')}</h2>
                    </div>
                    <button className="px-5 py-2 bg-white border border-earth-200 rounded-lg text-earth-700 font-medium hover:bg-earth-50 flex items-center gap-2">
                        <Filter size={18} /> {t('buyer_filters')}
                    </button>
                </div>

                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={20} />
                    <input
                        type="text"
                        placeholder={t('buyer_search_placeholder')}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-earth-200 shadow-sm focus:ring-2 focus:ring-earth-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-sand-100 relative">
                                <img src={item.image} alt={item.crop} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-earth-900">{item.crop}</h3>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">{item.reliability}</span>
                                </div>

                                <div className="space-y-2 text-sm text-earth-600 mb-4">
                                    <div className="flex justify-between">
                                        <span>{t('buyer_quantity')}:</span>
                                        <span className="font-semibold text-earth-800">{item.qty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('buyer_price_ask')}:</span>
                                        <span className="font-semibold text-earth-800">{item.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('buyer_distance')}:</span>
                                        <span className="font-semibold text-earth-800">{item.dist}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 bg-earth-800 text-white rounded-lg font-medium hover:bg-earth-900 flex items-center justify-center gap-2">
                                    <Truck size={16} /> {t('buyer_request_pickup')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}
