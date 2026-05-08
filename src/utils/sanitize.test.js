// src/utils/sanitize.test.js
import { describe, it, expect } from 'vitest';
import { sanitizeText, normalizeDuration, normalizeBudget, normalizeVibe } from './sanitize';

describe('sanitizeText', () => {
  it('removes code injection characters', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('trims whitespace', () => {
    expect(sanitizeText('  Paris  ')).toBe('Paris');
  });

  it('respects maxLength', () => {
    const long = 'a'.repeat(500);
    expect(sanitizeText(long, 300).length).toBe(300);
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(123)).toBe('');
  });

  it('allows normal travel text through', () => {
    const input = "Paris, France - 5 days! Croissants & museums.";
    expect(sanitizeText(input)).toBe(input);
  });
});

describe('normalizeDuration', () => {
  it('returns the numeric value for valid input', () => {
    expect(normalizeDuration(5)).toBe(5);
    expect(normalizeDuration('7')).toBe(7);
  });

  it('returns the default for NaN input', () => {
    expect(normalizeDuration('abc')).toBe(3);
    expect(normalizeDuration(null)).toBe(3);
  });

  it('clamps values below 1 to the default', () => {
    expect(normalizeDuration(0)).toBe(3);
    expect(normalizeDuration(-5)).toBe(3);
  });

  it('caps values above 30 to 30', () => {
    expect(normalizeDuration(100)).toBe(30);
    expect(normalizeDuration(31)).toBe(30);
  });

  it('uses custom default when provided', () => {
    expect(normalizeDuration(null, 7)).toBe(7);
  });
});

describe('normalizeBudget', () => {
  it('returns valid budget strings', () => {
    expect(normalizeBudget('low')).toBe('low');
    expect(normalizeBudget('medium')).toBe('medium');
    expect(normalizeBudget('high')).toBe('high');
  });

  it('is case-insensitive', () => {
    expect(normalizeBudget('LOW')).toBe('low');
    expect(normalizeBudget('Medium')).toBe('medium');
  });

  it('returns empty string for unknown budgets', () => {
    expect(normalizeBudget('ultra')).toBe('');
    expect(normalizeBudget('')).toBe('');
  });

  it('returns empty string for non-string input', () => {
    expect(normalizeBudget(null)).toBe('');
  });
});

describe('normalizeVibe', () => {
  it('returns valid vibe strings', () => {
    expect(normalizeVibe('explorer')).toBe('explorer');
    expect(normalizeVibe('relaxed')).toBe('relaxed');
    expect(normalizeVibe('luxury')).toBe('luxury');
    expect(normalizeVibe('chaos')).toBe('chaos');
  });

  it('is case-insensitive', () => {
    expect(normalizeVibe('EXPLORER')).toBe('explorer');
    expect(normalizeVibe('Relaxed')).toBe('relaxed');
  });

  it('returns empty string for unknown vibes', () => {
    expect(normalizeVibe('adventure')).toBe('');
    expect(normalizeVibe('')).toBe('');
  });

  it('returns empty string for non-string input', () => {
    expect(normalizeVibe(undefined)).toBe('');
  });
});
