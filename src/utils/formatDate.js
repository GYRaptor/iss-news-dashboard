/**
 * Format a date string or timestamp into a readable date string.
 * @param {string|number|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time in the output
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, includeTime = true) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString(undefined, options);
};

/**
 * Format a timestamp into a time string (HH:MM:SS)
 * @param {number|Date} timestamp 
 * @returns {string}
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
