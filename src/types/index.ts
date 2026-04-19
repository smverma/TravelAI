export interface TripFormData {
  destination: string;
  adults: number;
  kids: number;
  seniors: number;
  duration: number;
  arrivalDate: string;
  travelStyle: 'fast-paced' | 'relaxed' | 'balanced';
  budget: 'budget' | 'mid-range' | 'luxury';
  language: 'English' | 'Hindi' | 'Gujarati' | 'Marathi' | 'Bengali';
  interests: string[];
  specialNeeds: string[];
}

export interface DailyPlan {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  places_covered: string[];
  local_tips: string;
  approx_cost: string;
}

export interface Itinerary {
  trip_summary: {
    destination: string;
    duration_days: string;
    travel_style: string;
    estimated_total_cost: string;
  };
  daily_plan: DailyPlan[];
  weather_info: string;
  best_time_to_visit: string;
  special_events: string;
  food_recommendations: string[];
  packing_tips: string[];
  language_support: string;
}
