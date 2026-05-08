import { describe, it, expect } from 'vitest';
import { tripReducer, createInitialState } from './tripStore';
import { ACTIONS } from './tripActions';

describe('tripReducer', () => {
  it('should return initial state on RESET', () => {
    const state = { ...createInitialState(), isGenerating: true };
    const newState = tripReducer(state, { type: ACTIONS.RESET });
    expect(newState.isGenerating).toBe(false);
    expect(newState.alerts.length).toBe(2);
  });

  it('should update preferences on SET_PREFERENCES', () => {
    const state = createInitialState();
    const newState = tripReducer(state, {
      type: ACTIONS.SET_PREFERENCES,
      payload: { destination: 'Paris' },
    });
    expect(newState.preferences.destination).toBe('Paris');
  });

  it('should set isGenerating to true and clear alerts on START_GENERATING', () => {
    const state = createInitialState();
    const newState = tripReducer(state, { type: ACTIONS.START_GENERATING });
    expect(newState.isGenerating).toBe(true);
    expect(newState.phase).toBe('generating');
    expect(newState.alerts.length).toBe(0);
  });

  it('should update itinerary and phase on SET_ITINERARY', () => {
    const state = createInitialState();
    const itinerary = { days: [] };
    const newState = tripReducer(state, { type: ACTIONS.SET_ITINERARY, payload: itinerary });
    expect(newState.itinerary).toBe(itinerary);
    expect(newState.isGenerating).toBe(false);
    expect(newState.phase).toBe('result');
  });
});
