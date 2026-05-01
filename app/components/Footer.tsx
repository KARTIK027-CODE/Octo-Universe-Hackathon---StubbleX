import React from "react";
import Link from 'next/link';
import { Recycle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-earth-900 text-white py-12 px-6 border-t border-earth-800 z-10 relative">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                        <div className="bg-green-500 p-1.5 rounded-lg text-white">
                            <Recycle size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">StubbleX</span>
                    </div>
                    <p className="text-earth-300 text-sm max-w-xs">
                        {t('footer_desc')}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-earth-200">
                    <Link href="/how-it-works" className="hover:text-white transition-colors">{t('nav_how_it_works')}</Link>
                    <Link href="/about" className="hover:text-white transition-colors">{t('footer_what_we_do')}</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">{t('footer_contact')}</Link>
                </div>

                <div className="text-earth-400 text-xs text-center md:text-right">
                    &copy; {new Date().getFullYear()} StubbleX Platform.<br />{t('footer_rights')}
                </div>
            </div>
        </footer>
    );
};
