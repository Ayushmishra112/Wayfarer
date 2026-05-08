// src/utils/math.js

/**
 * Deterministic pseudo-random based on string hash.
 * Used for consistent demo data (e.g. crowd levels).
 */
export function stableLevel(str) {
  let h = 0;
  if (!str) return 50;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return (h % 60) + 20; // 20–80 range
}
