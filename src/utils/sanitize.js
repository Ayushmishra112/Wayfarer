// src/utils/sanitize.js
// Input sanitization utilities for security-critical user inputs

/**
 * Sanitizes a free-text travel field.
 * Strips code injection characters and limits string length.
 * @param {string} value - Raw user input
 * @param {number} [maxLength=300] - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeText(value, maxLength = 300) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>{}[\]\\]/g, '')  // Remove potential injection chars
    .substring(0, maxLength)
    .trim();
}

/**
 * Validates and normalizes a duration value.
 * @param {number|string} value - Raw duration input
 * @param {number} [defaultDays=3] - Default fallback
 * @returns {number} A validated duration between 1 and 30
 */
export function normalizeDuration(value, defaultDays = 3) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1) return defaultDays;
  if (num > 30) return 30;
  return num;
}

/**
 * Validates a budget string against the allowed set.
 * @param {string} value - Raw budget string
 * @returns {string} One of 'low' | 'medium' | 'high' or ''
 */
export function normalizeBudget(value) {
  const allowed = ['low', 'medium', 'high'];
  if (typeof value !== 'string') return '';
  const lower = value.toLowerCase().trim();
  return allowed.includes(lower) ? lower : '';
}

/**
 * Validates a vibe string against the allowed set.
 * @param {string} value - Raw vibe string
 * @returns {string} One of the allowed vibes or ''
 */
export function normalizeVibe(value) {
  const allowed = ['explorer', 'relaxed', 'luxury', 'chaos'];
  if (typeof value !== 'string') return '';
  const lower = value.toLowerCase().trim();
  return allowed.includes(lower) ? lower : '';
}
