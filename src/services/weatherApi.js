const GEO_URL = "https://nominatim.openstreetmap.org/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const searchLocation = async (query) => {
    const response = await fetch(`${GEO_URL}?q=${query}&format=json&limit=5`);
    return await response.json();
};

export const fetchWeather = async (lat, lon) => {
    const response = await fetch(
        `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    return await response.json();
};