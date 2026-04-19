'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import CategoryTiles from '@/components/CategoryTiles';
import TripForm from '@/components/TripForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import PDFExport from '@/components/PDFExport';
import PredefinedPackages from '@/components/PredefinedPackages';
import { TripFormData, Itinerary } from '@/types';

interface PredefinedPackage {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  travelStyle: string;
  budget: string;
  category: string;
  imageEmoji: string;
  highlights: string[];
}

export default function Home() {
  const { data: session } = useSession();
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [currentFormData, setCurrentFormData] = useState<TripFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predefinedPackages, setPredefinedPackages] = useState<PredefinedPackage[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/packages/predefined')
      .then((r) => r.json())
      .then((data) => setPredefinedPackages(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSelectDestination = (destination: string) => {
    setSelectedDestination(destination);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setCurrentFormData(formData);
    setSaveMsg('');

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

  const handleSaveTrip = async () => {
    if (!itinerary || !currentFormData) return;
    setSaving(true);
    setSaveMsg('');

    const res = await fetch('/api/packages/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${currentFormData.destination} — ${currentFormData.duration} days`,
        destination: currentFormData.destination,
        duration: currentFormData.duration,
        formData: currentFormData,
        itinerary,
      }),
    });

    if (res.ok) {
      setSaveMsg('✅ Trip saved to your dashboard!');
    } else {
      setSaveMsg('❌ Failed to save. Please try again.');
    }
    setSaving(false);
  };

  const userRole = (session?.user as { role?: string })?.role;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-orange-500">✈️ TravelAI</Link>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">
                  📚 My Trips
                </Link>
                {userRole === 'ADMIN' && (
                  <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">
                    ⚙️ Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

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

      {/* Featured Packages */}
      <PredefinedPackages packages={predefinedPackages} onSelect={handleSelectDestination} />

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

          {/* Save Trip Button */}
          <div className="max-w-4xl mx-auto px-4 mt-4 text-center">
            {session ? (
              <>
                <button
                  onClick={handleSaveTrip}
                  disabled={saving}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-2xl transition-all disabled:opacity-60 shadow-md"
                >
                  {saving ? 'Saving...' : '💾 Save Trip to Dashboard'}
                </button>
                {saveMsg && (
                  <p className="mt-3 text-sm font-semibold text-gray-600">{saveMsg}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                <Link href="/auth/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
                {' '}to save this itinerary to your dashboard.
              </p>
            )}
          </div>
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
