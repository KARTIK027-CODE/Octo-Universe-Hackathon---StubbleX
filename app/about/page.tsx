"use client";
import Link from 'next/link';
import { ArrowLeft, Leaf, Recycle, Globe } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();
    return (
        <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <nav className="p-6 sticky top-0 bg-[#FDFBF7]/80 backdrop-blur z-50">
                <Link href="/" className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 font-medium">
                    <ArrowLeft size={20} /> {t('nav_home')}
                </Link>
            </nav>

            <section className="relative px-6 pt-10 pb-24 flex flex-col items-center text-center">
                <div className="max-w-3xl">
                    <span className="text-green-600 font-bold tracking-wider uppercase text-sm mb-4 block">{t('about_mission')}</span>
                    <h1 className="text-4xl md:text-6xl font-black text-earth-900 mb-8 leading-tight">
                        {t('about_title').replace(t('about_stubble_burning'), '')} <br /> <span className="text-red-500 line-through decoration-4 decoration-earth-900/20">{t('about_stubble_burning')}.</span>
                    </h1>
                    <p className="text-xl text-earth-700 leading-relaxed">
                        {t('about_subtitle')}
                    </p>
                </div>
            </section>

            <section className="bg-white py-24 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                            <Leaf size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-earth-900 mb-4">{t('about_for_farmers')}</h3>
                        <p className="text-earth-600">{t('about_for_farmers_desc')}</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                            <Recycle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-earth-900 mb-4">{t('about_for_industry')}</h3>
                        <p className="text-earth-600">{t('about_for_industry_desc')}</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-earth-900 mb-4">{t('about_for_planet')}</h3>
                        <p className="text-earth-600">{t('about_for_planet_desc')}</p>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}

