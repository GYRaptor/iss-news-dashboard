import { useState, useEffect, useCallback } from 'react';
import { fetchISSLocation, fetchNearestPlace, fetchAstronauts } from '../services/api';
import { calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

export const useISSData = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [path, setPath] = useState([]); // Last 15 positions
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]); // Last 30 speeds
  const [locationName, setLocationName] = useState('Fetching...');
  const [astronauts, setAstronauts] = useState({ count: 0, people: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAstronautData = async () => {
    try {
      const data = await fetchAstronauts();
      setAstronauts(data);
    } catch (err) {
      console.error('Failed to load astronauts');
    }
  };

  const updateLocation = useCallback(async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      
      const newPos = await fetchISSLocation();
      
      setCurrentPosition(prev => {
        if (prev) {
          // Calculate speed
          const currentSpeed = calculateSpeed(prev, newPos);
          setSpeed(currentSpeed);
          
          setSpeedHistory(prevHistory => {
            const newHistory = [...prevHistory, { time: new Date(newPos.timestamp).toLocaleTimeString(), speed: currentSpeed }];
            return newHistory.slice(-30);
          });
        }
        return newPos;
      });

      setPath(prevPath => {
        const newPath = [...prevPath, newPos];
        return newPath.slice(-15);
      });

      // Reverse Geocoding
      const place = await fetchNearestPlace(newPos.lat, newPos.lon);
      setLocationName(place);
      
      setError(null);
      if (isManual) toast.success('ISS Location updated!');
    } catch (err) {
      setError('Failed to fetch ISS location.');
      if (isManual) toast.error('Failed to update ISS Location.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAstronautData();
    updateLocation();

    const interval = setInterval(() => {
      updateLocation();
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [updateLocation]);

  return {
    currentPosition,
    path,
    speed,
    speedHistory,
    locationName,
    astronauts,
    loading,
    error,
    refreshLocation: () => updateLocation(true)
  };
};
