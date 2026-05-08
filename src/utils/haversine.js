/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of the first point in degrees
 * @param {number} lon1 - Longitude of the first point in degrees
 * @param {number} lat2 - Latitude of the second point in degrees
 * @param {number} lon2 - Longitude of the second point in degrees
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

/**
 * Calculates speed in km/h given two sets of coordinates and the time difference.
 * 
 * @param {Object} pos1 - { lat, lon, timestamp }
 * @param {Object} pos2 - { lat, lon, timestamp }
 * @returns {number} - Speed in km/h
 */
export const calculateSpeed = (pos1, pos2) => {
  if (!pos1 || !pos2) return 0;

  const distance = calculateDistance(pos1.lat, pos1.lon, pos2.lat, pos2.lon);
  
  // Time difference in hours
  const timeDiffHours = Math.abs(pos2.timestamp - pos1.timestamp) / (1000 * 60 * 60);

  if (timeDiffHours === 0) return 0;

  return Math.round(distance / timeDiffHours);
};
