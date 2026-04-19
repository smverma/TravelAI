import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TripFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData: TripFormData = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const prompt = buildPrompt(formData);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract the outermost JSON object from the response
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('Failed to extract JSON from AI response. The response may be malformed or empty.');
    }

    const itinerary = JSON.parse(text.slice(firstBrace, lastBrace + 1));
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}

function buildPrompt(data: TripFormData): string {
  const travelersInfo = [];
  if (data.adults > 0) travelersInfo.push(`${data.adults} adult(s)`);
  if (data.kids > 0) travelersInfo.push(`${data.kids} kid(s)`);
  if (data.seniors > 0) travelersInfo.push(`${data.seniors} senior citizen(s)`);

  return `You are an expert Indian travel planner specializing in family trips. Create a detailed travel itinerary for an Indian family.

Trip Details:
- Destination: ${data.destination}
- Travelers: ${travelersInfo.join(', ')}
- Duration: ${data.duration} days
- Arrival Date: ${data.arrivalDate}
- Travel Style: ${data.travelStyle}
- Budget: ${data.budget}
- Language Preference: ${data.language}
- Interests: ${data.interests.join(', ') || 'General sightseeing'}
- Special Needs: ${data.specialNeeds.join(', ') || 'None'}

IMPORTANT INSTRUCTIONS:
1. Do NOT include flights from hometown or inter-city train/bus booking details
2. Focus ONLY on activities, sightseeing, food, and local transport at the destination
3. Include day-wise breakdown (morning/afternoon/evening activities)
4. Include food suggestions with local cuisine recommendations
5. Include approximate daily cost in INR
6. Include practical local tips (common scams to avoid, timings, dress codes)
7. Tailor suggestions for Indian families with the specified composition
8. Response language should be ${data.language}
9. Consider the budget level (${data.budget}) for all recommendations

Return ONLY valid JSON (no markdown, no code blocks, no explanation) in exactly this structure:
{
  "trip_summary": {
    "destination": "${data.destination}",
    "duration_days": "${data.duration}",
    "travel_style": "${data.travelStyle}",
    "estimated_total_cost": "INR X,XXX - X,XXX"
  },
  "daily_plan": [
    {
      "day": 1,
      "morning": "Detailed morning activities",
      "afternoon": "Detailed afternoon activities",
      "evening": "Detailed evening activities",
      "meals": {
        "breakfast": "Specific local breakfast recommendation with restaurant/place",
        "lunch": "Specific local lunch recommendation",
        "dinner": "Specific local dinner recommendation"
      },
      "places_covered": ["Place 1", "Place 2", "Place 3"],
      "local_tips": "Important tips for this day",
      "approx_cost": "INR X,XXX per person"
    }
  ],
  "weather_info": "Weather details for ${data.arrivalDate} and the trip duration",
  "best_time_to_visit": "Best months and seasons",
  "special_events": "Any festivals or events during the travel period",
  "food_recommendations": ["Must-try dish 1", "Must-try dish 2", "Must-try dish 3"],
  "packing_tips": ["Packing tip 1", "Packing tip 2", "Packing tip 3"],
  "language_support": "Common local phrases or language tips"
}

Generate exactly ${data.duration} day entries in daily_plan array. Make it practical, realistic and tailored for Indian families.`;
}
