// src/hooks/useWeather.js
import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherApi';

export const useWeather = (coords) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords.lat || !coords.lon) return;

    const getWeatherData = async () => {
      setLoading(true);
      try {
        const weather = await fetchWeather(coords.lat, coords.lon);
        setData(weather);
      } catch (error) {
        console.error("Gagal mengambil data cuaca", error);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [coords.lat, coords.lon]); // Gunakan koordinat sebagai dependency

  return { data, loading };
};