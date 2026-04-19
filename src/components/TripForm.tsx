'use client';

import { useState, useEffect } from 'react';
import { TripFormData } from '@/types';

interface TripFormProps {
  initialDestination?: string;
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const interestOptions = ['Food', 'Culture', 'Adventure', 'Shopping'];
const specialNeedOptions = ['Kid-friendly', 'Senior citizen friendly'];

export default function TripForm({ initialDestination, onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: initialDestination || '',
    adults: 2,
    kids: 0,
    seniors: 0,
    duration: 3,
    arrivalDate: '',
    travelStyle: 'balanced',
    budget: 'mid-range',
    language: 'English',
    interests: [],
    specialNeeds: [],
  });

  useEffect(() => {
    if (initialDestination) {
      setFormData((prev) => ({ ...prev, destination: initialDestination }));
    }
  }, [initialDestination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleSpecialNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter((n) => n !== need)
        : [...prev.specialNeeds, need],
    }));
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          ✈️ Plan Your Trip
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Tell us about your dream vacation and we&apos;ll create the perfect itinerary
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🗺️ Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g., Goa, Rajasthan, Manali..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
              required
            />
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              👨‍👩‍👧‍👦 Travelers
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Kids</label>
                <input
                  type="number"
                  min="0"
                  value={formData.kids}
                  onChange={(e) => setFormData({ ...formData, kids: parseInt(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Senior Citizens</label>
                <input
                  type="number"
                  min="0"
                  value={formData.seniors}
                  onChange={(e) => setFormData({ ...formData, seniors: parseInt(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Duration & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Trip Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🛬 Arrival Date
              </label>
              <input
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* Travel Style & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Travel Style
              </label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value as TripFormData['travelStyle'] })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
              >
                <option value="fast-paced">⚡ Fast-paced</option>
                <option value="relaxed">🌿 Relaxed</option>
                <option value="balanced">⚖️ Balanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Budget
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value as TripFormData['budget'] })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
              >
                <option value="budget">🎒 Budget</option>
                <option value="mid-range">🏨 Mid-range</option>
                <option value="luxury">💎 Luxury</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🗣️ Preferred Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as TripFormData['language'] })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
            >
              <option value="English">🇬🇧 English</option>
              <option value="Hindi">🇮🇳 Hindi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Marathi">Marathi</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ❤️ Interests
            </label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  {interest === 'Food' && '🍛 '}
                  {interest === 'Culture' && '🎭 '}
                  {interest === 'Adventure' && '🧗 '}
                  {interest === 'Shopping' && '🛍️ '}
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ♿ Special Requirements
            </label>
            <div className="flex flex-wrap gap-3">
              {specialNeedOptions.map((need) => (
                <button
                  key={need}
                  type="button"
                  onClick={() => toggleSpecialNeed(need)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.specialNeeds.includes(need)
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-teal-100'
                  }`}
                >
                  {need === 'Kid-friendly' && '👶 '}
                  {need === 'Senior citizen friendly' && '👴 '}
                  {need}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Your Itinerary...
              </span>
            ) : (
              '✨ Generate My Travel Plan'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
