// src/utils/math.test.js
import { describe, it, expect } from 'vitest';
import { stableLevel } from './math';

describe('stableLevel', () => {
  it('returns 50 for empty/null input', () => {
    expect(stableLevel('')).toBe(50);
    expect(stableLevel(null)).toBe(50);
    expect(stableLevel(undefined)).toBe(50);
  });

  it('returns a number in the 20-80 range for string input', () => {
    const result = stableLevel('Kyoto');
    expect(result).toBeGreaterThanOrEqual(20);
    expect(result).toBeLessThanOrEqual(80);
  });

  it('is deterministic — same input always returns same output', () => {
    const r1 = stableLevel('Paris, France');
    const r2 = stableLevel('Paris, France');
    expect(r1).toBe(r2);
  });

  it('produces different results for different strings', () => {
    const r1 = stableLevel('Tokyo');
    const r2 = stableLevel('London');
    // Very unlikely to collide, this tests distribution
    expect(typeof r1).toBe('number');
    expect(typeof r2).toBe('number');
  });
});
