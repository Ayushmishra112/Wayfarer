import { describe, it, expect } from 'vitest';
import { interpretWeatherCode, getWeatherEmoji } from './weatherService';

describe('weatherService', () => {
  describe('interpretWeatherCode', () => {
    it('returns Clear for code 0', () => {
      expect(interpretWeatherCode(0)).toEqual({ condition: 'Clear', description: 'clear sky', isRainy: false });
    });

    it('returns Clouds for codes 1-3', () => {
      expect(interpretWeatherCode(2)).toEqual({ condition: 'Clouds', description: 'cloudy', isRainy: false });
    });

    it('returns Drizzle for codes 51-57', () => {
      expect(interpretWeatherCode(51)).toEqual({ condition: 'Drizzle', description: 'drizzle', isRainy: true });
    });

    it('returns Rain for codes 61-67', () => {
      expect(interpretWeatherCode(65)).toEqual({ condition: 'Rain', description: 'rain', isRainy: true });
    });

    it('returns Thunderstorm for code 95', () => {
      expect(interpretWeatherCode(95)).toEqual({ condition: 'Thunderstorm', description: 'thunderstorm', isRainy: true });
    });
  });

  describe('getWeatherEmoji', () => {
    it('returns correct emoji for Clear', () => {
      expect(getWeatherEmoji('Clear')).toBe('☀️');
    });

    it('returns default emoji for unknown condition', () => {
      expect(getWeatherEmoji('Unknown')).toBe('🌡️');
    });
  });
});
