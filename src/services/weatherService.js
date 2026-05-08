// src/services/weatherService.js
// Abstraction layer for Open-Meteo API (No API key required!)



/**
 * Fetches current weather for a given city name.
 * Returns normalized weather data object.
 */
export async function getCurrentWeather(city) {
  try {
    // 1. Get coordinates for the city
    const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geoUrl.searchParams.append('name', city);
    geoUrl.searchParams.append('count', '1');
    geoUrl.searchParams.append('language', 'en');
    geoUrl.searchParams.append('format', 'json');

    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const location = geoData.results[0];

    // 2. Get weather for those coordinates
    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
    weatherUrl.searchParams.append('latitude', location.latitude);
    weatherUrl.searchParams.append('longitude', location.longitude);
    weatherUrl.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m');
    weatherUrl.searchParams.append('wind_speed_unit', 'ms');

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;
    const { condition, description, isRainy } = interpretWeatherCode(current.weather_code);

    return {
      city: location.name,
      country: location.country_code,
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      condition,
      description,
      icon: '01d', // Mock icon
      windSpeed: current.wind_speed_10m,
      visibility: 10, // Mock visibility
      isRainy,
    };
  } catch (error) {
    console.warn('Weather API unavailable, using mock data:', error.message);
    return getMockWeather(city);
  }
}

/**
 * Maps WMO weather codes to our condition strings
 */
export function interpretWeatherCode(code) {
  if (code === 0) return { condition: 'Clear', description: 'clear sky', isRainy: false };
  if (code <= 3) return { condition: 'Clouds', description: 'cloudy', isRainy: false };
  if (code === 45 || code === 48) return { condition: 'Fog', description: 'foggy', isRainy: false };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', description: 'drizzle', isRainy: true };
  if (code >= 61 && code <= 67) return { condition: 'Rain', description: 'rain', isRainy: true };
  if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'snow', isRainy: false };
  if (code >= 80 && code <= 82) return { condition: 'Rain', description: 'rain showers', isRainy: true };
  if (code >= 85 && code <= 86) return { condition: 'Snow', description: 'snow showers', isRainy: false };
  if (code >= 95) return { condition: 'Thunderstorm', description: 'thunderstorm', isRainy: true };
  
  return { condition: 'Clear', description: 'clear', isRainy: false };
}

/**
 * Returns realistic mock weather data for demonstration
 */
function getMockWeather(city) {
  const conditions = [
    { condition: 'Clear', description: 'clear sky', isRainy: false, temp: 26 },
    { condition: 'Clouds', description: 'scattered clouds', isRainy: false, temp: 22 },
    { condition: 'Rain', description: 'light rain', isRainy: true, temp: 18 },
  ];

  // Use city name hash for consistent demo data
  const idx = city.length % conditions.length;
  const weather = conditions[idx];

  return {
    city,
    country: 'JP',
    temp: weather.temp,
    feelsLike: weather.temp - 2,
    humidity: 65,
    condition: weather.condition,
    description: weather.description,
    icon: '01d',
    windSpeed: 3.5,
    visibility: 10,
    isRainy: weather.isRainy,
  };
}

/**
 * Returns weather icon emoji for a condition string
 */
export function getWeatherEmoji(condition) {
  const map = {
    Clear: '☀️',
    Clouds: '⛅',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
  };
  return map[condition] || '🌡️';
}
