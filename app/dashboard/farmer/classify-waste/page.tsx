'use client';

import { useState } from 'react';
import { Sparkles, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import WasteUploader from '@/app/components/WasteUploader';
import ClassificationResults from '@/app/components/ClassificationResults';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface ClassificationResult {
    predicted_class: string;
    display_name: string;
    confidence: number;
    industrial_uses: any[];
    environmental_benefits: any;
    price_range: any;
}

export default function ClassifyWastePage() {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isClassifying, setIsClassifying] = useState(false);
    const [result, setResult] = useState<ClassificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelected = (file: File) => {
        setSelectedImage(file);
        setResult(null);
        setError(null);
    };

    const handleClear = () => {
        setSelectedImage(null);
        setResult(null);
        setError(null);
    };

    const handleClassify = async () => {
        if (!selectedImage) return;

        setIsClassifying(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedImage);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081'}/api/classify-waste`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Classification failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            console.error('Classification error:', err);
            setError(err.message || 'Failed to classify waste. Please try again.');
        } finally {
            setIsClassifying(false);
        }
    };

    const handleClassifyAnother = () => {
        setSelectedImage(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/farmer"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('ai_back_dash')}
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('ai_title')}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {t('ai_desc')}
                            </p>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-semibold mb-1">{t('ai_how_works')}</p>
                            <p>
                                {t('ai_how_desc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {!result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <WasteUploader
                            onImageSelected={handleImageSelected}
                            selectedImage={selectedImage}
                            onClear={handleClear}
                        />

                        {error && (
                            <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                                <p className="text-red-800 font-medium">{error}</p>
                            </div>
                        )}

                        {selectedImage && !isClassifying && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleClassify}
                                    disabled={isClassifying}
                                    className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <span className="flex items-center gap-3">
                                        <Sparkles className="w-6 h-6" />
                                        {t('dash_ai_classify_btn')}
                                    </span>
                                </button>
                            </div>
                        )}

                        {isClassifying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 flex flex-col items-center gap-4"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {t('ai_analyzing_img')}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {t('ai_identifying')}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <ClassificationResults
                        result={result}
                        onClassifyAnother={handleClassifyAnother}
                    />
                )}

                {/* How to Get Best Results */}
                {!result && (
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {t('ai_tips_title')}
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                    1
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('ai_tip_1_title')}</p>
                                    <p className="text-sm text-gray-600">
                                        {t('ai_tip_1_desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('ai_tip_2_title')}</p>
                                    <p className="text-sm text-gray-600">
                                        {t('ai_tip_2_desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('ai_tip_3_title')}</p>
                                    <p className="text-sm text-gray-600">
                                        {t('ai_tip_3_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
