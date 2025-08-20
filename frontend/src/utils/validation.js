/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate that a string has minimum length
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} - True if valid
 */
export function hasMinLength(text, minLength = 1) {
  return text && text.trim().length >= minLength;
}

/**
 * Validate that a string doesn't exceed maximum length
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} - True if valid
 */
export function hasMaxLength(text, maxLength = 1000) {
  return !text || text.length <= maxLength;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 * @param {any} value - Value to check
 * @returns {boolean} - True if empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}