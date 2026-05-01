"use client";
import React from 'react';
import { Building2, MapPin, Phone, Mail, Save, FileText } from 'lucide-react';

export default function BuyerProfilePage() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-earth-900">Company Profile</h1>
                <p className="text-earth-600">Manage your business details and verified status.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
                <div className="p-8 border-b border-earth-100 flex items-center gap-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <Building2 size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-earth-900">GreenFuel Industries Ltd.</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Verified Buyer</span>
                            <span className="text-earth-500 text-sm">• Bio-Energy Sector</span>
                        </div>
                    </div>
                </div>

                <form className="p-8 space-y-6">
                    <h3 className="text-lg font-semibold text-earth-800 border-b border-earth-50 pb-2">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-earth-700 mb-1">Company Name</label>
                            <input type="text" defaultValue="GreenFuel Industries Ltd." className="w-full p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Industry Type</label>
                            <select className="w-full p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none bg-white">
                                <option>Bio-Energy / Power</option>
                                <option>Paper & Packaging</option>
                                <option>Textile</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">GST/Tax ID</label>
                            <div className="relative">
                                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                                <input type="text" defaultValue="GSTIN29AAACF1234F1Z5" className="w-full pl-10 p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-earth-800 border-b border-earth-50 pb-2 pt-4">Contact Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Contact Person</label>
                            <input type="text" defaultValue="Rajesh Verma" className="w-full p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                                <input type="tel" defaultValue="+91 98111 22233" className="w-full pl-10 p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-earth-700 mb-1">Company Address</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                                <input type="text" defaultValue="Plot 45, Industrial Area, Ludhiana, Punjab" className="w-full pl-10 p-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-earth-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="px-6 py-3 bg-earth-800 text-white rounded-xl font-semibold hover:bg-earth-900 transition-colors flex items-center gap-2">
                            <Save size={18} /> Save Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
