'use client';

import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera, Upload, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

interface OCRResult {
    id_number?: string;
    name?: string;
    dob?: string;
}

export default function AadharOCR({ onVerified }: { onVerified: (data: OCRResult) => void }) {
    const { t } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                processImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async (imageSrc: string) => {
        setIsProcessing(true);
        setError(null);
        setProgress(0);

        try {
            const worker = await createWorker('eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                }
            });

            const { data: { text } } = await worker.recognize(imageSrc);
            console.log("OCR Extracted Text:", text);

            // Simple Regex for Aadhar (12 digits) or PAN (5 letters, 4 digits, 1 letter)
            const aadharMatch = text.match(/\d{4}\s\d{4}\s\d{4}/) || text.match(/\d{12}/);
            const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);

            const result: OCRResult = {};
            if (aadharMatch) result.id_number = aadharMatch[0];
            if (panMatch) result.id_number = panMatch[0];

            if (result.id_number) {
                onVerified(result);
            } else {
                setError("Could not clearly read ID number. Please try a clearer photo.");
            }

            await worker.terminate();
        } catch (err) {
            console.error("OCR Error:", err);
            setError("Failed to process image. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                {!image ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-[1.6/1] border-2 border-dashed border-earth-300 rounded-2xl flex flex-col items-center justify-center gap-4 bg-earth-50 hover:bg-earth-100 transition-colors cursor-pointer"
                    >
                        <div className="p-4 bg-white rounded-full shadow-sm text-earth-600">
                            <Camera size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-earth-900">{t('kyc_tap_capture')}</p>
                            <p className="text-sm text-earth-500">{t('kyc_upload_id_desc')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg">
                        <img src={image} alt="ID Preview" className="w-full h-full object-cover" />
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-4 backdrop-blur-sm">
                                <Loader2 className="w-12 h-12 animate-spin text-emerald-400" />
                                <div className="text-center">
                                    <p className="font-bold text-lg">{t('kyc_verifying')}</p>
                                    <div className="w-48 h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs mt-1 text-white/70">{progress}% scanned</p>
                                </div>
                            </div>
                        )}
                        {!isProcessing && (
                            <button
                                onClick={() => { setImage(null); setError(null); }}
                                className="absolute top-4 right-4 bg-white/90 text-red-600 p-2 rounded-full hover:bg-white transition-colors"
                            >
                                <AlertCircle size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700 items-center">
                    <AlertCircle className="shrink-0" size={20} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}
