'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { Itinerary } from '@/types';

interface PDFExportProps {
  itinerary: Itinerary;
}

interface TextOptions {
  maxWidth?: number;
  fontSize?: number;
  fontStyle?: 'normal' | 'bold' | 'italic';
  color?: [number, number, number];
}

export default function PDFExport({ itinerary }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      const addPageIfNeeded = (height: number) => {
        if (yPos + height > 270) {
          pdf.addPage();
          yPos = 20;
        }
      };

      const addText = (text: string, x: number, y: number, options?: TextOptions) => {
        if (options?.fontSize) pdf.setFontSize(options.fontSize);
        if (options?.fontStyle) pdf.setFont('helvetica', options.fontStyle);
        if (options?.color) pdf.setTextColor(...options.color);
        if (options?.maxWidth) {
          pdf.text(text, x, y, { maxWidth: options.maxWidth });
        } else {
          pdf.text(text, x, y);
        }
        // Reset
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      };

      // Header
      pdf.setFillColor(249, 115, 22);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Travel Plan: ${itinerary.trip_summary.destination}`, margin, 15);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${itinerary.trip_summary.duration_days} Days | ${itinerary.trip_summary.travel_style} | ${itinerary.trip_summary.estimated_total_cost}`, margin, 26);
      pdf.setTextColor(0, 0, 0);
      yPos = 50;

      // Trip Summary
      addText('TRIP SUMMARY', margin, yPos, { fontSize: 13, fontStyle: 'bold', color: [234, 88, 12] });
      yPos += 8;
      addText(`Destination: ${itinerary.trip_summary.destination}`, margin, yPos, { fontSize: 10, maxWidth: contentWidth });
      yPos += 6;
      addText(`Duration: ${itinerary.trip_summary.duration_days} days`, margin, yPos, { fontSize: 10 });
      yPos += 6;
      addText(`Travel Style: ${itinerary.trip_summary.travel_style}`, margin, yPos, { fontSize: 10 });
      yPos += 6;
      addText(`Estimated Cost: ${itinerary.trip_summary.estimated_total_cost}`, margin, yPos, { fontSize: 10 });
      yPos += 10;

      // Weather
      addText('WEATHER INFO', margin, yPos, { fontSize: 13, fontStyle: 'bold', color: [234, 88, 12] });
      yPos += 8;
      const weatherLines = pdf.splitTextToSize(itinerary.weather_info, contentWidth);
      addPageIfNeeded(weatherLines.length * 5 + 5);
      pdf.setFontSize(10);
      pdf.text(weatherLines, margin, yPos);
      yPos += weatherLines.length * 5 + 8;

      // Daily Plan
      addText('DAY-BY-DAY ITINERARY', margin, yPos, { fontSize: 13, fontStyle: 'bold', color: [234, 88, 12] });
      yPos += 8;

      for (const day of itinerary.daily_plan) {
        addPageIfNeeded(50);

        pdf.setFillColor(254, 215, 170);
        pdf.rect(margin, yPos - 4, contentWidth, 10, 'F');
        addText(`Day ${day.day}`, margin + 2, yPos + 3, { fontSize: 11, fontStyle: 'bold', color: [154, 52, 18] });
        yPos += 12;

        const sections = [
          { label: 'Morning', text: day.morning },
          { label: 'Afternoon', text: day.afternoon },
          { label: 'Evening', text: day.evening },
        ];

        for (const section of sections) {
          addPageIfNeeded(20);
          addText(section.label + ':', margin + 2, yPos, { fontSize: 10, fontStyle: 'bold' });
          yPos += 5;
          const lines = pdf.splitTextToSize(section.text, contentWidth - 4);
          pdf.setFontSize(9);
          pdf.text(lines, margin + 4, yPos);
          yPos += lines.length * 4 + 4;
        }

        // Meals
        addPageIfNeeded(20);
        addText('Meals:', margin + 2, yPos, { fontSize: 10, fontStyle: 'bold' });
        yPos += 5;
        pdf.setFontSize(9);
        const mealText = `B: ${day.meals.breakfast} | L: ${day.meals.lunch} | D: ${day.meals.dinner}`;
        const mealLines = pdf.splitTextToSize(mealText, contentWidth - 4);
        pdf.text(mealLines, margin + 4, yPos);
        yPos += mealLines.length * 4 + 4;

        // Tips & Cost
        addPageIfNeeded(15);
        addText('Tips:', margin + 2, yPos, { fontSize: 10, fontStyle: 'bold' });
        yPos += 5;
        const tipLines = pdf.splitTextToSize(day.local_tips, contentWidth - 4);
        pdf.setFontSize(9);
        pdf.text(tipLines, margin + 4, yPos);
        yPos += tipLines.length * 4;

        addPageIfNeeded(10);
        addText(`Approx Cost: ${day.approx_cost}`, margin + 2, yPos + 4, { fontSize: 9, fontStyle: 'bold', color: [15, 118, 110] });
        yPos += 10;

        // Places covered
        if (day.places_covered.length > 0) {
          addPageIfNeeded(10);
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Places: ${day.places_covered.join(', ')}`, margin + 2, yPos);
          pdf.setTextColor(0, 0, 0);
          yPos += 8;
        }

        yPos += 4;
      }

      // Food Recommendations
      if (itinerary.food_recommendations?.length > 0) {
        addPageIfNeeded(30);
        addText('MUST-TRY FOODS', margin, yPos, { fontSize: 13, fontStyle: 'bold', color: [234, 88, 12] });
        yPos += 8;
        pdf.setFontSize(10);
        itinerary.food_recommendations.forEach((food) => {
          addPageIfNeeded(8);
          pdf.text(`• ${food}`, margin + 2, yPos);
          yPos += 6;
        });
        yPos += 4;
      }

      // Packing Tips
      if (itinerary.packing_tips?.length > 0) {
        addPageIfNeeded(30);
        addText('PACKING TIPS', margin, yPos, { fontSize: 13, fontStyle: 'bold', color: [234, 88, 12] });
        yPos += 8;
        pdf.setFontSize(10);
        itinerary.packing_tips.forEach((tip) => {
          addPageIfNeeded(8);
          const tipLines = pdf.splitTextToSize(`• ${tip}`, contentWidth);
          pdf.text(tipLines, margin + 2, yPos);
          yPos += tipLines.length * 5 + 2;
        });
      }

      // Footer on each page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Generated by TravelAI | Page ${i} of ${totalPages}`, margin, 290);
        pdf.setTextColor(0, 0, 0);
      }

      pdf.save(`TravelAI-${itinerary.trip_summary.destination}-Itinerary.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-xl"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Exporting PDF...
          </>
        ) : (
          <>
            📥 Download PDF Itinerary
          </>
        )}
      </button>
    </div>
  );
}
