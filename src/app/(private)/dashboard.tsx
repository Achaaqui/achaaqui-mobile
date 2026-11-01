import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, type ScrollViewInstance, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { z } from 'zod';

import { useConversationQuery, useResearchMutation } from '@/hooks/ai';
import { getConversationId } from '@/lib/conversation';
import type { ConversationMessage } from '@/types/api';

const searchSchema = z.object({
  prompt: z.string().min(3, 'Descreva o serviço que você está procurando.'),
});
type SearchFormValues = z.infer<typeof searchSchema>;

const markdownStyles = {
  body: { color: '#064e3b', fontSize: 16, lineHeight: 24 },
  bullet_list: { marginBottom: 8 },
  bullet_list_icon: { color: '#047857' },
  heading1: { color: '#022c22', fontSize: 22, fontWeight: '700' as const, marginBottom: 8 },
  heading2: { color: '#022c22', fontSize: 19, fontWeight: '700' as const, marginBottom: 6 },
  link: { color: '#047857', textDecorationLine: 'underline' as const },
  paragraph: { marginBottom: 10 },
  strong: { color: '#022c22', fontWeight: '700' as const },
};

export default function DashboardScreen() {
  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const submittingPromptRef = useRef(false);
  const { height: windowHeight } = useWindowDimensions();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [newMessages, setNewMessages] = useState<ConversationMessage[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchFormValues>({
    defaultValues: { prompt: '' },
    resolver: zodResolver(searchSchema),
  });
  const {
    mutateAsync: research,
    answer,
    isPending: isResearching,
  } = useResearchMutation();
  const { data: savedConversation } = useConversationQuery(conversationId);
  const messages = [...(savedConversation?.messages ?? []), ...newMessages];

  useEffect(() => {
    void getConversationId().then(setConversationId);
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const androidWindowWasResized = Dimensions.get('screen').height - windowHeight > 160;
  const composerKeyboardOffset =
    Platform.OS === 'android' && !androidWindowWasResized ? keyboardHeight : 0;

  async function handleResearch({ prompt }: SearchFormValues) {
    if (!conversationId) {
      return;
    }

    submittingPromptRef.current = true;
    const userMessage = { role: 'user' as const, content: prompt };
    setNewMessages((currentMessages) => [...currentMessages, userMessage]);
    reset();

    try {
      const response = await research({ prompt, conversation_id: conversationId });
      setNewMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: response.answer },
      ]);
    } catch {
      // The request hook displays a Toast with the error.
    } finally {
      submittingPromptRef.current = false;
    }
  }

  function submitPrompt() {
    if (submittingPromptRef.current) {
      return;
    }
    void handleSubmit(handleResearch)();
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-950" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
      <View className="border-b border-brand-800 px-6 pb-4 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Voltar para conversas"
            className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-brand-100"
            onPress={() => router.push('/conversations')}>
            <Ionicons color="#047857" name="arrow-back" size={22} />
          </Pressable>
          <Ionicons color="#d1fae5" name="search-outline" size={30} />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-white px-6 py-5"
        contentContainerClassName="gap-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 ? (
          <View className="self-start rounded-2xl bg-brand-900 px-4 py-3">
            <Text className="text-base leading-6 text-brand-100">
              Conte o serviço que procura e sua cidade ou bairro. Eu pesquiso opções e explico os pontos importantes.
            </Text>
          </View>
        ) : null}

        {messages.map((message, index) => (
          <View
            key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
            className={message.role === 'user' ? 'self-end rounded-2xl bg-brand-500 px-4 py-3' : 'self-start rounded-2xl bg-white px-4 py-3'}>
            {message.role === 'user' ? (
              <Text className="text-base leading-6 text-brand-950">{message.content}</Text>
            ) : (
              <Markdown style={markdownStyles}>{message.content}</Markdown>
            )}
          </View>
        ))}

        {isResearching ? (
          <View className="self-start rounded-2xl bg-white px-4 py-3">
            {answer ? <Markdown style={markdownStyles}>{answer}</Markdown> : <Text className="text-sm text-brand-700">Pesquisando opções...</Text>}
          </View>
        ) : null}
      </ScrollView>

      <View
        className="border-t border-brand-800 px-6 py-4"
        style={{ marginBottom: composerKeyboardOffset }}>
        <View className="relative">
          <Controller
            control={control}
            name="prompt"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                className="min-h-24 rounded-xl bg-white px-4 pb-12 pt-3 text-base text-brand-950"
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={submitPrompt}
                placeholder="Ex.: Preciso de uma oficina mecânica confiável em Uberlândia."
                placeholderTextColor="#6b7280"
                returnKeyType="send"
                submitBehavior="submit"
                textAlignVertical="top"
                value={value}
              />
            )}
          />
          <Pressable
            className="absolute bottom-3 right-3 h-9 w-9 items-center justify-center rounded-full bg-brand-500 active:bg-brand-400"
            disabled={isResearching || !conversationId}
            onPress={submitPrompt}>
            <Ionicons color="#022c22" name="send" size={18} />
          </Pressable>
        </View>
        {errors.prompt ? <Text className="mt-2 text-sm text-red-200">{errors.prompt.message}</Text> : null}
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
