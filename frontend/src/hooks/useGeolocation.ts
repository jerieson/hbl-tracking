import { useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
  getCurrentLocation: () => Promise<void>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    } catch (err) {
      const error = err as GeolocationPositionError;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Location permission denied. Please enable location access.');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          setError('Location request timed out.');
          break;
        default:
          setError('An unknown error occurred while getting location.');
      }
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  return { coordinates, error, loading, getCurrentLocation };
};