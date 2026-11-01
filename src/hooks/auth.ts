import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import api, { saveAccessToken } from '@/lib/api';
import type { LoginRequest, SignupRequest, TokenResponse } from '@/types/api';

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await api.post<TokenResponse>('/auth/login', payload);
      return data;
    },
    onSuccess: async ({ access_token }) => saveAccessToken(access_token),
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
      return data;
    },
    onSuccess: async ({ access_token }) => saveAccessToken(access_token),
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível criar a conta',
        text2: error.message,
      });
    },
  });
}
