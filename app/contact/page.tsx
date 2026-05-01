"use client";
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <nav className="p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 font-medium">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </nav>

            <div className="flex-1 flex flex-col items-center px-6 py-12">
                <div className="max-w-4xl w-full">
                    <h1 className="text-4xl md:text-5xl font-bold text-earth-900 mb-6 text-center">Get in Touch</h1>
                    <p className="text-earth-600 text-center text-lg mb-16 max-w-2xl mx-auto">
                        Have questions about selling your crop waste or buying biomass? We're here to help you every step of the way.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100">
                                <h3 className="text-xl font-bold text-earth-800 mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-earth-900">Email Us</p>
                                            <p className="text-earth-600">support@stubblex.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-earth-900">Call Us</p>
                                            <p className="text-earth-600">+91 98765 43210</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-earth-900">Visit Us</p>
                                            <p className="text-earth-600">Agri-Tech Park, Sector 62,<br />Noida, Uttar Pradesh, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form className="bg-white p-8 rounded-2xl shadow-lg border border-earth-100 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-earth-700 mb-2">Your Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-earth-700 mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-earth-700 mb-2">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="w-full py-4 bg-earth-900 text-white font-bold rounded-xl hover:bg-earth-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
