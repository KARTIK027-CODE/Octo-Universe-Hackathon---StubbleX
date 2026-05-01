'use client';

import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';

interface WasteUploaderProps {
    onImageSelected: (file: File) => void;
    selectedImage: File | null;
    onClear: () => void;
}

export default function WasteUploader({ onImageSelected, selectedImage, onClear }: WasteUploaderProps) {
    const { t } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileSelection = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onImageSelected(file);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelection(files[0]);
        }
    };

    const handleClear = () => {
        setPreview(null);
        onClear();
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            {!selectedImage ? (
                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
            ${isDragging
                            ? 'border-emerald-500 bg-emerald-50 scale-[1.02]'
                            : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                        }
          `}
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full">
                            <Upload className="w-12 h-12 text-emerald-600" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('ai_upload_title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('ai_upload_desc')}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {t('ai_upload_supports')}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {t('ai_browse_files')}
                            </button>

                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-300 flex items-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                {t('ai_take_photo')}
                            </button>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 bg-white shadow-lg">
                    {preview && (
                        <div className="relative w-full aspect-video bg-gray-100">
                            <Image
                                src={preview}
                                alt="Selected waste"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}

                    <div className="absolute top-4 right-4">
                        <button
                            onClick={handleClear}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200">
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">{selectedImage.name}</span>
                            <span className="text-emerald-600">
                                ({(selectedImage.size / 1024).toFixed(1)} KB)
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
