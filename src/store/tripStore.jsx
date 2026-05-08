// src/store/tripStore.jsx
// Centralized application state using React Context + useReducer
// This pattern avoids prop drilling while keeping the codebase simple

import { createContext, useContext, useReducer, useCallback } from 'react';
import { ACTIONS } from './tripActions';

// ─── Initial State Factory ───────────────────────────────────────
// Fixed Q-INIT: Returns fresh state with new timestamps each call
// eslint-disable-next-line react-refresh/only-export-components
export const createInitialState = () => ({
  // User preferences
  preferences: {
    destination: '',
    budget: 'medium',
    vibe: '',
    duration: 3,
    interests: '',
    constraints: '',
  },

  // Generated itinerary
  itinerary: null,

  // Weather data
  weather: null,

  // Live alerts feed
  alerts: [
    {
      id: 'initial_1',
      type: 'info',
      title: 'Global Intelligence Active',
      message: 'Monitoring local events and transit patterns in 42 cities.',
      timestamp: new Date(),
    },
    {
      id: 'initial_2',
      type: 'success',
      title: 'AI Calibration Complete',
      message: 'Personalization engine synced with latest travel trends.',
      timestamp: new Date(),
    }
  ],

  // App lifecycle states
  isGenerating: false,
  isReplanning: false,
  error: null,
  phase: 'input', // 'input' | 'generating' | 'result'

  // Replan history for explainability
  replanHistory: [],

  // Proposed Replan (for Intelligence Shift Modal)
  proposedReplan: null,
});

// ─── Reducer ──────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function tripReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, ...action.payload } };

    case ACTIONS.START_GENERATING:
      return { ...state, isGenerating: true, error: null, phase: 'generating', alerts: [] };

    case ACTIONS.SET_ITINERARY:
      return {
        ...state,
        itinerary: action.payload,
        isGenerating: false,
        phase: 'result',
      };

    case ACTIONS.SET_WEATHER:
      return { ...state, weather: action.payload };

    case ACTIONS.ADD_ALERT:
      return { ...state, alerts: [action.payload, ...state.alerts].slice(0, 10) };

    case ACTIONS.DISMISS_ALERT:
      return { ...state, alerts: state.alerts.filter(a => a.id !== action.payload) };

    case ACTIONS.START_REPLANNING:
      return { ...state, isReplanning: true, proposedReplan: null };

    case ACTIONS.PROPOSE_REPLAN:
      return { ...state, isReplanning: false, proposedReplan: action.payload };

    case ACTIONS.DISCARD_REPLAN:
      return { ...state, proposedReplan: null };

    case ACTIONS.APPLY_REPLAN:
      if (!state.itinerary) return state;
      return {
        ...state,
        isReplanning: false,
        itinerary: {
          ...state.itinerary,
          days: state.itinerary.days.map(day =>
            day.day === action.payload.dayIndex
              ? { ...day, activities: action.payload.activities }
              : day
          ),
        },
        replanHistory: action.payload.event
          ? [action.payload.event, ...state.replanHistory]
          : state.replanHistory,
        proposedReplan: null,
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isGenerating: false, isReplanning: false };

    case ACTIONS.RESET:
      return createInitialState(); // Reset to fresh state

    case ACTIONS.CLEAR_ALERTS:
      return { ...state, alerts: [] };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
const TripContext = createContext(null);

export function TripProvider({ children }) {
  // Fixed Q-INIT: Use lazy initializer
  const [state, dispatch] = useReducer(tripReducer, null, createInitialState);

  const addAlert = useCallback((alert) => {
    dispatch({
      type: ACTIONS.ADD_ALERT,
      payload: { ...alert, id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, timestamp: new Date() },
    });
  }, []);

  return (
    <TripContext.Provider value={{ state, dispatch, addAlert }}>
      {children}
    </TripContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTripStore() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripStore must be used within TripProvider');
  return ctx;
}
