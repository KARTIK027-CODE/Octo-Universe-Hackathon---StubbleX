'use client';

import { CheckCircle, Leaf, Factory, DollarSign, Droplets, Wind, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';

interface IndustrialUse {
    industry: string;
    application: string;
    processing: string;
    market_demand: string;
}

interface EnvironmentalBenefits {
    co2_reduction_per_ton: number;
    soil_nitrogen_retained_kg: number;
    water_savings_liters: number;
}

interface PriceRange {
    min_per_ton: number;
    max_per_ton: number;
    currency: string;
}

interface ClassificationResult {
    predicted_class: string;
    display_name: string;
    confidence: number;
    industrial_uses: IndustrialUse[];
    environmental_benefits: EnvironmentalBenefits;
    price_range: PriceRange;
}

interface ClassificationResultsProps {
    result: ClassificationResult;
    onClassifyAnother: () => void;
}

export default function ClassificationResults({ result, onClassifyAnother }: ClassificationResultsProps) {
    const { t } = useLanguage();
    const confidencePercentage = (result.confidence * 100).toFixed(1);
    const confidenceColor = result.confidence > 0.7 ? 'emerald' : result.confidence > 0.5 ? 'yellow' : 'red';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Prediction Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">{t('ai_classify_complete')}</h2>
                        </div>
                        <h3 className="text-4xl font-bold mt-4">{result.display_name}</h3>
                        <p className="text-emerald-100 mt-2">
                            {t('ai_identified_with')} {confidencePercentage}% {t('ai_confidence')}
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-emerald-100 mb-1">{t('ai_confidence_score')}</div>
                        <div className="text-5xl font-bold">{confidencePercentage}%</div>
                    </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidencePercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full bg-white rounded-full`}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-500 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t('ai_est_market_value')}</h3>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-amber-600">
                        ₹{result.price_range.min_per_ton.toLocaleString()}
                    </span>
                    <span className="text-2xl text-gray-600">-</span>
                    <span className="text-4xl font-bold text-amber-600">
                        ₹{result.price_range.max_per_ton.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-600">{t('ai_per_ton')}</span>
                </div>
            </div>

            {/* Environmental Benefits */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-500 rounded-lg">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t('ai_impact_title')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Wind className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">{t('ai_co2_reduction')}</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                            {result.environmental_benefits.co2_reduction_per_ton.toLocaleString()} kg
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{t('ai_vs_burning')}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">{t('ai_nitrogen_retained')}</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                            {result.environmental_benefits.soil_nitrogen_retained_kg} kg
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{t('ai_nutrients_saved')}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">{t('ai_water_savings')}</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                            {result.environmental_benefits.water_savings_liters.toLocaleString()} L
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{t('ai_water_conserved')}</div>
                    </div>
                </div>
            </div>

            {/* Industrial Uses */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500 rounded-lg">
                        <Factory className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t('ai_industrial_reuse')}</h3>
                </div>

                <div className="grid gap-4">
                    {result.industrial_uses.map((use, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-900">{use.industry}</h4>
                                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${use.market_demand === 'Very High' ? 'bg-green-500 text-white' :
                                        use.market_demand === 'High' ? 'bg-emerald-500 text-white' :
                                            use.market_demand === 'Medium' ? 'bg-yellow-500 text-white' :
                                                use.market_demand === 'Growing' ? 'bg-blue-500 text-white' :
                                                    'bg-gray-500 text-white'}
                `}>
                                    {use.market_demand} {t('ai_market_demand')}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-3">
                                <span className="font-semibold">{t('ai_application')}:</span> {use.application}
                            </p>

                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">{t('ai_processing')}:</span> {use.processing}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={onClassifyAnother}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    {t('ai_classify_another')}
                </button>
            </div>
        </motion.div>
    );
}
