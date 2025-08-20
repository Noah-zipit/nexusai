 import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'NexusAI',
  storeName: 'app_data',
  description: 'NexusAI application data'
});

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {Promise<any>} - Stored value or default
 */
export async function getItem(key, defaultValue = null) {
  try {
    const value = await localforage.getItem(key);
    return value === null ? defaultValue : value;
  } catch (error) {
    console.error(`Error getting item '${key}' from storage:`, error);
    return defaultValue;
  }
}

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {Promise<boolean>} - Success status
 */
export async function setItem(key, value) {
  try {
    await localforage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error saving item '${key}' to storage:`, error);
    return false;
  }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key to remove
 * @returns {Promise<boolean>} - Success status
 */
export async function removeItem(key) {
  try {
    await localforage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item '${key}' from storage:`, error);
    return false;
  }
}

/**
 * Clear all data from storage
 * @returns {Promise<boolean>} - Success status
 */
export async function clearStorage() {
  try {
    await localforage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Get all keys in storage
 * @returns {Promise<Array<string>>} - Array of keys
 */
export async function getKeys() {
  try {
    return await localforage.keys();
  } catch (error) {
    console.error('Error getting storage keys:', error);
    return [];
  }
}