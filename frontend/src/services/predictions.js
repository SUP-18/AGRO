import api from './api';

export const predictYield = async (predictionData) => {
  const response = await api.post('/predictions/predict', predictionData);
  return response.data;
};

export const getPredictions = async () => {
  const response = await api.get('/predictions');
  return response.data;
};

export const getPredictionHistory = async (page = 1, perPage = 10) => {
  const response = await api.get(`/predictions/history?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const getPredictionDetail = async (id) => {
  const response = await api.get(`/predictions/${id}`);
  return response.data;
};
