// src/store/tripStore.test.js — Comprehensive Reducer Tests
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

  it('should merge preferences, not replace them', () => {
    const state = { ...createInitialState(), preferences: { destination: 'Tokyo', duration: 5 } };
    const newState = tripReducer(state, {
      type: ACTIONS.SET_PREFERENCES,
      payload: { duration: 7 },
    });
    expect(newState.preferences.destination).toBe('Tokyo');
    expect(newState.preferences.duration).toBe(7);
  });

  it('should set isGenerating to true and clear alerts on START_GENERATING', () => {
    const state = createInitialState();
    const newState = tripReducer(state, { type: ACTIONS.START_GENERATING });
    expect(newState.isGenerating).toBe(true);
    expect(newState.phase).toBe('generating');
    expect(newState.alerts.length).toBe(0);
  });

  it('should set error to null on START_GENERATING', () => {
    const state = { ...createInitialState(), error: 'previous error' };
    const newState = tripReducer(state, { type: ACTIONS.START_GENERATING });
    expect(newState.error).toBeNull();
  });

  it('should update itinerary and phase on SET_ITINERARY', () => {
    const state = createInitialState();
    const itinerary = { days: [] };
    const newState = tripReducer(state, { type: ACTIONS.SET_ITINERARY, payload: itinerary });
    expect(newState.itinerary).toBe(itinerary);
    expect(newState.isGenerating).toBe(false);
    expect(newState.phase).toBe('result');
  });

  it('should update weather on SET_WEATHER', () => {
    const state = createInitialState();
    const weather = { city: 'Kyoto', temp: 22, condition: 'Sunny' };
    const newState = tripReducer(state, { type: ACTIONS.SET_WEATHER, payload: weather });
    expect(newState.weather).toEqual(weather);
  });

  it('should add an alert on ADD_ALERT', () => {
    const state = { ...createInitialState(), alerts: [] };
    const alert = { id: 'test-1', type: 'info', title: 'Test', message: 'Hello' };
    const newState = tripReducer(state, { type: ACTIONS.ADD_ALERT, payload: alert });
    expect(newState.alerts.length).toBe(1);
    expect(newState.alerts[0].id).toBe('test-1');
  });

  it('should prepend new alerts to the front', () => {
    const existing = { id: 'old', type: 'info', title: 'Old', message: '' };
    const state = { ...createInitialState(), alerts: [existing] };
    const newAlert = { id: 'new', type: 'success', title: 'New', message: '' };
    const newState = tripReducer(state, { type: ACTIONS.ADD_ALERT, payload: newAlert });
    expect(newState.alerts[0].id).toBe('new');
  });

  it('should cap alerts at 10 entries', () => {
    const tenAlerts = Array.from({ length: 10 }, (_, i) => ({ id: `a${i}` }));
    const state = { ...createInitialState(), alerts: tenAlerts };
    const newAlert = { id: 'overflow', type: 'info', title: 'X', message: '' };
    const newState = tripReducer(state, { type: ACTIONS.ADD_ALERT, payload: newAlert });
    expect(newState.alerts.length).toBe(10);
    expect(newState.alerts[0].id).toBe('overflow');
  });

  it('should dismiss an alert by id on DISMISS_ALERT', () => {
    const alerts = [{ id: 'keep' }, { id: 'remove' }];
    const state = { ...createInitialState(), alerts };
    const newState = tripReducer(state, { type: ACTIONS.DISMISS_ALERT, payload: 'remove' });
    expect(newState.alerts.length).toBe(1);
    expect(newState.alerts[0].id).toBe('keep');
  });

  it('should set isReplanning and clear proposedReplan on START_REPLANNING', () => {
    const state = { ...createInitialState(), proposedReplan: { foo: 'bar' } };
    const newState = tripReducer(state, { type: ACTIONS.START_REPLANNING });
    expect(newState.isReplanning).toBe(true);
    expect(newState.proposedReplan).toBeNull();
  });

  it('should set proposedReplan on PROPOSE_REPLAN', () => {
    const state = createInitialState();
    const payload = { dayIndex: 1, activities: [], event: {} };
    const newState = tripReducer(state, { type: ACTIONS.PROPOSE_REPLAN, payload });
    expect(newState.proposedReplan).toEqual(payload);
    expect(newState.isReplanning).toBe(false);
  });

  it('should clear proposedReplan on DISCARD_REPLAN', () => {
    const state = { ...createInitialState(), proposedReplan: { dayIndex: 0 } };
    const newState = tripReducer(state, { type: ACTIONS.DISCARD_REPLAN });
    expect(newState.proposedReplan).toBeNull();
  });

  it('should apply a replan to the correct day on APPLY_REPLAN', () => {
    const itinerary = {
      days: [
        { day: 1, activities: [{ place: 'Old Place' }] },
        { day: 2, activities: [{ place: 'Keep Me' }] },
      ],
    };
    const state = { ...createInitialState(), itinerary };
    const payload = { dayIndex: 1, activities: [{ place: 'New Place' }], event: {} };
    const newState = tripReducer(state, { type: ACTIONS.APPLY_REPLAN, payload });
    expect(newState.itinerary.days[0].activities[0].place).toBe('New Place');
    expect(newState.itinerary.days[1].activities[0].place).toBe('Keep Me');
    expect(newState.proposedReplan).toBeNull();
  });

  it('should return state unchanged on APPLY_REPLAN if no itinerary', () => {
    const state = { ...createInitialState(), itinerary: null };
    const newState = tripReducer(state, { type: ACTIONS.APPLY_REPLAN, payload: {} });
    expect(newState).toBe(state);
  });

  it('should set error on SET_ERROR and stop loading states', () => {
    const state = { ...createInitialState(), isGenerating: true, isReplanning: true };
    const newState = tripReducer(state, { type: ACTIONS.SET_ERROR, payload: 'Something failed' });
    expect(newState.error).toBe('Something failed');
    expect(newState.isGenerating).toBe(false);
    expect(newState.isReplanning).toBe(false);
  });

  it('should clear all alerts on CLEAR_ALERTS', () => {
    const state = { ...createInitialState(), alerts: [{ id: 'a1' }, { id: 'a2' }] };
    const newState = tripReducer(state, { type: ACTIONS.CLEAR_ALERTS });
    expect(newState.alerts.length).toBe(0);
  });

  it('should return current state for unknown action types', () => {
    const state = createInitialState();
    const newState = tripReducer(state, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(state);
  });
});
