import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useConversationsQuery } from '@/hooks/ai';
import { createConversationId, setConversationId } from '@/lib/conversation';

export default function ConversationsScreen() {
  const {
    data: conversations,
    isLoading,
  } = useConversationsQuery();

  async function openConversation(conversationId: string) {
    await setConversationId(conversationId);
    router.replace('/dashboard');
  }

  async function createConversation() {
    await createConversationId();
    router.replace('/dashboard');
  }

  return (
    <View className="flex-1 bg-brand-950 px-6 pb-6 pt-16">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-white">Conversas</Text>
        <Pressable className="rounded-xl bg-brand-500 px-4 py-3 active:bg-brand-400" onPress={() => void createConversation()}>
          <Text className="font-bold text-brand-950">Novo chat</Text>
        </Pressable>
      </View>

      {isLoading ? <Text className="text-brand-200">Carregando conversas...</Text> : null}
      {!isLoading && conversations?.length === 0 ? (
        <Text className="text-brand-200">Você ainda não iniciou nenhuma conversa.</Text>
      ) : null}

      <ScrollView contentContainerClassName="gap-3">
        {conversations?.map((conversation) => (
          <Pressable
            key={conversation.id}
            className="rounded-xl bg-brand-900 px-4 py-4 active:bg-brand-800"
            onPress={() => void openConversation(conversation.id)}>
            <Text className="text-base font-semibold text-white" numberOfLines={2}>
              {conversation.title}
            </Text>
            <Text className="mt-1 text-sm text-brand-200">
              {new Date(conversation.updated_at).toLocaleString('pt-BR')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
