import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
    <SafeAreaView className="flex-1 bg-brand-950">
      <View className="absolute -right-16 top-6 h-48 w-48 rounded-full bg-brand-800 opacity-60" />
      <View className="px-6 pb-6 pt-5">
        <View className="mb-7 flex-row items-center justify-between">
          <View>
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-7 w-7 items-center justify-center rounded-lg bg-brand-700">
                <Ionicons color="#d1fae5" name="search" size={15} />
              </View>
              <Text className="text-xs font-bold tracking-widest text-brand-300">ACHA AQUI</Text>
            </View>
            <Text className="text-3xl font-extrabold tracking-tight text-white">Conversas</Text>
            <Text className="mt-1 text-sm text-brand-200">Suas pesquisas recentes</Text>
          </View>
          <Pressable
            accessibilityLabel="Novo chat"
            className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-400 shadow-lg shadow-black/30 active:bg-brand-300"
            onPress={() => void createConversation()}>
            <Ionicons color="#022c22" name="add" size={27} />
          </Pressable>
        </View>

      {isLoading ? <Text className="text-brand-200">Carregando conversas...</Text> : null}
      {!isLoading && conversations?.length === 0 ? (
        <View className="mt-10 items-center rounded-3xl border border-brand-800 bg-brand-900 px-6 py-9">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-brand-800">
            <Ionicons color="#a7f3d0" name="chatbubbles-outline" size={27} />
          </View>
          <Text className="text-center text-lg font-bold text-white">Sua primeira busca começa aqui</Text>
          <Text className="mt-2 text-center leading-6 text-brand-200">Toque no + e conte qual serviço você procura.</Text>
        </View>
      ) : null}

      <ScrollView contentContainerClassName="gap-3 pb-8">
        {conversations?.map((conversation) => (
          <Pressable
            key={conversation.id}
            className="flex-row items-center rounded-3xl border border-brand-800 bg-brand-900 px-4 py-4 active:bg-brand-800"
            onPress={() => void openConversation(conversation.id)}>
            <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-brand-800">
              <Ionicons color="#6ee7b7" name="chatbubble-ellipses-outline" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white" numberOfLines={2}>
                {conversation.title}
              </Text>
              <Text className="mt-1 text-sm text-brand-200">
                {new Date(conversation.updated_at).toLocaleString('pt-BR')}
              </Text>
            </View>
            <Ionicons color="#6ee7b7" name="chevron-forward" size={20} />
          </Pressable>
        ))}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
