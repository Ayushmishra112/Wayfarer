import { describe, it, expect } from 'vitest';
import { stableLevel } from './math';

describe('stableLevel', () => {
  it('should return a number between 20 and 80', () => {
    const result = stableLevel('Tokyo');
    expect(result).toBeGreaterThanOrEqual(20);
    expect(result).toBeLessThanOrEqual(80);
  });

  it('should be deterministic (same input, same output)', () => {
    const first = stableLevel('Paris');
    const second = stableLevel('Paris');
    expect(first).toBe(second);
  });

  it('should return 50 for empty input', () => {
    expect(stableLevel('')).toBe(50);
  });

  it('should return different values for different strings', () => {
    const first = stableLevel('London');
    const second = stableLevel('Berlin');
    expect(first).not.toBe(second);
  });
});
