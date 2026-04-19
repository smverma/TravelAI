'use client';

import { useState, useRef } from 'react';
import CategoryTiles from '@/components/CategoryTiles';
import TripForm from '@/components/TripForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import PDFExport from '@/components/PDFExport';
import { TripFormData, Itinerary } from '@/types';

export default function Home() {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  const handleSelectDestination = (destination: string) => {
    setSelectedDestination(destination);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      setItinerary(data);
      setTimeout(() => {
        itineraryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            TravelAI
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-2 text-white/90">
            AI-Powered Indian Travel Planner
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Plan your perfect family trip across India with personalized AI itineraries. 
            From sacred temples to pristine beaches — we&apos;ve got you covered!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {['🛕 Religious', '🏛️ Historical', '🏖️ Beaches', '🏔️ Mountains', '🌆 Cities'].map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <CategoryTiles onSelectDestination={handleSelectDestination} />

      {/* Trip Form */}
      <div ref={formRef}>
        <TripForm
          initialDestination={selectedDestination}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">✈️</div>
          </div>
          <p className="mt-6 text-xl font-semibold text-gray-700">Planning your perfect trip...</p>
          <p className="text-gray-500 mt-2">Our AI is crafting a personalized itinerary just for you</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">😕</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Itinerary Display */}
      {itinerary && (
        <div ref={itineraryRef} className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">🎉 Your Itinerary is Ready!</h2>
              <p className="text-gray-500 mt-2">Here&apos;s your personalized travel plan</p>
            </div>
          </div>
          <ItineraryDisplay itinerary={itinerary} />
          <PDFExport itinerary={itinerary} />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 px-4 mt-16">
        <p className="text-lg font-semibold mb-2">🌏 TravelAI</p>
        <p className="text-gray-400 text-sm">AI-powered travel planning for Indian families</p>
        <p className="text-gray-500 text-xs mt-3">Powered by Google Gemini AI</p>
      </footer>
    </main>
  );
}

