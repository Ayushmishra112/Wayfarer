// src/services/geminiService.js
// Abstraction layer for Gemini AI API calls
// All AI logic lives here — never call Gemini directly from components

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set. Check your .env file.');
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generates a full travel itinerary based on user preferences.
 * Returns structured JSON with timeline, reasons, and alternatives.
 */
export async function generateItinerary({ destination, budget, vibe, duration, interests, weather, constraints }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are TripPulse AI — an adaptive travel intelligence engine.

Generate a personalized travel itinerary for:
- Destination: ${destination}
- Duration: ${duration} days
- Budget: ${budget} (low/medium/high)
- Vibe: ${vibe}
- Interests: ${interests}
- Current weather: ${weather || 'clear, 24°C'}
- Special constraints: ${constraints || 'none'}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "tripTitle": "string — catchy trip title",
  "tripDNA": "string — 2-sentence personality summary of this trip",
  "vibeScore": number (1-100),
  "days": [
    {
      "day": 1,
      "theme": "string",
      "activities": [
        {
          "id": "unique_id",
          "time": "9:00 AM",
          "place": "Place Name",
          "category": "food|culture|adventure|nightlife|relaxation|shopping",
          "duration": "2 hours",
          "description": "string — vivid 1-sentence description",
          "reason": "string — why AI picked this",
          "cost": "$10-20",
          "indoorOutdoor": "indoor|outdoor|both",
          "crowdLevel": "low|medium|high",
          "rating": 4.5,
          "tags": ["tag1", "tag2"],
          "alternative": {
            "place": "Alternative Place",
            "reason": "Why this is a backup"
          }
        }
      ]
    }
  ],
  "insiderTip": "string — one secret local tip",
  "budgetBreakdown": {
    "food": "string",
    "transport": "string",
    "activities": "string",
    "total": "string"
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(cleaned);
    if (!data.tripTitle || !Array.isArray(data.days)) {
      throw new Error('Gemini returned an unexpected response structure.');
    }
    return data;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw new Error('Failed to generate itinerary. Please check your API key or quota.', { cause: error });
  }
}

/**
 * Replans a specific section of the itinerary due to a live event.
 * Returns updated activities with explanations.
 */
export async function replanSection({ activities, event, destination }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const activityList = activities.map(a => `- ${a.time}: ${a.place} (${a.category})`).join('\n');

  const prompt = `You are TripPulse AI's real-time replanning engine.

A live disruption has occurred in ${destination}:
EVENT: ${event.type} — ${event.description}

Current planned activities:
${activityList}

Replan these activities to account for the disruption.
Return ONLY a valid JSON array with the same structure as the input activities.
Each activity must include an updated "reason" field explaining WHY it was changed or kept.
If an outdoor activity was changed to indoor due to rain, the reason should say so explicitly.
Do NOT include markdown or explanation — only the JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(cleaned);
    if (!Array.isArray(data)) {
      throw new Error('Gemini returned an invalid replan array.');
    }
    return data;
  } catch (error) {
    console.error('Gemini replan error:', error);
    throw new Error('Replanning failed. Using fallback logic.', { cause: error });
  }
}
