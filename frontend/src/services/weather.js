import api from './api';

export const getCurrentWeather = async (city = 'punjab') => {
  const response = await api.get(`/weather/current?city=${city}`);
  return response.data;
};

export const getForecast = async (city = 'punjab', days = 5) => {
  const response = await api.get(`/weather/forecast?city=${city}&days=${days}`);
  return response.data;
};

export const getWeatherAlerts = async () => {
  const response = await api.get('/weather/alerts');
  return response.data;
};
