'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import { Download, Award, ShieldCheck, Leaf } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

interface CertificateProps {
    farmerName: string;
    co2Saved: number;
    wasteRecycled: number;
    date: string;
    certificateId: string;
}

export default function ImpactCertificate({ farmerName, co2Saved, wasteRecycled, date, certificateId }: CertificateProps) {
    const { t } = useLanguage();

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Background Color
        doc.setFillColor(253, 251, 247); // #FDFBF7
        doc.rect(0, 0, 297, 210, 'F');

        // Border
        doc.setDrawColor(34, 197, 94); // emerald-500
        doc.setLineWidth(2);
        doc.rect(10, 10, 277, 190);
        doc.setLineWidth(0.5);
        doc.rect(12, 12, 273, 186);

        // Header
        doc.setTextColor(20, 83, 45); // emerald-900
        doc.setFontSize(40);
        doc.setFont('helvetica', 'bold');
        doc.text('StubbleX Impact Certificate', 148.5, 40, { align: 'center' });

        // Subtitle
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('This certificate is proudly presented to', 148.5, 60, { align: 'center' });

        // Farmer Name
        doc.setTextColor(20, 83, 45);
        doc.setFontSize(35);
        doc.setFont('helvetica', 'bold');
        doc.text(farmerName, 148.5, 80, { align: 'center' });

        // Divider
        doc.setDrawColor(200, 200, 200);
        doc.line(80, 90, 217, 90);

        // Achievement Text
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('For their outstanding contribution to environmental sustainability by', 148.5, 105, { align: 'center' });
        doc.text('preventing crop stubble burning and promoting circular economy.', 148.5, 112, { align: 'center' });

        // Impact Stats
        doc.setFillColor(240, 253, 244); // emerald-50
        doc.roundedRect(40, 125, 100, 40, 3, 3, 'F');
        doc.roundedRect(157, 125, 100, 40, 3, 3, 'F');

        doc.setFontSize(22);
        doc.setTextColor(22, 163, 74); // green-600
        doc.text(`${co2Saved} Tons`, 90, 142, { align: 'center' });
        doc.text(`${wasteRecycled} Tons`, 207, 142, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('CO2 Emissions Prevented', 90, 155, { align: 'center' });
        doc.text('Biomass Waste Recycled', 207, 155, { align: 'center' });

        // Footer
        doc.setFontSize(10);
        doc.text(`Date of Issue: ${date}`, 40, 185);
        doc.text(`Certificate ID: ${certificateId}`, 40, 190);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Authorized by StubbleX Foundation', 257, 185, { align: 'right' });

        // Add a small logo/icon placeholder logic
        doc.setDrawColor(34, 197, 94);
        doc.circle(257, 165, 10, 'S');

        doc.save(`StubbleX_Impact_${farmerName.replace(' ', '_')}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
        >
            <Download size={16} />
            Download AI Carbon Certificate
        </button>
    );
}
