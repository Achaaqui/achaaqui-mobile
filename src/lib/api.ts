import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'axios';

import type {
  ApiErrorResponse,
} from '@/types/api';

const ACCESS_TOKEN_KEY = '@achaaqui:access-token';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (isApiError(response.data)) {
    return Promise.reject(new Error(response.data.message));
  }

  return response;
});

export async function saveAccessToken(accessToken: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isApiError(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as ApiErrorResponse).success === false
  );
}

export default api;
