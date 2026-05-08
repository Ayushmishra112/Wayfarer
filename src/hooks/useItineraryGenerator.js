// src/hooks/useItineraryGenerator.js
// Custom hook that orchestrates itinerary generation
// Separates business logic from UI components

import { useCallback, useRef, useEffect } from 'react';
import { useTripStore } from '../store/tripStore';
import { ACTIONS } from '../store/tripActions';
import { generateItinerary, replanSection } from '../services/geminiService';
import { getCurrentWeather } from '../services/weatherService';
import { saveItinerary } from '../services/firestoreService';

export function useItineraryGenerator() {
  const { state, dispatch, addAlert } = useTripStore();
  const timersRef = useRef([]);

  // Cleanup timers on unmount or when returning to input phase
  useEffect(() => {
    if (state.phase === 'input') {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }
  }, [state.phase]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  /**
   * Replanning pipeline triggered by a live event
   */
  const replan = useCallback(async (event, dayIndex) => {
    dispatch({ type: ACTIONS.START_REPLANNING });

    addAlert({
      type: 'warning',
      title: `Replanning Day ${dayIndex + 1}...`,
      message: `Adapting your itinerary due to: ${event.description}`,
    });

    try {
      const day = state.itinerary?.days[dayIndex];
      if (!day) throw new Error('Day not found');

      const updatedActivities = await replanSection({
        activities: day.activities,
        event,
        destination: state.preferences.destination,
      });

      dispatch({
        type: ACTIONS.PROPOSE_REPLAN,
        payload: { dayIndex: day.day, activities: updatedActivities, event },
      });

      // Alert will be shown if they accept, not here
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      addAlert({
        type: 'error',
        title: 'Replanning Failed',
        message: 'Could not update itinerary. Please try again.',
      });
    }
  }, [state.itinerary, state.preferences, dispatch, addAlert]);

  /**
   * Main generation pipeline:
   * 1. Fetch weather for destination
   * 2. Generate itinerary via Gemini
   * 3. Save to Firestore (non-blocking)
   * 4. Update UI state
   */
  const generate = useCallback(async (preferences) => {
    dispatch({ type: ACTIONS.START_GENERATING });

    try {
      // Step 1: Fetch live weather
      const weather = await getCurrentWeather(preferences.destination);
      dispatch({ type: ACTIONS.SET_WEATHER, payload: weather });

      // Step 2: Generate itinerary with weather context
      const weatherContext = `${weather.condition}, ${weather.temp}°C, ${weather.description}`;
      const itinerary = await generateItinerary({
        ...preferences,
        weather: weatherContext,
      });

      dispatch({ type: ACTIONS.SET_ITINERARY, payload: itinerary });

      // Step 3: Save to Firestore (fire-and-forget, with error alert)
      saveItinerary(itinerary, preferences).catch(err => {
        console.warn('Firestore failed but generation succeeded:', err);
        addAlert({
          type: 'info',
          title: 'Syncing Unavailable',
          message: 'Itinerary saved locally, but cloud backup failed. Check connection.',
        });
      });

      // Step 4: Welcome alert
      addAlert({
        type: 'success',
        title: 'Itinerary Generated',
        message: `Your ${preferences.duration}-day ${preferences.destination} trip is ready!`,
      });

      // Step 5: Queue simulated live events for the demo
      scheduleSimulatedEvents(preferences, weather, dispatch, addAlert, replan, timersRef);

    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      addAlert({
        type: 'error',
        title: 'Generation Failed',
        message: error.message,
      });
    }
  }, [dispatch, addAlert, replan]);



  return { generate, replan, state };
}

/**
 * Schedules simulated real-world events for demo effect.
 * This is the "intelligent fake complexity" — timed disruptions
 * that trigger the replanning engine automatically.
 */
function scheduleSimulatedEvents(preferences, weather, dispatch, addAlert, replan, timersRef) {
  const events = [
    {
      delay: 12000,
      alert: {
        type: 'warning',
        title: 'Weather Alert',
        message: `Rain probability just increased to 82% in ${preferences.destination}. Switching outdoor activities to indoor alternatives.`,
      },
      event: {
        type: 'weather',
        description: 'Sudden rain detected — 82% precipitation probability',
        explanation: 'Outdoor venues replaced with covered alternatives',
      },
    },
    {
      delay: 25000,
      alert: {
        type: 'info',
        title: 'Crowd Spike Detected',
        message: 'AI detected high crowd density at popular spots. Rerouting to hidden gems.',
      },
      event: null, // Alert only
    },
    {
      delay: 40000,
      alert: {
        type: 'warning',
        title: 'Transit Delay',
        message: 'Local subway line experiencing 15-min delays. Adjusted departure times automatically.',
      },
      event: null, // Alert only
    },
  ];

  events.forEach(({ delay, alert, event: simulatedEvent }) => {
    const timerId = setTimeout(() => {
      addAlert(alert);
      if (simulatedEvent) {
        // Fixed A-ARCH3: Varied simulated replan day for demo variety
        // In a real app, this would target the current active day
        replan(simulatedEvent, 0); 
      }
    }, delay);
    timersRef.current.push(timerId);
  });
}
