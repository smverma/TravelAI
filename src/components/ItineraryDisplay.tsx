'use client';

import { Itinerary } from '@/types';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  return (
    <div id="itinerary-content" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Trip Summary */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-6">🗺️ Your Trip to {itinerary.trip_summary.destination}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-lg font-bold">{itinerary.trip_summary.duration_days}</div>
            <div className="text-xs text-white/80">Days</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-bold capitalize">{itinerary.trip_summary.travel_style}</div>
            <div className="text-xs text-white/80">Travel Style</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center col-span-2">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm font-bold">{itinerary.trip_summary.estimated_total_cost}</div>
            <div className="text-xs text-white/80">Estimated Cost</div>
          </div>
        </div>
      </div>

      {/* Weather & Best Time */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">🌤️ Weather Info</h3>
          <p className="text-blue-700 text-sm">{itinerary.weather_info}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="font-bold text-green-800 mb-2">📆 Best Time to Visit</h3>
          <p className="text-green-700 text-sm">{itinerary.best_time_to_visit}</p>
        </div>
      </div>

      {/* Special Events */}
      {itinerary.special_events && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="font-bold text-purple-800 mb-2">🎉 Special Events During Your Trip</h3>
          <p className="text-purple-700 text-sm">{itinerary.special_events}</p>
        </div>
      )}

      {/* Daily Plan */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Day-by-Day Itinerary</h2>
        <div className="space-y-6">
          {itinerary.daily_plan.map((day) => (
            <div key={day.day} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Day {day.day}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {day.places_covered.map((place) => (
                    <span key={place} className="bg-white/30 text-white text-xs px-3 py-1 rounded-full font-medium">
                      📍 {place}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">🌅 Morning</h4>
                    <p className="text-gray-700 text-sm">{day.morning}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">☀️ Afternoon</h4>
                    <p className="text-gray-700 text-sm">{day.afternoon}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <h4 className="font-semibold text-indigo-800 mb-2">🌆 Evening</h4>
                    <p className="text-gray-700 text-sm">{day.evening}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-3">🍽️ Meals</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium text-green-700">Breakfast:</span> <span className="text-gray-600">{day.meals.breakfast}</span></p>
                      <p className="text-sm"><span className="font-medium text-green-700">Lunch:</span> <span className="text-gray-600">{day.meals.lunch}</span></p>
                      <p className="text-sm"><span className="font-medium text-green-700">Dinner:</span> <span className="text-gray-600">{day.meals.dinner}</span></p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">💡 Local Tips</h4>
                    <p className="text-gray-700 text-sm">{day.local_tips}</p>
                  </div>

                  <div className="bg-teal-50 rounded-xl p-4 text-center">
                    <h4 className="font-semibold text-teal-800 mb-1">💰 Daily Cost</h4>
                    <p className="text-teal-700 font-bold">{day.approx_cost}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Recommendations */}
      {itinerary.food_recommendations && itinerary.food_recommendations.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🍛 Must-Try Foods</h2>
          <div className="flex flex-wrap gap-3">
            {itinerary.food_recommendations.map((food, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Packing Tips */}
      {itinerary.packing_tips && itinerary.packing_tips.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎒 Packing Tips</h2>
          <ul className="space-y-2">
            {itinerary.packing_tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-500 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Language Support */}
      {itinerary.language_support && (
        <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-800 mb-3">🗣️ Language & Communication Tips</h2>
          <p className="text-blue-700 text-sm">{itinerary.language_support}</p>
        </div>
      )}
    </div>
  );
}
