import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import api, { saveAccessToken } from '@/lib/api';
import type { EmailAvailabilityResponse, LoginRequest, SignupRequest, TokenResponse } from '@/types/api';

export function useEmailAvailabilityMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.get<EmailAvailabilityResponse>('/auth/email-availability', {
        params: { email },
      });
      return data;
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await api.post<TokenResponse>('/auth/login', payload);
      await saveAccessToken(data.access_token);
      return data;
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível entrar',
        text2: error.message,
      });
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (payload: SignupRequest) => {
      const { data } = await api.post<TokenResponse>('/auth/signup', payload);
      await saveAccessToken(data.access_token);
      return data;
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível criar a conta',
        text2: error.message,
      });
    },
  });
}
