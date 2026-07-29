import axios from 'axios';
import type { HealthResponse, SchemaResponse, PredictRequest, PredictResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/api/health');
  return response.data;
};

export const getSchema = async (): Promise<SchemaResponse> => {
  const response = await apiClient.get<SchemaResponse>('/api/schema');
  return response.data;
};

export const predictWAAM = async (payload: PredictRequest): Promise<PredictResponse> => {
  const response = await apiClient.post<PredictResponse>('/api/predict', payload);
  return response.data;
};
