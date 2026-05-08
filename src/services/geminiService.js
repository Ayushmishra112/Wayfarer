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
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const prompt = `You are Wayfarer AI — an adaptive travel intelligence engine.

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    // The Google Generative AI SDK accepts an optional RequestOptions object
    const result = await model.generateContent(
      prompt,
      { requestOptions: { signal: controller.signal } }
    );
    clearTimeout(timeoutId);
    
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
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('AI capacity reached. Please wait 60 seconds and try again.', { cause: error });
    }
    throw new Error('Failed to generate itinerary. Please check your API key or connection.', { cause: error });
  }
}

/**
 * Replans a specific section of the itinerary due to a live event.
 * Returns updated activities with explanations.
 */
export async function replanSection({ activities, event, destination }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const activityList = activities.map(a => `- ${a.time}: ${a.place} (${a.category})`).join('\n');

  const prompt = `You are Wayfarer AI's real-time replanning engine.

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    const result = await model.generateContent(
      prompt,
      { requestOptions: { signal: controller.signal } }
    );
    clearTimeout(timeoutId);

    const text = result.response.text();
    // Attempt to extract array from the response safely
    const match = text.match(/\[[\s\S]*\]/);
    const cleaned = match ? match[0] : text.replace(/```json\n?|\n?```/g, '').trim();
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

/**
 * Parses unstructured voice transcript into structured travel preferences.
 */
export async function parseVoiceToPreferences(transcript) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const prompt = `You are an AI assistant that converts unstructured voice transcripts into structured travel preferences.
Voice Transcript: "${transcript}"

Extract the following travel parameters. If a parameter is not explicitly mentioned, leave it empty (empty string).
Only return a valid JSON object with the exact following keys. DO NOT return markdown.

{
  "destination": "string (the location, e.g. 'Paris')",
  "duration": "number (in days, if not mentioned return null)",
  "budget": "string (one of: 'low', 'medium', 'high', or empty)",
  "vibe": "string (one of: 'explorer', 'relaxed', 'luxury', 'chaos', or empty)",
  "interests": "string (things they want to do)",
  "constraints": "string (things to avoid or constraints)"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const result = await model.generateContent(prompt, { requestOptions: { signal: controller.signal } });
    clearTimeout(timeoutId);

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse voice transcript:', error);
    throw new Error('Failed to parse voice transcript', { cause: error });
  }
}
