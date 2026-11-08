import { useMutation, useQuery } from '@tanstack/react-query';
import { fetch } from 'expo/fetch';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import api, { API_BASE_URL, getAccessToken } from '@/lib/api';
import type {
  ConversationResponse,
  ConversationSummary,
  ResearchRequest,
  ResearchResponse,
} from '@/types/api';

export function useConversationsQuery() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<ConversationSummary[]>('/ai/conversations');
      return data;
    },
    refetchOnMount: 'always',
  });
}

export function useConversationQuery(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    enabled: Boolean(conversationId),
    refetchOnMount: 'always',
    queryFn: async () => {
      const { data } = await api.get<ConversationResponse>(
        `/ai/conversations/${conversationId}/messages`,
      );
      return data;
    },
  });
}

export function useResearchMutation() {
  const [answer, setAnswer] = useState('');
  const mutation = useMutation({
    mutationFn: async (payload: ResearchRequest) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Faça login novamente para pesquisar serviços.');
      }

      const response = await fetch(`${API_BASE_URL}/ai/research/stream`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      if (!response.body) {
        throw new Error('O servidor não iniciou a resposta em streaming.');
      }

      setAnswer('');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          fullAnswer += decoder.decode(value, { stream: true });
          setAnswer(fullAnswer);
        }

        fullAnswer += decoder.decode();
        setAnswer(fullAnswer);
        return { answer: fullAnswer } satisfies ResearchResponse;
      } finally {
        reader.releaseLock();
      }
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível fazer a busca',
        text2: error.message,
      });
    },
  });

  return { ...mutation, answer };
}
