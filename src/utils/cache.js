/**
 * Cache utilities to handle storing and retrieving data with expiration.
 */

const CACHE_PREFIX = 'iss_dashboard_';

/**
 * Save data to localStorage with an expiration time.
 * @param {string} key - The cache key
 * @param {any} data - The data to store
 * @param {number} expirationMinutes - How long the cache should be valid in minutes
 */
export const setCache = (key, data, expirationMinutes = 15) => {
  const now = new Date();
  const item = {
    data: data,
    expiry: now.getTime() + expirationMinutes * 60 * 1000,
  };
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

/**
 * Get data from localStorage if it hasn't expired.
 * @param {string} key - The cache key
 * @returns {any|null} - The cached data or null if expired/not found
 */
export const getCache = (key) => {
  const itemStr = localStorage.getItem(CACHE_PREFIX + key);
  
  if (!itemStr) {
    return null;
  }
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    // Compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

/**
 * Remove an item from cache.
 * @param {string} key - The cache key
 */
export const removeCache = (key) => {
  localStorage.removeItem(CACHE_PREFIX + key);
};
