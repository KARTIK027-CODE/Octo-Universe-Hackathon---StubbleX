"use client";
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Leaf, Recycle, Factory, Coins, TrendingUp, Scan, Mic, Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './context/LanguageContext'

import { ThreeDBackground } from './components/ThreeDBackground'
import { ProductCarousel } from './components/ProductCarousel'
import { TiltCard } from './components/TiltCard'
import { TextReveal } from './components/TextReveal'
import { CycleAnimation } from './components/CycleAnimation'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'

export default function Home() {
    const { language, setLanguage, t } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' }
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];
    return (
        <main className="min-h-screen flex flex-col bg-[#FDFBF7] relative overflow-hidden">
            <ThreeDBackground />

            {/* Navbar - Floating Glass Pill */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none"
            >
                <nav className="pointer-events-auto flex items-center gap-2 p-2 pl-6 pr-3 bg-white/70 backdrop-blur-xl border border-white/20 rounded-full shadow-xl shadow-earth-900/5">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 mr-6">
                        <div className="bg-earth-600 rounded-full p-1.5 text-white">
                            <Recycle size={18} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-earth-900">StubbleX</span>
                    </div>

                    {/* Links - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-1 mr-2">
                        <Link href="/how-it-works" className="px-4 py-2 rounded-full text-sm font-medium text-sand-600 hover:text-earth-900 hover:bg-white/50 transition-all">{t('nav_how_it_works')}</Link>
                        <Link href="/about" className="px-4 py-2 rounded-full text-sm font-medium text-sand-600 hover:text-earth-900 hover:bg-white/50 transition-all">{t('nav_about')}</Link>
                        <Link href="/dashboard/buyer" className="px-4 py-2 rounded-full text-sm font-medium text-sand-600 hover:text-earth-900 hover:bg-white/50 transition-all">{t('nav_marketplace')}</Link>
                    </div>

                    {/* Language Switcher */}
                    <div className="relative mr-2">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-earth-50 text-earth-700 hover:bg-earth-100 transition-all text-xs font-bold border border-earth-100"
                        >
                            <Globe size={14} />
                            {currentLang.code.toUpperCase()}
                            <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLangOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full mt-2 left-0 w-40 bg-white rounded-2xl shadow-2xl border border-earth-100 py-2 overflow-hidden z-[100]"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code as any);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${language === lang.code ? 'bg-earth-50 text-earth-900 font-bold' : 'text-earth-600 hover:bg-earth-50'}`}
                                        >
                                            <span>{lang.flag}</span>
                                            {lang.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-4 border-l border-sand-200">
                        <Link href="/login" className="px-5 py-2 rounded-full text-sm font-semibold text-earth-700 hover:bg-earth-50 transition-colors uppercase tracking-tight">{t('nav_login')}</Link>
                        <Link href="/register" className="px-5 py-2.5 rounded-full bg-earth-900 text-white text-sm font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap">
                            {t('nav_get_started')}
                        </Link>
                    </div>
                </nav>
            </motion.div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 flex flex-col md:flex-row items-center justify-center min-h-[90vh] max-w-7xl mx-auto gap-12">

                {/* Left Side: Text Content */}
                <div className="relative z-10 w-full md:w-1/2 text-left md:pr-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-earth-800 text-sm font-medium mb-8 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {t('hero_badge')}
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black text-earth-900 tracking-tighter mb-6 leading-[0.95] min-h-[1.2em]">
                        <motion.span
                            key={language}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="block"
                        >
                            {t('hero_title')}
                        </motion.span>
                    </h1>

                    <div className="overflow-hidden mb-10 min-h-[3.5em]">
                        <motion.p
                            key={language}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg md:text-xl text-earth-700 max-w-lg font-medium leading-relaxed"
                        >
                            {t('hero_subtitle')}
                        </motion.p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-start perspective-500">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                        >
                            <Link href="/dashboard?role=farmer" className="group relative px-8 py-4 bg-earth-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                                {t('hero_cta_primary')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                        >
                            <Link href="/dashboard?role=buyer" className="group px-8 py-4 bg-white text-earth-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl border border-earth-100 transition-all hover:-translate-y-1 inline-block">
                                {t('hero_cta_secondary')}
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: High-End Classic Visual */}
                <div className="w-full md:w-1/2 relative h-[500px] md:h-[600px] flex items-center justify-center -mt-20 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <CycleAnimation />
                    </motion.div>
                </div>
            </section>


            {/* Features 3D Cards */}
            <section className="py-24 px-6 bg-white perspective-1000 relative">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FDFBF7] to-white"></div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <TiltCard className="h-full">
                        <div className="bg-[#FDFBF7] rounded-[2rem] p-8 h-full border border-earth-100/50 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                            <div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-earth-600 mb-6 shadow-sm">
                                    <Coins size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-earth-900 mb-3">{t('feat_instant_val')}</h3>
                                <p className="text-earth-600 leading-relaxed font-medium">{t('feat_instant_val_desc')}</p>
                            </div>
                        </div>
                    </TiltCard>

                    <TiltCard className="h-full md:-mt-8 z-10">
                        <div className="bg-earth-900 rounded-[2rem] p-8 h-full border-4 border-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                            <div>
                                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                                    <Leaf size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-3">{t('feat_zero_burning')}</h3>
                                <p className="text-earth-200 leading-relaxed font-medium">{t('feat_zero_burning_desc')}</p>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-6">
                                <motion.div
                                    className="h-full bg-green-500"
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "75%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    </TiltCard>

                    <TiltCard className="h-full">
                        <div className="bg-[#FDFBF7] rounded-[2rem] p-8 h-full border border-earth-100/50 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                            <div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-earth-600 mb-6 shadow-sm">
                                    <Factory size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-earth-900 mb-3">{t('feat_industry_ready')}</h3>
                                <p className="text-earth-600 leading-relaxed font-medium">{t('feat_industry_ready_desc')}</p>
                            </div>
                        </div>
                    </TiltCard>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
                    <TiltCard className="h-full">
                        <div className="bg-[#FDFBF7] rounded-[2rem] p-8 h-full border border-earth-100/50 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                            <div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-earth-600 mb-6 shadow-sm">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-earth-900 mb-3">{t('feat_price_pred')}</h3>
                                <p className="text-earth-600 leading-relaxed font-medium">{t('feat_price_pred_desc')}</p>
                            </div>
                        </div>
                    </TiltCard>

                    <TiltCard className="h-full md:-mt-8 z-10">
                        <div className="bg-earth-900 rounded-[2rem] p-8 h-full border-4 border-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                            <div>
                                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                                    <Scan size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-3">{t('feat_smart_class')}</h3>
                                <p className="text-earth-200 leading-relaxed font-medium">{t('feat_smart_class_desc')}</p>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-6 relative">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-green-500 w-1/3"
                                    animate={{
                                        left: ["-100%", "200%"]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 0.5
                                    }}
                                />
                            </div>
                        </div>
                    </TiltCard>

                    <TiltCard className="h-full">
                        <div className="bg-[#FDFBF7] rounded-[2rem] p-8 h-full border border-earth-100/50 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                            <div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-earth-600 mb-6 shadow-sm">
                                    <Mic size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-earth-900 mb-3">{t('feat_voice_ast')}</h3>
                                <p className="text-earth-600 leading-relaxed font-medium">{t('feat_voice_ast_desc')}</p>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </section>

            {/* Product Showcase Section */}
            <section className="py-24 bg-earth-800 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute right-0 top-0 w-96 h-96 bg-green-500 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, -20, 20, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 bottom-0 w-96 h-96 bg-yellow-500 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"
                    />
                </div>

                <div className="relative z-10 w-full">
                    <div className="text-center mb-12 px-6">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-earth-300 font-bold tracking-wider uppercase text-sm mb-4 block"
                        >
                            {t('impact_label')}
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            <TextReveal className="justify-center gap-x-2">{t('impact_title')}</TextReveal>
                        </h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-earth-200 text-lg max-w-2xl mx-auto"
                        >
                            {t('impact_desc')}
                        </motion.p>
                    </div>

                    {/* Carousel */}
                    <ProductCarousel />
                </div>
            </section>

            {/* Impact & Testimonials Section - NEW */}
            <Testimonials />

            {/* Footer */}
            <Footer />
        </main >
    )
}

